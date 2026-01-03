const assert = require('assert')
const path = require('path')
const os = require('os')
const fs = require('fs')
const rimraf = require('rimraf')
const toonfile = require('..')

describe('readFile', () => {
  let TEST_DIR

  beforeEach((done) => {
    TEST_DIR = path.join(os.tmpdir(), 'toonfile-tests-readfile')
    rimraf.sync(TEST_DIR)
    fs.mkdir(TEST_DIR, done)
  })

  afterEach((done) => {
    rimraf.sync(TEST_DIR)
    done()
  })

  it('should read basic TOON file with callback', (done) => {
    const file = path.join(TEST_DIR, 'test.toon')
    fs.writeFileSync(file, 'name: Alice\nage: 30')

    toonfile.readFile(file, (err, data) => {
      assert.ifError(err)
      assert.strictEqual(data.name, 'Alice')
      assert.strictEqual(data.age, 30)
      done()
    })
  })

  it('should read basic TOON file with promise', async () => {
    const file = path.join(TEST_DIR, 'test.toon')
    fs.writeFileSync(file, 'name: Bob\nage: 25')

    const data = await toonfile.readFile(file)
    assert.strictEqual(data.name, 'Bob')
    assert.strictEqual(data.age, 25)
  })

  it('should read TOON file with arrays', async () => {
    const file = path.join(TEST_DIR, 'arrays.toon')
    fs.writeFileSync(file, 'scores[3]: 95,87,92\ntags[2]: nodejs,toon')

    const data = await toonfile.readFile(file)
    assert(Array.isArray(data.scores))
    assert.strictEqual(data.scores.length, 3)
    assert(Array.isArray(data.tags))
    assert.strictEqual(data.tags[0], 'nodejs')
  })

  it('should read TOON file with nested objects', async () => {
    const file = path.join(TEST_DIR, 'nested.toon')
    const content = 'person:\n  name: Alice\n  address:\n    city: Boston'
    fs.writeFileSync(file, content)

    const data = await toonfile.readFile(file)
    assert.strictEqual(data.person.name, 'Alice')
    assert.strictEqual(data.person.address.city, 'Boston')
  })

  it('should include filename in error message on file not found', async () => {
    const file = path.join(TEST_DIR, 'nonexistent.toon')

    try {
      await toonfile.readFile(file)
      assert.fail('Should have thrown')
    } catch (err) {
      assert(err.message.includes(file) || err.path === file)
    }
  })

  it('should return null with throws: false on invalid file', async () => {
    const file = path.join(TEST_DIR, 'nonexistent.toon')

    const data = await toonfile.readFile(file, { throws: false })
    assert.strictEqual(data, null)
  })

  it('should handle BOM in files', async () => {
    const file = path.join(TEST_DIR, 'bom.toon')
    fs.writeFileSync(file, '\uFEFFname: Alice')

    const data = await toonfile.readFile(file)
    assert.strictEqual(data.name, 'Alice')
  })

  it('should support encoding option as string', async () => {
    const file = path.join(TEST_DIR, 'test.toon')
    fs.writeFileSync(file, 'name: Alice')

    const data = await toonfile.readFile(file, 'utf8')
    assert.strictEqual(data.name, 'Alice')
  })

  it('should support encoding option as object', async () => {
    const file = path.join(TEST_DIR, 'test.toon')
    fs.writeFileSync(file, 'name: Bob')

    const data = await toonfile.readFile(file, { encoding: 'utf8' })
    assert.strictEqual(data.name, 'Bob')
  })

  it('should read fixture files correctly', async () => {
    const file = path.join(__dirname, 'fixtures', 'basic.toon')
    const data = await toonfile.readFile(file)
    assert.strictEqual(data.name, 'Alice')
    assert.strictEqual(data.age, 30)
    assert.strictEqual(data.city, 'Boston')
  })
})
