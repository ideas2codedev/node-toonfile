const assert = require('assert')
const path = require('path')
const os = require('os')
const fs = require('fs')
const rimraf = require('rimraf')
const toonfile = require('..')

describe('writeFile', () => {
  let TEST_DIR

  beforeEach((done) => {
    TEST_DIR = path.join(os.tmpdir(), 'toonfile-tests-writefile')
    rimraf.sync(TEST_DIR)
    fs.mkdir(TEST_DIR, done)
  })

  afterEach((done) => {
    rimraf.sync(TEST_DIR)
    done()
  })

  it('should write basic object with callback', (done) => {
    const file = path.join(TEST_DIR, 'test.toon')
    const obj = { name: 'Alice', age: 30 }

    toonfile.writeFile(file, obj, (err) => {
      assert.ifError(err)
      const content = fs.readFileSync(file, 'utf8')
      assert(content.includes('name: Alice'))
      assert(content.includes('age: 30'))
      done()
    })
  })

  it('should write basic object with promise', async () => {
    const file = path.join(TEST_DIR, 'test.toon')
    const obj = { name: 'Bob', age: 25 }

    await toonfile.writeFile(file, obj)
    const content = fs.readFileSync(file, 'utf8')
    assert(content.includes('name: Bob'))
    assert(content.includes('age: 25'))
  })

  it('should write arrays in inline format', async () => {
    const file = path.join(TEST_DIR, 'arrays.toon')
    const obj = { scores: [95, 87, 92] }

    await toonfile.writeFile(file, obj)
    const content = fs.readFileSync(file, 'utf8')
    assert(content.includes('scores[3]:'))
    assert(content.includes('95,87,92'))
  })

  it('should write nested objects with indentation', async () => {
    const file = path.join(TEST_DIR, 'nested.toon')
    const obj = {
      person: {
        name: 'Alice',
        age: 30
      }
    }

    await toonfile.writeFile(file, obj)
    const content = fs.readFileSync(file, 'utf8')
    assert(content.includes('person:'))
    assert(content.includes('  name: Alice'))
    assert(content.includes('  age: 30'))
  })

  it('should respect indentSize option', async () => {
    const file = path.join(TEST_DIR, 'indent.toon')
    const obj = { nested: { key: 'value' } }

    await toonfile.writeFile(file, obj, { indentSize: 4 })
    const content = fs.readFileSync(file, 'utf8')
    assert(content.includes('    key: value'))
  })

  it('should respect finalEOL option', async () => {
    const file = path.join(TEST_DIR, 'no-eol.toon')
    const obj = { name: 'Test' }

    await toonfile.writeFile(file, obj, { finalEOL: false })
    const content = fs.readFileSync(file, 'utf8')
    assert(!content.endsWith('\n'))
  })

  it('should include finalEOL by default', async () => {
    const file = path.join(TEST_DIR, 'with-eol.toon')
    const obj = { name: 'Test' }

    await toonfile.writeFile(file, obj)
    const content = fs.readFileSync(file, 'utf8')
    assert(content.endsWith('\n'))
  })

  it('should respect custom EOL', async () => {
    const file = path.join(TEST_DIR, 'crlf.toon')
    const obj = { a: 1, b: 2 }

    await toonfile.writeFile(file, obj, { EOL: '\r\n' })
    const content = fs.readFileSync(file, 'utf8')
    assert(content.includes('\r\n'))
  })

  it('should respect custom delimiter', async () => {
    const file = path.join(TEST_DIR, 'pipe.toon')
    const obj = { items: [1, 2, 3] }

    await toonfile.writeFile(file, obj, { delimiter: '|' })
    const content = fs.readFileSync(file, 'utf8')
    assert(content.includes('1|2|3'))
  })

  it('should write and read back same data', async () => {
    const file = path.join(TEST_DIR, 'roundtrip.toon')
    const original = {
      name: 'Alice',
      age: 30,
      scores: [95, 87, 92],
      active: true,
      metadata: {
        city: 'Boston',
        zip: '02101'
      }
    }

    await toonfile.writeFile(file, original)
    const readBack = await toonfile.readFile(file)

    assert.deepStrictEqual(readBack, original)
  })

  it('should handle boolean values', async () => {
    const file = path.join(TEST_DIR, 'bool.toon')
    const obj = { active: true, disabled: false }

    await toonfile.writeFile(file, obj)
    const content = fs.readFileSync(file, 'utf8')
    assert(content.includes('active: true'))
    assert(content.includes('disabled: false'))
  })

  it('should handle null values', async () => {
    const file = path.join(TEST_DIR, 'null.toon')
    const obj = { value: null }

    await toonfile.writeFile(file, obj)
    const content = fs.readFileSync(file, 'utf8')
    assert(content.includes('value: null'))
  })

  it('should quote strings with special characters', async () => {
    const file = path.join(TEST_DIR, 'quoted.toon')
    const obj = { message: 'Hello, world!' }

    await toonfile.writeFile(file, obj)
    const content = fs.readFileSync(file, 'utf8')
    assert(content.includes('"Hello, world!"'))
  })
})
