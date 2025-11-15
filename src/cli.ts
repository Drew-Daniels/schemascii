#!/usr/bin/env node

import { fileToTree } from './index';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
Usage: json-to-tree <file> [options]

Convert a JSON, JSONC, or YAML file structure to an ASCII directory tree.

Arguments:
  <file>         Path to the JSON, JSONC, or YAML file to convert

Options:
  --help, -h     Show this help message
  --output, -o   Output file path (default: stdout)

Examples:
  json-to-tree structure.json
  json-to-tree structure.jsonc
  json-to-tree structure.yaml
  json-to-tree structure.json -o tree.txt
    `);
    process.exit(0);
  }
  
  const inputFile = args[0];
  
  // Check if file exists
  if (!fs.existsSync(inputFile)) {
    console.error(`Error: File "${inputFile}" does not exist.`);
    process.exit(1);
  }
  
  try {
    const tree = await fileToTree(inputFile);
    
    // Check for output option
    const outputIndex = args.indexOf('--output') !== -1 
      ? args.indexOf('--output')
      : args.indexOf('-o');
    
    if (outputIndex !== -1 && args[outputIndex + 1]) {
      const outputFile = args[outputIndex + 1];
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

