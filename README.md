# schemascii

Convert JSON, JSONC, or YAML file structure to ASCII directory tree.

## Installation

```bash
npm install schemascii
```

Or use it directly with npx:

```bash
npx schemascii <file>
```

Supports JSON, JSONC, and YAML file formats.

## Usage

### CLI

```bash
# Output to stdout (JSON)
schemascii structure.json

# JSONC with comments
schemascii structure.jsonc

# YAML format
schemascii structure.yaml

# Output to file
schemascii structure.json -o tree.txt
```

### Programmatic API

```typescript
import { jsonToTree, jsonFileToTree, fileToTree } from 'schemascii';

// From object
const json = {
  "src": {
    "components": {},
    "utils": {
      "helpers": {}
    }
  },
  "tests": {}
};

const tree = jsonToTree(json);
console.log(tree);

// From file (auto-detects format: JSON, JSONC, or YAML)
const tree = await fileToTree('structure.json');
const tree2 = await fileToTree('structure.jsonc');
const tree3 = await fileToTree('structure.yaml');
console.log(tree);

// Legacy alias (also supports all formats)
const tree = await jsonFileToTree('structure.json');
console.log(tree);
```

## File Format

Each key in the object represents a directory. Nested objects represent nested directories. The tool supports JSON, JSONC (JSON with comments), and YAML formats.

### JSON Example

```json
{
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
}
```

### JSONC Example (with comments)

```jsonc
{
  // Source code directory
  "src": {
    "components": {
      "Button.tsx": {},
      "Input.tsx": {}
    },
    "utils": {
      // Helper utilities
      "helpers": {
        "format.ts": {}
      }
    }
  },
  // Test files
  "tests": {
    "unit": {}
  }
}
```

### YAML Example

```yaml
src:
  components:
    Button.tsx: {}
    Input.tsx: {}
  utils:
    helpers:
      format.ts: {}
tests:
  unit: {}
```

All formats produce the same output:

```
.
├── src
│   ├── components
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   └── utils
│       └── helpers
│           └── format.ts
└── tests
    └── unit
```

## Options

You can customize the tree output with options:

```typescript
const tree = jsonToTree(json, {
  rootPrefix: 'project',
  branchChar: '│',
  cornerChar: '└',
  teeChar: '├',
  horizontalChar: '─',
  indentSize: 2
});
```

## License

MIT

