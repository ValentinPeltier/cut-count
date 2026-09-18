import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const FIXTURES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)))

export type CountGoldenPostResults = Record<string, number>

export function loadCountSituation(name: string): Record<string, unknown> {
  const filePath = path.join(FIXTURES_DIR, 'situations', `${name}.json`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>
}

export function loadCountExpectedResults(name: string): CountGoldenPostResults {
  const filePath = path.join(FIXTURES_DIR, 'expected', `${name}.json`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as CountGoldenPostResults
}

export type CountGoldenSubPostResults = Record<string, number>

export function loadCountExpectedSubPostResults(name: string): CountGoldenSubPostResults {
  const filePath = path.join(FIXTURES_DIR, 'expected', `${name}-subposts.json`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as CountGoldenSubPostResults
}

export const COUNT_FIXTURE_NAMES = ['empty', 'minimal', 'rich', 'rich-all-posts'] as const

export type CountFixtureName = (typeof COUNT_FIXTURE_NAMES)[number]
