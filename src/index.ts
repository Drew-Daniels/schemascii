export interface TreeOptions {
  rootPrefix?: string;
  branchChar?: string;
  cornerChar?: string;
  teeChar?: string;
  horizontalChar?: string;
  indentSize?: number;
}

const DEFAULT_OPTIONS: Required<TreeOptions> = {
  rootPrefix: '',
  branchChar: '│',
  cornerChar: '└',
  teeChar: '├',
  horizontalChar: '─',
  indentSize: 2,
};

function buildTree(
  obj: Record<string, any>,
  prefix: string = '',
  options: Required<TreeOptions> = DEFAULT_OPTIONS
): string[] {
  const lines: string[] = [];
  const keys = Object.keys(obj);
  
  keys.forEach((key, index) => {
    const isLastKey = index === keys.length - 1;
    const connector = isLastKey ? options.cornerChar : options.teeChar;
    const currentPrefix = prefix + connector + options.horizontalChar.repeat(options.indentSize - 1) + ' ';
    const value = obj[key];
    
    // Add the current directory/file
    lines.push(currentPrefix + key);
    
    // If the value is an object (nested directory), recurse
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nextPrefix = prefix + (isLastKey ? ' '.repeat(options.indentSize) : options.branchChar + ' '.repeat(options.indentSize - 1));
      const nestedLines = buildTree(value, nextPrefix, options);
      lines.push(...nestedLines);
    }
  });
  
  return lines;
}

export function jsonToTree(
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
  
  keys.forEach((key, index) => {
    const isLastKey = index === keys.length - 1;
    const connector = isLastKey ? opts.cornerChar : opts.teeChar;
    const prefix = ''; // Don't use rootPrefix in tree structure, only show it once at top
    const currentPrefix = prefix + connector + opts.horizontalChar.repeat(opts.indentSize - 1) + ' ';
    
    lines.push(currentPrefix + key);
    
    const value = jsonObject[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nextPrefix = prefix + (isLastKey ? ' '.repeat(opts.indentSize) : opts.branchChar + ' '.repeat(opts.indentSize - 1));
      const nestedLines = buildTree(value, nextPrefix, opts);
      lines.push(...nestedLines);
    }
  });
  
  return lines.join('\n');
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
  } else {
    return JSON.parse(content);
  }
}

export async function jsonFileToTree(
  filePath: string,
  options: TreeOptions = {}
): Promise<string> {
  return fileToTree(filePath, options);
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
  
  return jsonToTree(obj, opts);
}

