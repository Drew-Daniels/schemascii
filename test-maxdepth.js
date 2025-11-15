#!/usr/bin/env node

const { schemaToTree } = require('./dist/index.js');

// Deep test data structure
const deepData = {
  "src": {
    "components": {
      "Button.tsx": {},
      "Input.tsx": {
        "types": {
          "props.ts": {},
          "state.ts": {}
        }
      }
    },
    "utils": {
      "helpers": {
        "format.ts": {},
        "validate.ts": {
          "rules": {
            "email.ts": {},
            "phone.ts": {}
          }
        }
      }
    }
  },
  "tests": {
    "unit": {
      "components": {
        "Button.test.tsx": {}
      }
    }
  }
};

console.log('=== Testing Max Depth Feature ===\n');

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

// Test 1: No max depth (should show full tree)
console.log('Test 1: No max depth (unlimited)');
const fullTree = schemaToTree(deepData);
console.log(fullTree);
assert(fullTree.includes('Button.tsx') && fullTree.includes('email.ts'), 'Test 1: Shows all levels');
console.log('\n');

// Test 2: Max depth 1 (root + 1 level)
console.log('Test 2: Max depth 1 (root + 1 level)');
const depth1Tree = schemaToTree(deepData, { maxDepth: 1 });
console.log(depth1Tree);
assert(depth1Tree.includes('src') && depth1Tree.includes('tests'), 'Test 2: Shows root level');
assert(depth1Tree.includes('components') && depth1Tree.includes('utils'), 'Test 2: Shows level 1 children');
assert(!depth1Tree.includes('Button.tsx'), 'Test 2: Does not show level 2');
assert(depth1Tree.includes('...'), 'Test 2: Shows ... indicator');
console.log('\n');

// Test 3: Max depth 2
console.log('Test 3: Max depth 2');
const depth2Tree = schemaToTree(deepData, { maxDepth: 2 });
console.log(depth2Tree);
assert(depth2Tree.includes('components') && depth2Tree.includes('utils'), 'Test 3: Shows level 2');
assert(!depth2Tree.includes('format.ts'), 'Test 3: Does not show level 3');
assert(depth2Tree.includes('...'), 'Test 3: Shows ... indicator');
console.log('\n');

// Test 4: Max depth 3
console.log('Test 4: Max depth 3');
const depth3Tree = schemaToTree(deepData, { maxDepth: 3 });
console.log(depth3Tree);
assert(depth3Tree.includes('format.ts') && depth3Tree.includes('validate.ts'), 'Test 4: Shows level 3');
assert(!depth3Tree.includes('email.ts'), 'Test 4: Does not show level 4');
assert(depth3Tree.includes('...'), 'Test 4: Shows ... indicator');
console.log('\n');

// Test 5: Max depth 0 (should only show root items)
console.log('Test 5: Max depth 0 (root items only)');
const depth0Tree = schemaToTree(deepData, { maxDepth: 0 });
console.log(depth0Tree);
assert(depth0Tree.includes('src') && depth0Tree.includes('tests'), 'Test 5: Shows root items');
assert(depth0Tree.includes('...'), 'Test 5: Shows ... indicator for nested content');
console.log('\n');

// Test 6: Max depth with root prefix
console.log('Test 6: Max depth 2 with root prefix');
const depth2WithPrefix = schemaToTree(deepData, { maxDepth: 2, rootPrefix: 'project' });
console.log(depth2WithPrefix);
assert(depth2WithPrefix.includes('project'), 'Test 6: Shows root prefix');
assert(depth2WithPrefix.includes('...'), 'Test 6: Shows ... indicator');
console.log('\n');

console.log('=== All max depth tests completed ===');
console.log(`\nSummary: ${testsPassed} passed, ${testsFailed} failed`);
process.exit(testsFailed > 0 ? 1 : 0);

