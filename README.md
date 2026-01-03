# toonfile

Easily read/write TOON (Token-Oriented Object Notation) files in Node.js.

[![npm version](https://img.shields.io/npm/v/toonfile.svg)](https://www.npmjs.com/package/toonfile)
[![npm downloads](https://img.shields.io/npm/dm/toonfile.svg)](https://www.npmjs.com/package/toonfile)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js->=14-green.svg)](https://nodejs.org/)

## Why?

TOON is a compact, human-readable format designed for LLM prompts that reduces token usage by 30-60% compared to JSON while maintaining readability. This library makes it as easy to work with `.toon` files as it is to work with `.json` files.

**Like [jsonfile](https://github.com/jprichardson/node-jsonfile), but for TOON format.**

## Installation

```bash
npm install toonfile
```

## Quick Start

```javascript
const toonfile = require('toonfile')

// Read TOON file
const config = await toonfile.readFile('./config.toon')

// Write TOON file
const data = { name: 'Alice', scores: [95, 87, 92] }
await toonfile.writeFile('./output.toon', data)
```

## API

### readFile(filename, [options], callback)

Read and parse a TOON file.

**Options:**
- `encoding` (string, default: `'utf8'`): File encoding
- `throws` (boolean, default: `true`): Throw error on parse failure. If `false`, returns `null` for invalid files.
- `reviver` (function): Transform function for parsed values
- `fs` (object): Custom fs module for testing

**Examples:**

```javascript
// With callback
toonfile.readFile('config.toon', (err, data) => {
  if (err) console.error(err)
  console.log(data)
})

// With promise
const data = await toonfile.readFile('config.toon')

// With async/await
async function loadConfig () {
  const config = await toonfile.readFile('config.toon')
  return config
}

// Silent error handling
const data = await toonfile.readFile('config.toon', { throws: false })
if (!data) console.log('File not found or invalid')
```

### readFileSync(filename, [options])

Synchronous version of `readFile`.

```javascript
const toonfile = require('toonfile')
const config = toonfile.readFileSync('./config.toon')
console.log(config)
```

### writeFile(filename, obj, [options], callback)

Stringify object and write to TOON file.

**Options:**
- `encoding` (string, default: `'utf8'`): File encoding
- `indentSize` (number, default: `2`): Spaces per indent level
- `delimiter` (string, default: `','`): Delimiter for arrays: `','`, `'\t'`, or `'|'`
- `EOL` (string, default: `'\n'`): End-of-line character
- `finalEOL` (boolean, default: `true`): Include EOL at end of file
- `fs` (object): Custom fs module for testing

**Examples:**

```javascript
const data = {
  company: 'TechCorp',
  employees: [
    { id: 1, name: 'Alice', role: 'Engineer' },
    { id: 2, name: 'Bob', role: 'Designer' }
  ]
}

// Basic write
await toonfile.writeFile('data.toon', data)

// With options
await toonfile.writeFile('data.toon', data, {
  indentSize: 4,
  delimiter: '|',
  EOL: '\r\n'
})

// Callback style
toonfile.writeFile('data.toon', data, (err) => {
  if (err) console.error(err)
  console.log('Write complete!')
})
```

**Formatting with spaces:**

```javascript
await toonfile.writeFile('data.toon', obj, { indentSize: 4 })
```

**Overriding EOL:**

```javascript
await toonfile.writeFile('data.toon', obj, { EOL: '\r\n' })
```

**Disabling the EOL at the end of file:**

```javascript
await toonfile.writeFile('data.toon', obj, { finalEOL: false })
```

**Appending to an existing file:**

You can use the `fs.writeFile` option `{ flag: 'a' }` to achieve this.

```javascript
await toonfile.writeFile('data.toon', obj, { flag: 'a' })
```

### writeFileSync(filename, obj, [options])

Synchronous version of `writeFile`.

```javascript
const toonfile = require('toonfile')
toonfile.writeFileSync('./data.toon', { name: 'Bob', age: 25 })
```

### parse(toonString, [options])

Parse a TOON string to JavaScript object.

```javascript
const toon = 'name: Alice\nage: 30'
const obj = toonfile.parse(toon)
// → { name: 'Alice', age: 30 }
```

### stringify(obj, [options])

Convert JavaScript object to TOON string.

```javascript
const obj = { name: 'Bob', scores: [95, 87, 92] }
const toon = toonfile.stringify(obj)
// → 'name: Bob\nscores[3]: 95,87,92'
```

## TOON Format Examples

### Simple Object

**JavaScript:**
```javascript
{ name: 'Alice', age: 30, city: 'Boston' }
```

**TOON:**
```
name: Alice
age: 30
city: Boston
```

### Nested Objects

**JavaScript:**
```javascript
{
  person: {
    name: 'Alice',
    address: { city: 'Boston', zip: '02101' }
  }
}
```

**TOON:**
```
person:
  name: Alice
  address:
    city: Boston
    zip: 02101
```

### Arrays (Inline)

**JavaScript:**
```javascript
{ scores: [95, 87, 92] }
```

**TOON:**
```
scores[3]: 95,87,92
```

### Complex Example

**JavaScript:**
```javascript
{
  company: 'TechCorp',
  founded: 2020,
  active: true,
  employees: ['Alice', 'Bob', 'Carol'],
  metadata: {
    location: 'Boston',
    remote: true
  }
}
```

**TOON:**
```
company: TechCorp
founded: 2020
active: true
employees[3]: Alice,Bob,Carol
metadata:
  location: Boston
  remote: true
```

## Comparison with JSON

**JSON (124 characters):**
```json
{
  "name": "Alice",
  "age": 30,
  "scores": [95, 87, 92],
  "address": {
    "city": "Boston"
  }
}
```

**TOON (73 characters - 41% reduction):**
```
name: Alice
age: 30
scores[3]: 95,87,92
address:
  city: Boston
```

## About TOON Format

TOON (Token-Oriented Object Notation) is a compact, human-readable encoding designed specifically for LLM prompts. It provides:

- **30-60% token reduction** compared to JSON
- **Human-readable** syntax similar to YAML
- **Schema-aware** structure with explicit array lengths
- **Lossless** serialization of the JSON data model

Learn more at [toon-format.org](https://github.com/toon-format/spec)

## Related Projects

- [jsonfile](https://github.com/jprichardson/node-jsonfile) - The inspiration for this library
- [TOON Specification](https://github.com/toon-format/spec) - Official TOON format spec
- [TOON TypeScript SDK](https://github.com/toon-format/toon) - Official TypeScript implementation

## GitHub Repository

[https://github.com/ideas2codedev/node-toonfile](https://github.com/ideas2codedev/node-toonfile)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request at [https://github.com/ideas2codedev/node-toonfile](https://github.com/ideas2codedev/node-toonfile).
