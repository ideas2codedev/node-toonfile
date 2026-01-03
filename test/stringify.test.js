const assert = require('assert')
const toonfile = require('..')

describe('stringify', () => {
  it('should stringify simple object', () => {
    const obj = { name: 'Alice', age: 30 }
    const toon = toonfile.stringify(obj)
    assert(toon.includes('name: Alice'))
    assert(toon.includes('age: 30'))
  })

  it('should stringify boolean values', () => {
    const obj = { active: true, disabled: false }
    const toon = toonfile.stringify(obj)
    assert(toon.includes('active: true'))
    assert(toon.includes('disabled: false'))
  })

  it('should stringify null values', () => {
    const obj = { value: null }
    const toon = toonfile.stringify(obj)
    assert(toon.includes('value: null'))
  })

  it('should stringify arrays with length declaration', () => {
    const obj = { scores: [95, 87, 92] }
    const toon = toonfile.stringify(obj)
    assert(toon.includes('scores[3]:'))
    assert(toon.includes('95,87,92'))
  })

  it('should stringify nested objects with indentation', () => {
    const obj = {
      person: {
        name: 'Alice',
        age: 30
      }
    }
    const toon = toonfile.stringify(obj)
    assert(toon.includes('person:'))
    assert(toon.includes('  name: Alice'))
    assert(toon.includes('  age: 30'))
  })

  it('should quote strings with special characters', () => {
    const obj = { message: 'Hello, world!' }
    const toon = toonfile.stringify(obj)
    assert(toon.includes('"Hello, world!"'))
  })

  it('should quote strings with colons', () => {
    const obj = { time: '10:30' }
    const toon = toonfile.stringify(obj)
    assert(toon.includes('"10:30"'))
  })

  it('should handle different indent sizes', () => {
    const obj = { outer: { inner: 'value' } }
    const toon = toonfile.stringify(obj, { indentSize: 4 })
    assert(toon.includes('    inner: value'))
  })

  it('should handle custom delimiters', () => {
    const obj = { items: [1, 2, 3] }
    const toon = toonfile.stringify(obj, { delimiter: '|' })
    assert(toon.includes('1|2|3'))
  })

  it('should respect finalEOL option', () => {
    const obj = { name: 'Test' }

    const withEOL = toonfile.stringify(obj, { finalEOL: true })
    assert(withEOL.endsWith('\n'))

    const withoutEOL = toonfile.stringify(obj, { finalEOL: false })
    assert(!withoutEOL.endsWith('\n'))
  })

  it('should handle custom EOL characters', () => {
    const obj = { a: 1, b: 2 }
    const toon = toonfile.stringify(obj, { EOL: '\r\n' })
    assert(toon.includes('\r\n'))
  })

  it('should escape special characters in strings', () => {
    const obj = { text: 'Line 1\nLine 2' }
    const toon = toonfile.stringify(obj)
    assert(toon.includes('\\n'))
  })

  it('should handle empty objects', () => {
    const obj = {}
    const toon = toonfile.stringify(obj)
    assert.strictEqual(toon.trim(), '')
  })

  it('should handle empty arrays', () => {
    const obj = { items: [] }
    const toon = toonfile.stringify(obj)
    assert(toon.includes('items[0]:'))
  })
})
