#!/usr/bin/env node

import { fileToTree, TreeOptions } from './index';
import * as fs from 'fs';

function parseOptions(args: string[]): { options: TreeOptions; outputFile?: string; inputFile?: string } {
  const result: { options: TreeOptions; outputFile?: string; inputFile?: string } = { options: {} };
  let i = 0;
  
  while (i < args.length) {
    const arg = args[i];
    
    // Handle input file (first non-option argument)
    if (!arg.startsWith('-') && !result.inputFile) {
      result.inputFile = arg;
      i++;
      continue;
    }
    
    // Handle output option
    if (arg === '--output' || arg === '-o') {
      if (i + 1 < args.length) {
        result.outputFile = args[i + 1];
        i += 2;
        continue;
      }
    }
    
    // Handle TreeOptions
    if (arg === '--root-prefix' || arg === '--rootPrefix') {
      if (i + 1 < args.length) {
        result.options.rootPrefix = args[i + 1];
        i += 2;
        continue;
      }
    }
    
    if (arg === '--branch-char' || arg === '--branchChar') {
      if (i + 1 < args.length) {
        result.options.branchChar = args[i + 1];
        i += 2;
        continue;
      }
    }
    
    if (arg === '--corner-char' || arg === '--cornerChar') {
      if (i + 1 < args.length) {
        result.options.cornerChar = args[i + 1];
        i += 2;
        continue;
      }
    }
    
    if (arg === '--tee-char' || arg === '--teeChar') {
      if (i + 1 < args.length) {
        result.options.teeChar = args[i + 1];
        i += 2;
        continue;
      }
    }
    
    if (arg === '--horizontal-char' || arg === '--horizontalChar') {
      if (i + 1 < args.length) {
        result.options.horizontalChar = args[i + 1];
        i += 2;
        continue;
      }
    }
    
    if (arg === '--indent-size' || arg === '--indentSize') {
      if (i + 1 < args.length) {
        const size = parseInt(args[i + 1], 10);
        if (!isNaN(size)) {
          result.options.indentSize = size;
        }
        i += 2;
        continue;
      }
    }
    
    if (arg === '--max-depth' || arg === '--maxDepth') {
      if (i + 1 < args.length) {
        const depth = parseInt(args[i + 1], 10);
        if (!isNaN(depth)) {
          result.options.maxDepth = depth;
        }
        i += 2;
        continue;
      }
    }
    
    i++;
  }
  
  return result;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
Usage: schemascii <file> [options]

Convert a JSON, JSONC, YAML, or XML file structure to an ASCII directory tree.

Arguments:
  <file>         Path to the JSON, JSONC, YAML, or XML file to convert

Options:
  --help, -h              Show this help message
  --output, -o             Output file path (default: stdout)
  --root-prefix <text>     Root prefix text to display at the top
  --branch-char <char>     Character for vertical branches (default: │)
  --corner-char <char>     Character for corner connectors (default: └)
  --tee-char <char>        Character for tee connectors (default: ├)
  --horizontal-char <char> Character for horizontal lines (default: ─)
  --indent-size <number>   Number of spaces for indentation (default: 2)
  --max-depth <number>      Maximum depth to display (default: unlimited)

Examples:
  schemascii structure.json
  schemascii structure.jsonc
  schemascii structure.yaml
  schemascii structure.xml
  schemascii structure.json -o tree.txt
  schemascii structure.json --max-depth 2
  schemascii structure.json --branch-char "|" --corner-char "'" --tee-char "+"
  schemascii structure.json --indent-size 4 --max-depth 3
    `);
    process.exit(0);
  }
  
  const { options, outputFile, inputFile } = parseOptions(args);
  
  if (!inputFile) {
    console.error('Error: No input file specified.');
    process.exit(1);
  }
  
  // Check if file exists
  if (!fs.existsSync(inputFile)) {
    console.error(`Error: File "${inputFile}" does not exist.`);
    process.exit(1);
  }
  
  try {
    const tree = await fileToTree(inputFile, options);
    
    if (outputFile) {
      fs.writeFileSync(outputFile, tree + '\n', 'utf-8');
      console.log(`Tree written to ${outputFile}`);
    } else {
      console.log(tree);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('Error: Failed to process file.');
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});

