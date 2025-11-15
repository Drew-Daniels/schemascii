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

// Test 7: Custom indicator ">>>"
console.log('Test 7: Custom indicator ">>>"');
const customIndicator1 = schemaToTree(deepData, { maxDepth: 2, maxDepthIndicator: '>>>' });
console.log(customIndicator1);
assert(customIndicator1.includes('>>>'), 'Test 7: Shows custom indicator ">>>"');
assert(!customIndicator1.includes('...'), 'Test 7: Does not show default indicator');
console.log('\n');

// Test 8: Custom indicator "[more]"
console.log('Test 8: Custom indicator "[more]"');
const customIndicator2 = schemaToTree(deepData, { maxDepth: 2, maxDepthIndicator: '[more]' });
console.log(customIndicator2);
assert(customIndicator2.includes('[more]'), 'Test 8: Shows custom indicator "[more]"');
assert(!customIndicator2.includes('...'), 'Test 8: Does not show default indicator');
console.log('\n');

// Test 9: Custom indicator with special characters
console.log('Test 9: Custom indicator "[truncated]"');
const customIndicator3 = schemaToTree(deepData, { maxDepth: 2, maxDepthIndicator: '[truncated]' });
console.log(customIndicator3);
assert(customIndicator3.includes('[truncated]'), 'Test 9: Shows custom indicator "[truncated]"');
console.log('\n');

// Test 10: Single character indicator
console.log('Test 10: Single character indicator "*"');
const singleCharIndicator = schemaToTree(deepData, { maxDepth: 2, maxDepthIndicator: '*' });
console.log(singleCharIndicator);
assert(singleCharIndicator.includes('*'), 'Test 10: Shows single character indicator');
assert(!singleCharIndicator.includes('...'), 'Test 10: Does not show default indicator');
console.log('\n');

// Test 11: Empty string indicator
console.log('Test 11: Empty string indicator (should show nothing)');
const emptyIndicator = schemaToTree(deepData, { maxDepth: 2, maxDepthIndicator: '' });
console.log(emptyIndicator);
// Empty indicator should show the line but with no text (empty string)
assert(!emptyIndicator.includes('...'), 'Test 11: Does not show default indicator');
// Check that the structure is still there but without indicator text
assert(emptyIndicator.includes('Input.tsx'), 'Test 11: Shows structure');
console.log('\n');

// Test 12: Long indicator text
console.log('Test 12: Long indicator text');
const longIndicator = schemaToTree(deepData, { maxDepth: 2, maxDepthIndicator: '... (more content below) ...' });
console.log(longIndicator);
assert(longIndicator.includes('... (more content below) ...'), 'Test 12: Shows long indicator text');
console.log('\n');

// Test 13: Default indicator when not specified
console.log('Test 13: Default indicator when not specified');
const defaultIndicator = schemaToTree(deepData, { maxDepth: 2 });
console.log(defaultIndicator);
assert(defaultIndicator.includes('...'), 'Test 13: Shows default "..." indicator');
console.log('\n');

// Test 14: Custom indicator with max depth 0
console.log('Test 14: Custom indicator with max depth 0');
const depth0Custom = schemaToTree(deepData, { maxDepth: 0, maxDepthIndicator: '>>>' });
console.log(depth0Custom);
assert(depth0Custom.includes('>>>'), 'Test 14: Shows custom indicator at depth 0');
assert(!depth0Custom.includes('...'), 'Test 14: Does not show default indicator');
console.log('\n');

// Test 15: Custom indicator combined with other options
console.log('Test 15: Custom indicator with root prefix and custom chars');
const combinedOptions = schemaToTree(deepData, { 
  maxDepth: 2, 
  maxDepthIndicator: '>>>',
  rootPrefix: 'project',
  branchChar: '|',
  cornerChar: "'",
  teeChar: '+'
});
console.log(combinedOptions);
assert(combinedOptions.includes('project'), 'Test 15: Shows root prefix');
assert(combinedOptions.includes('>>>'), 'Test 15: Shows custom indicator');
assert(combinedOptions.includes('+'), 'Test 15: Shows custom tee char');
console.log('\n');

console.log('=== All max depth tests completed ===');
console.log(`\nSummary: ${testsPassed} passed, ${testsFailed} failed`);
process.exit(testsFailed > 0 ? 1 : 0);

