/**
 * TOON File Types and Interfaces
 */

import type * as fs from 'fs'

/**
 * Options for reading TOON files
 */
export interface ReadOptions {
  /**
   * File encoding (default: 'utf8')
   */
  encoding?: BufferEncoding

  /**
   * Throw error on parse failure. If false, returns null instead.
   * @default true
   */
  throws?: boolean

  /**
   * Custom fs module for testing or alternative file systems
   */
  fs?: typeof fs

  /**
   * Transform function applied to parsed values (similar to JSON.parse reviver)
   */
  reviver?: (key: string, value: any) => any

  /**
   * Indent size for parsing (default: 2)
   */
  indentSize?: number

  /**
   * Strict mode for parsing
   * @default true
   */
  strict?: boolean
}

/**
 * Options for writing TOON files
 */
export interface WriteOptions {
  /**
   * File encoding (default: 'utf8')
   */
  encoding?: BufferEncoding

  /**
   * Custom fs module for testing or alternative file systems
   */
  fs?: typeof fs

  /**
   * Spaces per indent level
   * @default 2
   */
  indentSize?: number

  /**
   * Delimiter for arrays: comma, tab, or pipe
   * @default ','
   */
  delimiter?: ',' | '\t' | '|'

  /**
   * End-of-line character(s)
   * @default '\n'
   */
  EOL?: '\n' | '\r\n' | string

  /**
   * Include EOL at end of file
   * @default true
   */
  finalEOL?: boolean

  /**
   * Use tabular format for uniform arrays of objects
   * @default true
   */
  tabularArrays?: boolean

  /**
   * Minimum array length to use tabular format
   * @default 2
   */
  minArrayLengthForTabular?: number

  /**
   * Transform function applied before stringifying (similar to JSON.stringify replacer)
   */
  replacer?: (key: string, value: any) => any

  /**
   * File system flags (e.g., 'w', 'a')
   * @default 'w'
   */
  flag?: string

  /**
   * File mode (permissions)
   */
  mode?: number
}

/**
 * Options for parsing TOON strings
 */
export interface ParseOptions {
  /**
   * Transform function applied to parsed values
   */
  reviver?: (key: string, value: any) => any

  /**
   * Indent size (default: 2)
   */
  indentSize?: number

  /**
   * Strict mode
   * @default true
   */
  strict?: boolean
}

/**
 * Options for stringifying objects to TOON
 */
export interface StringifyOptions {
  /**
   * Spaces per indent level
   * @default 2
   */
  indentSize?: number

  /**
   * Delimiter for arrays
   * @default ','
   */
  delimiter?: ',' | '\t' | '|' | string

  /**
   * End-of-line character(s)
   * @default '\n'
   */
  EOL?: '\n' | '\r\n' | string

  /**
   * Include EOL at end of file
   * @default true
   */
  finalEOL?: boolean

  /**
   * Use tabular format for uniform arrays
   * @default true
   */
  tabularArrays?: boolean

  /**
   * Minimum array length for tabular format
   * @default 2
   */
  minArrayLengthForTabular?: number

  /**
   * Transform function applied before stringifying
   */
  replacer?: (key: string, value: any) => any
}

/**
 * Callback function for async operations
 */
export type Callback<T> = (err: Error | null, data?: T) => void

/**
 * TOON value types
 */
export type ToonValue =
  | string
  | number
  | boolean
  | null
  | ToonArray
  | ToonObject

export interface ToonObject {
  [key: string]: ToonValue
}

export type ToonArray = ToonValue[]
