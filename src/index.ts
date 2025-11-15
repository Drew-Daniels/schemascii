/**
 * Converts a JSON object structure to an ASCII directory tree
 */

export interface TreeOptions {
  /**
   * Prefix for the root directory (default: empty string)
   */
  rootPrefix?: string;
  /**
   * Character to use for tree branches (default: '│')
   */
  branchChar?: string;
  /**
   * Character to use for tree corners (default: '└')
   */
  cornerChar?: string;
  /**
   * Character to use for tree tees (default: '├')
   */
  teeChar?: string;
  /**
   * Character to use for horizontal lines (default: '─')
   */
  horizontalChar?: string;
  /**
   * Indentation size (default: 2)
   */
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

/**
 * Recursively builds the tree structure from a JSON object
 */
function buildTree(
  obj: Record<string, any>,
  prefix: string = '',
  isLast: boolean = true,
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
      const nestedLines = buildTree(value, nextPrefix, isLastKey, options);
      lines.push(...nestedLines);
    }
  });
  
  return lines;
}

/**
 * Converts a JSON object to an ASCII directory tree
 * 
 * @param jsonObject - The JSON object where each key represents a directory
 * @param options - Optional configuration for tree output
 * @returns ASCII directory tree string
 * 
 * @example
 * ```typescript
 * const json = {
 *   "src": {
 *     "components": {},
 *     "utils": {
 *       "helpers": {}
 *     }
 *   },
 *   "tests": {}
 * };
 * const tree = jsonToTree(json);
 * console.log(tree);
 * ```
 */
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
      const nestedLines = buildTree(value, nextPrefix, isLastKey, opts);
      lines.push(...nestedLines);
    }
  });
  
  return lines.join('\n');
}

/**
 * Reads a JSON file and converts it to an ASCII directory tree
 * 
 * @param filePath - Path to the JSON file
 * @param options - Optional configuration for tree output
 * @returns ASCII directory tree string
 */
export async function jsonFileToTree(
  filePath: string,
  options: TreeOptions = {}
): Promise<string> {
  const fs = await import('fs/promises');
  const path = await import('path');
  
  const content = await fs.readFile(filePath, 'utf-8');
  const jsonObject = JSON.parse(content);
  
  // Use filename (without extension) as root prefix if not provided
  const opts = { ...options };
  if (!opts.rootPrefix) {
    const basename = path.basename(filePath, path.extname(filePath));
    opts.rootPrefix = basename;
  }
  
  return jsonToTree(jsonObject, opts);
}

