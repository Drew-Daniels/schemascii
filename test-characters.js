#!/usr/bin/env node

const { schemaToTree } = require('./dist/index.js');

// Test data structure
const testData = {
  "src": {
    "components": {
      "Button.tsx": {},
      "Input.tsx": {}
    },
    "utils": {
      "helpers": {
        "format.ts": {}
      }
    }
  },
  "tests": {
    "unit": {}
  }
};

console.log('=== Testing Alternative ASCII Characters ===\n');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✓ ${testName} - PASSED`);
    testsPassed++;
  } else {
    console.log(`✗ ${testName} - FAILED`);
    testsFailed++;
  }
}

// Test 1: Default Unicode box-drawing characters
console.log('Test 1: Default Unicode characters');
const defaultTree = schemaToTree(testData);
console.log(defaultTree);
assert(defaultTree.includes('├') && defaultTree.includes('└') && defaultTree.includes('│'), 'Test 1: Contains Unicode characters');
assert(defaultTree.includes('src') && defaultTree.includes('Button.tsx'), 'Test 1: Contains expected file names');
console.log('\n');

// Test 2: ASCII characters (|, +, -, etc.)
console.log('Test 2: ASCII characters');
const asciiTree = schemaToTree(testData, {
  branchChar: '|',
  cornerChar: '`',
  teeChar: '+',
  horizontalChar: '-'
});
console.log(asciiTree);
assert(asciiTree.includes('+') && asciiTree.includes('`') && asciiTree.includes('|'), 'Test 2: Contains ASCII characters');
assert(asciiTree.includes('src') && asciiTree.includes('Button.tsx'), 'Test 2: Contains expected file names');
console.log('\n');

// Test 3: Simple ASCII characters
console.log('Test 3: Simple ASCII characters');
const simpleTree = schemaToTree(testData, {
  branchChar: '|',
  cornerChar: '\\',
  teeChar: '|',
  horizontalChar: '-'
});
console.log(simpleTree);
console.log('\n');

// Test 4: Space-based characters
console.log('Test 4: Space-based characters');
const spaceTree = schemaToTree(testData, {
  branchChar: ' ',
  cornerChar: ' ',
  teeChar: ' ',
  horizontalChar: ' '
});
console.log(spaceTree);
console.log('\n');

// Test 5: Custom indent size
console.log('Test 5: Custom indent size (4 spaces)');
const indentTree = schemaToTree(testData, {
  indentSize: 4
});
console.log(indentTree);
assert(indentTree.includes('├───'), 'Test 5: Contains 4-space indent pattern');
assert(indentTree.includes('src') && indentTree.includes('Button.tsx'), 'Test 5: Contains expected file names');
console.log('\n');

// Test 6: Custom indent size with ASCII
console.log('Test 6: Custom indent size (3 spaces) with ASCII');
const customIndentTree = schemaToTree(testData, {
  branchChar: '|',
  cornerChar: '`',
  teeChar: '+',
  horizontalChar: '-',
  indentSize: 3
});
console.log(customIndentTree);
console.log('\n');

// Test 7: Root prefix with alternative characters
console.log('Test 7: Root prefix with ASCII characters');
const rootPrefixTree = schemaToTree(testData, {
  rootPrefix: 'project',
  branchChar: '|',
  cornerChar: '`',
  teeChar: '+',
  horizontalChar: '-'
});
console.log(rootPrefixTree);
console.log('\n');

// Test 8: Different corner characters
console.log('Test 8: Different corner characters');
const cornerTree = schemaToTree(testData, {
  branchChar: '|',
  cornerChar: 'L',
  teeChar: 'T',
  horizontalChar: '-'
});
console.log(cornerTree);
console.log('\n');

// Test 9: Single character style
console.log('Test 9: Single character style');
const singleCharTree = schemaToTree(testData, {
  branchChar: '*',
  cornerChar: '*',
  teeChar: '*',
  horizontalChar: '*'
});
console.log(singleCharTree);
console.log('\n');

// Test 10: Empty object
console.log('Test 10: Empty object (should return root prefix or ".")');
const emptyTree = schemaToTree({});
console.log(`Result: "${emptyTree}"`);
assert(emptyTree === '.', 'Test 10: Empty object returns "."');
const emptyTreeWithPrefix = schemaToTree({}, { rootPrefix: 'empty' });
console.log(`Result with prefix: "${emptyTreeWithPrefix}"`);
assert(emptyTreeWithPrefix === 'empty', 'Test 10: Empty object with prefix returns prefix');
console.log('\n');

console.log('=== All character tests completed ===');
console.log(`\nSummary: ${testsPassed} passed, ${testsFailed} failed`);
process.exit(testsFailed > 0 ? 1 : 0);

