const assert = require('assert')
const toonfile = require('..')

describe('parse', () => {
  it('should parse simple key-value pairs', () => {
    const toon = 'name: Alice\nage: 30'
    const obj = toonfile.parse(toon)
    assert.strictEqual(obj.name, 'Alice')
    assert.strictEqual(obj.age, 30)
  })

  it('should parse boolean values', () => {
    const toon = 'active: true\ninactive: false'
    const obj = toonfile.parse(toon)
    assert.strictEqual(obj.active, true)
    assert.strictEqual(obj.inactive, false)
  })

  it('should parse null values', () => {
    const toon = 'value: null'
    const obj = toonfile.parse(toon)
    assert.strictEqual(obj.value, null)
  })

  it('should parse inline arrays', () => {
    const toon = 'scores[3]: 95,87,92'
    const obj = toonfile.parse(toon)
    assert(Array.isArray(obj.scores))
    assert.strictEqual(obj.scores.length, 3)
    assert.strictEqual(obj.scores[0], 95)
    assert.strictEqual(obj.scores[1], 87)
    assert.strictEqual(obj.scores[2], 92)
  })

  it('should parse string arrays', () => {
    const toon = 'tags[2]: javascript,nodejs'
    const obj = toonfile.parse(toon)
    assert(Array.isArray(obj.tags))
    assert.strictEqual(obj.tags[0], 'javascript')
    assert.strictEqual(obj.tags[1], 'nodejs')
  })

  it('should parse nested objects', () => {
    const toon = 'person:\n  name: Alice\n  age: 30'
    const obj = toonfile.parse(toon)
    assert(obj.person)
    assert.strictEqual(obj.person.name, 'Alice')
    assert.strictEqual(obj.person.age, 30)
  })

  it('should parse deeply nested objects', () => {
    const toon = 'root:\n  level1:\n    level2:\n      value: deep'
    const obj = toonfile.parse(toon)
    assert.strictEqual(obj.root.level1.level2.value, 'deep')
  })

  it('should parse quoted strings', () => {
    const toon = 'message: "Hello, world!"'
    const obj = toonfile.parse(toon)
    assert.strictEqual(obj.message, 'Hello, world!')
  })

  it('should handle empty lines and whitespace', () => {
    const toon = 'name: Alice\n\nage: 30\n  '
    const obj = toonfile.parse(toon)
    assert.strictEqual(obj.name, 'Alice')
    assert.strictEqual(obj.age, 30)
  })

  it('should handle BOM', () => {
    const toon = '\uFEFFname: Alice'
    const obj = toonfile.parse(toon)
    assert.strictEqual(obj.name, 'Alice')
  })

  it('should handle comments', () => {
    const toon = '# This is a comment\nname: Alice\n# Another comment\nage: 30'
    const obj = toonfile.parse(toon)
    assert.strictEqual(obj.name, 'Alice')
    assert.strictEqual(obj.age, 30)
  })

  it('should parse escaped strings', () => {
    const toon = 'message: "Line 1\\nLine 2"'
    const obj = toonfile.parse(toon)
    assert.strictEqual(obj.message, 'Line 1\nLine 2')
  })

  it('should handle numbers correctly', () => {
    const toon = 'integer: 42\nfloat: 3.14\nnegative: -10'
    const obj = toonfile.parse(toon)
    assert.strictEqual(obj.integer, 42)
    assert.strictEqual(obj.float, 3.14)
    assert.strictEqual(obj.negative, -10)
  })
})
