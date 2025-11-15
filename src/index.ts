export interface TreeOptions {
  rootPrefix?: string;
  branchChar?: string;
  cornerChar?: string;
  teeChar?: string;
  horizontalChar?: string;
  indentSize?: number;
  maxDepth?: number;
}

type RequiredTreeOptions = Required<Omit<TreeOptions, 'maxDepth'>> & Pick<TreeOptions, 'maxDepth'>;

const DEFAULT_OPTIONS: RequiredTreeOptions = {
  rootPrefix: '',
  branchChar: '│',
  cornerChar: '└',
  teeChar: '├',
  horizontalChar: '─',
  indentSize: 2,
  maxDepth: undefined,
};

function buildTree(
  obj: Record<string, any>,
  prefix: string = '',
  options: RequiredTreeOptions = DEFAULT_OPTIONS,
  currentDepth: number = 0
): string[] {
  const lines: string[] = [];
  const keys = Object.keys(obj);
  
  // Check if we've reached max depth
  const maxDepth = options.maxDepth;
  const atMaxDepth = maxDepth !== undefined && currentDepth >= maxDepth;
  
  keys.forEach((key, index) => {
    const isLastKey = index === keys.length - 1;
    const connector = isLastKey ? options.cornerChar : options.teeChar;
    const currentPrefix = prefix + connector + options.horizontalChar.repeat(options.indentSize - 1) + ' ';
    const value = obj[key];
    
    // Add the current directory/file
    lines.push(currentPrefix + key);
    
    // If the value is an object (nested directory), recurse if not at max depth
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (atMaxDepth) {
        // Show indicator that there's more content
        const childKeys = Object.keys(value);
        if (childKeys.length > 0) {
          const indicatorPrefix = prefix + (isLastKey ? ' '.repeat(options.indentSize) : options.branchChar + ' '.repeat(options.indentSize - 1));
          lines.push(indicatorPrefix + '...');
        }
      } else {
        const nextPrefix = prefix + (isLastKey ? ' '.repeat(options.indentSize) : options.branchChar + ' '.repeat(options.indentSize - 1));
        const nestedLines = buildTree(value, nextPrefix, options, currentDepth + 1);
        lines.push(...nestedLines);
      }
    }
  });
  
  return lines;
}

export function schemaToTree(
  jsonObject: Record<string, any>,
  options: TreeOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const keys = Object.keys(jsonObject);
  
  if (keys.length === 0) {
    return opts.rootPrefix || '.';
  }
  
  const lines: string[] = [];
  
  // Handle root level
  if (opts.rootPrefix) {
    lines.push(opts.rootPrefix);
  }
  
  // Check if we're at max depth (root level is depth 0)
  const maxDepth = opts.maxDepth;
  const atMaxDepth = maxDepth !== undefined && maxDepth <= 0;
  
  keys.forEach((key, index) => {
    const isLastKey = index === keys.length - 1;
    const connector = isLastKey ? opts.cornerChar : opts.teeChar;
    const prefix = ''; // Don't use rootPrefix in tree structure, only show it once at top
    const currentPrefix = prefix + connector + opts.horizontalChar.repeat(opts.indentSize - 1) + ' ';
    
    lines.push(currentPrefix + key);
    
    const value = jsonObject[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (atMaxDepth) {
        // Show indicator that there's more content
        const childKeys = Object.keys(value);
        if (childKeys.length > 0) {
          const indicatorPrefix = prefix + (isLastKey ? ' '.repeat(opts.indentSize) : opts.branchChar + ' '.repeat(opts.indentSize - 1));
          lines.push(indicatorPrefix + '...');
        }
      } else {
        const nextPrefix = prefix + (isLastKey ? ' '.repeat(opts.indentSize) : opts.branchChar + ' '.repeat(opts.indentSize - 1));
        const nestedLines = buildTree(value, nextPrefix, opts, 1);
        lines.push(...nestedLines);
      }
    }
  });
  
  return lines.join('\n');
}

function xmlToObject(xmlContent: string): Record<string, any> {
  const { XMLParser } = require('fast-xml-parser');
  const parser = new XMLParser({
    ignoreAttributes: true,
    ignoreNameSpace: true,
    removeNSPrefix: true,
    parseAttributeValue: false,
    parseNodeValue: false,
    trimValues: true,
    parseTrueNumberOnly: false,
    arrayMode: false,
    alwaysCreateTextNode: false,
    textNodeName: '#text'
  });
  
  const result = parser.parse(xmlContent);
  
  // Convert XML structure to our expected format
  // XML elements map to directory/file structure
  function convertXmlNode(node: any): any {
    if (typeof node !== 'object' || node === null) {
      return {};
    }
    
    // Handle arrays - merge them into the result
    if (Array.isArray(node)) {
      const result: Record<string, any> = {};
      node.forEach((item) => {
        if (typeof item === 'object' && item !== null) {
          for (const [key, value] of Object.entries(item)) {
            if (key !== '#text') {
              result[key] = convertXmlNode(value);
            }
          }
        }
      });
      return result;
    }
    
    const result: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(node)) {
      // Skip text content and processing instructions
      if (key === '#text' || key.startsWith('?xml')) {
        continue;
      }
      
      if (typeof value === 'object' && value !== null) {
        // Check if this has child elements (not just text)
        const childKeys = Object.keys(value).filter(k => k !== '#text');
        
        if (childKeys.length > 0) {
          // Has children - recurse
          result[key] = convertXmlNode(value);
        } else {
          // Leaf node - empty object represents a file/directory
          result[key] = {};
        }
      } else {
        // Primitive value - treat as leaf
        result[key] = {};
      }
    }
    
    return result;
  }
  
  // Get the root element(s)
  const rootKeys = Object.keys(result).filter(k => !k.startsWith('?xml'));
  
  if (rootKeys.length === 1) {
    // Single root element - extract its children
    const rootKey = rootKeys[0];
    const rootValue = result[rootKey];
    if (typeof rootValue === 'object' && rootValue !== null) {
      return convertXmlNode(rootValue);
    }
    return { [rootKey]: {} };
  } else if (rootKeys.length > 1) {
    // Multiple root elements
    return convertXmlNode(result);
  } else {
    // No valid root found
    return {};
  }
}

async function parseFileContent(content: string, filePath: string): Promise<Record<string, any>> {
  const path = await import('path');
  const ext = path.extname(filePath).toLowerCase();
  
  if (ext === '.yaml' || ext === '.yml') {
    const yaml = await import('js-yaml');
    return yaml.load(content) as Record<string, any>;
  } else if (ext === '.jsonc') {
    const stripJsonComments = await import('strip-json-comments');
    const cleaned = stripJsonComments.default(content);
    return JSON.parse(cleaned);
  } else if (ext === '.xml') {
    return xmlToObject(content);
  } else {
    return JSON.parse(content);
  }
}

export async function fileToTree(
  filePath: string,
  options: TreeOptions = {}
): Promise<string> {
  const fs = await import('fs/promises');
  const path = await import('path');
  
  const content = await fs.readFile(filePath, 'utf-8');
  const obj = await parseFileContent(content, filePath);
  
  // Use filename (without extension) as root prefix if not provided
  const opts = { ...options };
  if (!opts.rootPrefix) {
    const basename = path.basename(filePath, path.extname(filePath));
    opts.rootPrefix = basename;
  }
  
  return schemaToTree(obj, opts);
}

