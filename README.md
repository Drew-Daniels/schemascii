# schemascii

Convert JSON, JSONC, YAML, or XML file structure to ASCII directory tree.

## Installation

```bash
npm install schemascii
```

Or use it directly with npx:

```bash
npx schemascii <file>
```

Supports JSON, JSONC, YAML, and XML file formats.

## Usage

### CLI

```bash
# Output to stdout (JSON)
schemascii structure.json

# JSONC with comments
schemascii structure.jsonc

# YAML format
schemascii structure.yaml

# XML format
schemascii structure.xml

# Output to file
schemascii structure.json -o tree.txt
```

### Programmatic API

```typescript
import { schemaToTree, fileToTree } from 'schemascii';

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

const tree = schemaToTree(json);
console.log(tree);

// From file (auto-detects format: JSON, JSONC, YAML, or XML)
const tree = await fileToTree('structure.json');
const tree2 = await fileToTree('structure.jsonc');
const tree3 = await fileToTree('structure.yaml');
const tree4 = await fileToTree('structure.xml');
console.log(tree);
```

## File Format

Each key in the object represents a directory. Nested objects represent nested directories. The tool supports JSON, JSONC (JSON with comments), YAML, and XML formats.

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

### XML Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<root>
  <src>
    <components>
      <Button.tsx />
      <Input.tsx />
    </components>
    <utils>
      <helpers>
        <format.ts />
      </helpers>
    </utils>
  </src>
  <tests>
    <unit />
  </tests>
</root>
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
const tree = schemaToTree(json, {
  rootPrefix: 'project',
  branchChar: '│',
  cornerChar: '└',
  teeChar: '├',
  horizontalChar: '─',
  indentSize: 2,
  maxDepth: 3  // Limit tree depth to 3 levels
});
```

### Max Depth

You can limit the depth of the tree using the `maxDepth` option. When the maximum depth is reached, a `...` indicator is shown to indicate that there's more content below. The depth is counted from the root level (depth 0), so `maxDepth: 1` shows root items and their direct children, `maxDepth: 2` shows up to grandchildren, etc.

```typescript
// Limit to 2 levels deep (root + 2 levels)
const tree = schemaToTree(deepStructure, { maxDepth: 2 });
```

Example output with `maxDepth: 2`:
```
.
├── src
│   ├── components
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   │       ...        // indicates more nested content
│   └── utils
│       └── helpers
│           ...        // indicates more nested content
└── tests
    └── unit
        ...
```

## License

MIT

