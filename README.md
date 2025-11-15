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

# Limit tree depth (using shorthand)
schemascii structure.json -d 2

# Custom characters (ASCII style, using shorthand)
schemascii structure.json -b "|" -c "'" -t "+" -H "-"

# Custom indent and root prefix (using shorthand)
schemascii structure.json -i 4 -r "myproject"

# Combine multiple options (using shorthand)
schemascii structure.json -d 3 -i 3 -r "project"

# Custom max depth indicator
schemascii structure.json -d 2 -m ">>>"
schemascii structure.json -d 2 -m "[more]"
```

#### CLI Options

All TreeOptions can be specified via command-line arguments (both long and short forms):

- `--root-prefix, -r <text>` - Root prefix text to display at the top
- `--branch-char, -b <char>` - Character for vertical branches (default: │)
- `--corner-char, -c <char>` - Character for corner connectors (default: └)
- `--tee-char, -t <char>` - Character for tee connectors (default: ├)
- `--horizontal-char, -H <char>` - Character for horizontal lines (default: ─)
- `--indent-size, -i <number>` - Number of spaces for indentation (default: 2)
- `--max-depth, -d <number>` - Maximum depth to display (default: unlimited)
- `--max-depth-indicator, -m <text>` - Text shown when max depth is reached (default: "...")
- `--output, -o <file>` - Output file path (default: stdout)
- `--help, -h` - Show help message

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
  maxDepth: 3,  // Limit tree depth to 3 levels
  maxDepthIndicator: '...'  // Text shown when max depth is reached
});
```

### Max Depth

You can limit the depth of the tree using the `maxDepth` option. When the maximum depth is reached, an indicator (default: `...`) is shown to indicate that there's more content below. The depth is counted from the root level (depth 0), so `maxDepth: 1` shows root items and their direct children, `maxDepth: 2` shows up to grandchildren, etc.

You can customize the indicator text using the `maxDepthIndicator` option:

```typescript
// Limit to 2 levels deep (root + 2 levels)
const tree = schemaToTree(deepStructure, { maxDepth: 2 });

// Custom indicator text
const tree = schemaToTree(deepStructure, { 
  maxDepth: 2, 
  maxDepthIndicator: '>>>' 
});
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

Example with custom indicator (`maxDepthIndicator: '>>>'`):
```
.
├── src
│   ├── components
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   │       >>>        // custom indicator
│   └── utils
│       └── helpers
│           >>>        // custom indicator
└── tests
    └── unit
        >>>
```

## License

MIT

