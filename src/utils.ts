/**
 * TOON Format Parser and Serializer
 *
 * Custom implementation supporting basic TOON features.
 */

import type {
  ParseOptions,
  StringifyOptions,
  ToonValue
} from './types'

/**
 * Parse TOON string to JavaScript object
 */
export function parse(content: string | Buffer, options: ParseOptions = {}): any {
  if (Buffer.isBuffer(content)) {
    content = content.toString('utf8')
  }

  content = stripBom(content)

  const lines = content.split(/\r?\n/)
  const indentSize = options.indentSize || 2

  interface StackItem {
    obj: any
    indent: number
  }

  const stack: StackItem[] = [{ obj: {}, indent: -indentSize }]

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith('#')) continue

    const indent = getIndentLevel(line)
    const trimmedLine = line.trim()

    // Pop stack until we find the right parent
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop()
    }

    const parent = stack[stack.length - 1].obj

    // Parse key-value
    if (trimmedLine.includes(':')) {
      const colonIndex = trimmedLine.indexOf(':')
      const key = trimmedLine.substring(0, colonIndex).trim()
      const valueStr = trimmedLine.substring(colonIndex + 1).trim()

      // Check for array declaration: key[length]
      const arrayMatch = key.match(/^(.+)\[(\d+)\]$/)

      if (arrayMatch) {
        // Inline array: scores[3]: 95,87,92
        const arrayName = arrayMatch[1]
        const arrayLength = parseInt(arrayMatch[2], 10)

        if (valueStr) {
          parent[arrayName] = parseInlineArray(valueStr, arrayLength)
        } else {
          parent[arrayName] = []
        }
      } else if (valueStr) {
        // Simple key-value
        parent[key] = parseValue(valueStr)
      } else {
        // Nested object
        const newObj: any = {}
        parent[key] = newObj
        stack.push({ obj: newObj, indent })
      }
    }
  }

  const result = stack[0].obj

  if (options.reviver) {
    return applyReviver(result, options.reviver)
  }

  return result
}

/**
 * Stringify JavaScript object to TOON format
 */
export function stringify(obj: any, options: StringifyOptions = {}): string {
  const indentSize = options.indentSize || 2
  const delimiter = options.delimiter || ','
  const lines: string[] = []

  function serializeObject(o: any, depth: number = 0): void {
    const indent = ' '.repeat(depth * indentSize)

    for (const [key, value] of Object.entries(o)) {
      if (Array.isArray(value)) {
        const arrayStr = value.map(v => serializeValue(v)).join(delimiter)
        lines.push(`${indent}${key}[${value.length}]: ${arrayStr}`)
      } else if (value !== null && typeof value === 'object') {
        lines.push(`${indent}${key}:`)
        serializeObject(value, depth + 1)
      } else {
        lines.push(`${indent}${key}: ${serializeValue(value)}`)
      }
    }
  }

  function serializeValue(value: any): string {
    if (value === null) return 'null'
    if (typeof value === 'boolean') return value.toString()
    if (typeof value === 'number') return value.toString()
    if (typeof value === 'string') {
      if (needsQuotes(value, delimiter)) {
        return `"${escapeString(value)}"`
      }
      return value
    }
    return String(value)
  }

  serializeObject(obj)

  let result = lines.join('\n')

  // Handle finalEOL (default: true)
  const finalEOL = options.finalEOL !== undefined ? options.finalEOL : true
  if (finalEOL && !result.endsWith('\n')) {
    result += '\n'
  } else if (!finalEOL && result.endsWith('\n')) {
    result = result.slice(0, -1)
  }

  // Handle EOL customization
  const EOL = options.EOL || '\n'
  if (EOL !== '\n') {
    result = result.replace(/\n/g, EOL)
  }

  return result
}

export function stripBom(content: string | Buffer): string {
  if (Buffer.isBuffer(content)) content = content.toString('utf8')
  return content.replace(/^\uFEFF/, '')
}

function applyReviver(obj: any, reviver: (key: string, value: any) => any): any {
  return reviver('', obj)
}

function parseInlineArray(valueStr: string, expectedLength?: number): any[] {
  const delimiter = detectDelimiter(valueStr)
  const values = valueStr.split(delimiter).map(v => parseValue(v.trim()))

  if (expectedLength !== undefined && values.length !== expectedLength) {
    console.warn(`[toonfile] Array length mismatch: expected ${expectedLength}, got ${values.length}`)
  }

  return values
}

function detectDelimiter(str: string): string | RegExp {
  if (str.includes('\t')) return '\t'
  if (str.includes('|')) return '|'
  return ','
}

function parseValue(str: string): ToonValue {
  if (str === 'null') return null
  if (str === 'true') return true
  if (str === 'false') return false

  if (/^-?\d+(\.\d+)?$/.test(str)) {
    return parseFloat(str)
  }

  if ((str.startsWith('"') && str.endsWith('"')) ||
      (str.startsWith("'") && str.endsWith("'"))) {
    return unescapeString(str.slice(1, -1))
  }

  return str
}

function getIndentLevel(line: string): number {
  const match = line.match(/^( *)/)
  return match ? match[1].length : 0
}

function needsQuotes(str: string, delimiter: string): boolean {
  const reservedWords = ['true', 'false', 'null']
  if (reservedWords.includes(str)) return true
  if (str.includes(delimiter)) return true
  if (str.includes(':')) return true
  if (str.includes('\n') || str.includes('\r') || str.includes('\t')) return true
  if (/^-?\d+(\.\d+)?$/.test(str)) return true
  return false
}

function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
}

function unescapeString(str: string): string {
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\')
}
