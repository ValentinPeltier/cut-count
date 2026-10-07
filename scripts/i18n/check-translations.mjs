#!/usr/bin/env node
/**
 * Ensure every locale file under src/i18n/translations/ has:
 * - the exact same key tree
 * - no empty string values (including whitespace-only)
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TRANSLATIONS_DIR = path.resolve(__dirname, '../../src/i18n/translations')

/**
 * @param {unknown} value
 * @param {string} prefix
 * @returns {{ keys: string[], empty: string[] }}
 */
export function inspectTranslationTree(value, prefix = '') {
  const keys = []
  const empty = []

  if (typeof value === 'string') {
    keys.push(prefix)
    if (value.trim() === '') {
      empty.push(prefix)
    }
    return { keys, empty }
  }

  if (Array.isArray(value)) {
    throw new Error(`Unexpected array at "${prefix || '<root>'}" (translation trees must be objects/strings)`)
  }

  if (!value || typeof value !== 'object') {
    throw new Error(`Unexpected value type at "${prefix || '<root>'}": ${value === null ? 'null' : typeof value}`)
  }

  const entries = Object.entries(value).sort(([a], [b]) => a.localeCompare(b))
  if (entries.length === 0 && prefix) {
    keys.push(prefix)
  }

  for (const [key, child] of entries) {
    const childPath = prefix ? `${prefix}.${key}` : key
    const nested = inspectTranslationTree(child, childPath)
    keys.push(...nested.keys)
    empty.push(...nested.empty)
  }

  return { keys, empty }
}

/**
 * @param {string} translationsDir
 */
export function checkTranslationFiles(translationsDir = TRANSLATIONS_DIR) {
  const files = fs
    .readdirSync(translationsDir)
    .filter((name) => name.endsWith('.json'))
    .sort()

  if (files.length === 0) {
    throw new Error(`No translation JSON files found in ${translationsDir}`)
  }

  /** @type {Map<string, { keys: string[], empty: string[] }>} */
  const reports = new Map()

  for (const file of files) {
    const filePath = path.join(translationsDir, file)
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    reports.set(file, inspectTranslationTree(content))
  }

  const referenceFile = files[0]
  const referenceKeys = new Set(reports.get(referenceFile).keys)
  const errors = []

  for (const file of files) {
    const { keys, empty } = reports.get(file)
    const keySet = new Set(keys)

    const missing = [...referenceKeys].filter((key) => !keySet.has(key)).sort()
    const extra = [...keySet].filter((key) => !referenceKeys.has(key)).sort()

    if (missing.length > 0) {
      errors.push(`[${file}] missing keys (present in ${referenceFile}):\n  - ${missing.join('\n  - ')}`)
    }
    if (extra.length > 0) {
      errors.push(`[${file}] unexpected keys (absent from ${referenceFile}):\n  - ${extra.join('\n  - ')}`)
    }
    if (empty.length > 0) {
      errors.push(`[${file}] empty values:\n  - ${empty.join('\n  - ')}`)
    }
  }

  // Also compare every pair so a bug in the "reference" file still surfaces clearly.
  for (let i = 0; i < files.length; i++) {
    for (let j = i + 1; j < files.length; j++) {
      const left = files[i]
      const right = files[j]
      const leftKeys = new Set(reports.get(left).keys)
      const rightKeys = new Set(reports.get(right).keys)
      if (leftKeys.size !== rightKeys.size || [...leftKeys].some((key) => !rightKeys.has(key))) {
        // Detailed missing/extra already reported against the reference; keep a compact pair summary.
        const onlyLeft = [...leftKeys].filter((key) => !rightKeys.has(key)).length
        const onlyRight = [...rightKeys].filter((key) => !leftKeys.has(key)).length
        if (onlyLeft || onlyRight) {
          errors.push(`[${left} vs ${right}] key mismatch (${onlyLeft} only in ${left}, ${onlyRight} only in ${right})`)
        }
      }
    }
  }

  return {
    files,
    keyCount: referenceKeys.size,
    errors,
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain) {
  try {
    const result = checkTranslationFiles()
    if (result.errors.length > 0) {
      console.error('Translation check failed:\n')
      for (const error of result.errors) {
        console.error(`${error}\n`)
      }
      process.exit(1)
    }
    console.log(
      `Translation check passed: ${result.files.length} files (${result.files.join(', ')}), ${result.keyCount} keys, no empty values.`,
    )
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  }
}
