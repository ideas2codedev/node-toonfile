import * as fs from 'fs'
import * as universalify from 'universalify'
import { parse, stringify, stripBom } from './utils'
import type { ReadOptions, WriteOptions, Callback } from './types'

let _fs: typeof fs
try {
  _fs = require('graceful-fs') as typeof fs
} catch (_) {
  _fs = fs
}

// ============ READ FILE ============

async function _readFile (file: string, options: ReadOptions | string = {}): Promise<any> {
  if (typeof options === 'string') {
    options = { encoding: options as BufferEncoding }
  }

  const fsModule = options.fs || _fs

  const shouldThrow = 'throws' in options ? options.throws : true

  let data: string
  try {
    const result = await new Promise<Buffer | string>((resolve, reject) => {
      fsModule.readFile(file, options.encoding || 'utf8', (err: any, data: any) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
    data = typeof result === 'string' ? result : result.toString('utf8')
  } catch (err) {
    if (shouldThrow) {
      const error = err as NodeJS.ErrnoException
      error.message = `${file}: ${error.message}`
      throw error
    } else {
      return null
    }
  }

  data = stripBom(data)

  let obj: any
  try {
    obj = parse(data, options)
  } catch (err) {
    if (shouldThrow) {
      const error = err as Error
      error.message = `${file}: ${error.message}`
      throw error
    } else {
      return null
    }
  }

  return obj
}

/**
 * Read and parse a TOON file asynchronously
 *
 * @param file - Path to the TOON file
 * @param options - Read options or encoding string
 * @param callback - Optional callback function
 * @returns Promise that resolves to parsed object (if no callback provided)
 *
 * @example
 * // With promise
 * const data = await readFile('config.toon')
 *
 * @example
 * // With callback
 * readFile('config.toon', (err, data) => {
 *   if (err) console.error(err)
 *   console.log(data)
 * })
 *
 * @example
 * // With options
 * const data = await readFile('config.toon', { throws: false })
 */
export const readFile: {
  (file: string, options?: ReadOptions | string): Promise<any>
  (file: string, callback: Callback<any>): void
  (file: string, options: ReadOptions | string, callback: Callback<any>): void
} = universalify.fromPromise(_readFile) as any

/**
 * Read and parse a TOON file synchronously
 *
 * @param file - Path to the TOON file
 * @param options - Read options or encoding string
 * @returns Parsed object
 *
 * @example
 * const data = readFileSync('config.toon')
 *
 * @example
 * const data = readFileSync('config.toon', { throws: false })
 */
export function readFileSync (file: string, options: ReadOptions | string = {}): any {
  if (typeof options === 'string') {
    options = { encoding: options as BufferEncoding }
  }

  const fsModule = options.fs || _fs

  const shouldThrow = 'throws' in options ? options.throws : true

  try {
    const buffer = fsModule.readFileSync(file, options as any)
    let content = typeof buffer === 'string' ? buffer : buffer.toString('utf8')
    content = stripBom(content)
    return parse(content, options)
  } catch (err) {
    if (shouldThrow) {
      const error = err as NodeJS.ErrnoException
      error.message = `${file}: ${error.message}`
      throw error
    } else {
      return null
    }
  }
}

// ============ WRITE FILE ============

async function _writeFile (file: string, obj: any, options: WriteOptions = {}): Promise<void> {
  const fsModule = options.fs || _fs

  const str = stringify(obj, options)

  const writeOptions: any = { encoding: options.encoding || 'utf8' }
  if (options.mode) writeOptions.mode = options.mode
  if (options.flag) writeOptions.flag = options.flag

  await new Promise<void>((resolve, reject) => {
    fsModule.writeFile(file, str, writeOptions, (err: any) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

/**
 * Stringify object and write to TOON file asynchronously
 *
 * @param file - Path to the TOON file
 * @param obj - Object to stringify and write
 * @param options - Write options
 * @param callback - Optional callback function
 * @returns Promise that resolves when file is written (if no callback provided)
 *
 * @example
 * // With promise
 * await writeFile('data.toon', { name: 'Alice', age: 30 })
 *
 * @example
 * // With callback
 * writeFile('data.toon', obj, (err) => {
 *   if (err) console.error(err)
 * })
 *
 * @example
 * // With options
 * await writeFile('data.toon', obj, { indentSize: 4, delimiter: '|' })
 */
export const writeFile: {
  (file: string, obj: any, options?: WriteOptions): Promise<void>
  (file: string, obj: any, callback: Callback<void>): void
  (file: string, obj: any, options: WriteOptions, callback: Callback<void>): void
} = universalify.fromPromise(_writeFile) as any

/**
 * Stringify object and write to TOON file synchronously
 *
 * @param file - Path to the TOON file
 * @param obj - Object to stringify and write
 * @param options - Write options
 *
 * @example
 * writeFileSync('data.toon', { name: 'Bob', age: 25 })
 *
 * @example
 * writeFileSync('data.toon', obj, { indentSize: 4 })
 */
export function writeFileSync (file: string, obj: any, options: WriteOptions = {}): void {
  const fsModule = options.fs || _fs

  const str = stringify(obj, options)
  fsModule.writeFileSync(file, str, options as any)
}

// ============ EXPORTS ============

// Re-export utility functions
export { parse, stringify } from './utils'

// Re-export types
export type {
  ReadOptions,
  WriteOptions,
  ParseOptions,
  StringifyOptions,
  Callback,
  ToonValue,
  ToonObject,
  ToonArray
} from './types'

// NOTE: do not change this export format; required for ESM compat
// Default export for CommonJS compatibility
export default {
  readFile,
  readFileSync,
  writeFile,
  writeFileSync,
  parse,
  stringify
}
