# json-to-tree

Convert JSON file structure to ASCII directory tree.

## Installation

```bash
npm install json-to-tree
```

Or use it directly with npx:

```bash
npx json-to-tree <json-file>
```

## Usage

### CLI

```bash
# Output to stdout
json-to-tree structure.json

# Output to file
json-to-tree structure.json -o tree.txt
```

### Programmatic API

```typescript
import { jsonToTree, jsonFileToTree } from 'json-to-tree';

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

// From file
const tree = await jsonFileToTree('structure.json');
console.log(tree);
```

## JSON Format

Each key in the JSON object represents a directory. Nested objects represent nested directories.

Example JSON:

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

Output:

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

