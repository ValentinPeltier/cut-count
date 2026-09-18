import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import Engine from 'publicodes'
import rules, { type RuleName } from '../publicodes-build/index.js'

const FIXTURES_ROOT = path.resolve(
  fileURLToPath(import.meta.url),
  '../../../../tests/fixtures/count',
)

const POST_RULES: RuleName[] = [
  'fonctionnement',
  'mobilité spectateurs',
  'tournées avant premières',
  'salles et cabines',
  'confiseries et boissons',
  'déchets',
  'billetterie et communication',
]

function loadJson<T>(relativePath: string): T {
  return JSON.parse(fs.readFileSync(path.join(FIXTURES_ROOT, relativePath), 'utf8')) as T
}

function round3(value: number) {
  return Math.round(value * 1000) / 1000
}

describe('Count golden fixtures (shared with bilan-carbone)', () => {
  const engine = new Engine(rules)

  test.each(['empty', 'minimal', 'rich', 'rich-all-posts'] as const)('fixture %s matches expected post values', (name) => {
    const situation = loadJson<Record<string, unknown>>(`situations/${name}.json`)
    const expected = loadJson<Record<string, number>>(`expected/${name}.json`)

    const localEngine = engine.shallowCopy()
    localEngine.setSituation(situation)

    for (const rule of POST_RULES) {
      expect(round3(localEngine.evaluate(rule).nodeValue as number)).toBe(round3(expected[rule]))
    }
    expect(round3(localEngine.evaluate('bilan').nodeValue as number)).toBe(round3(expected.bilan))
  })

  test('bilan equals sum of post rules on minimal fixture', () => {
    const situation = loadJson<Record<string, unknown>>('situations/minimal.json')
    const localEngine = engine.shallowCopy()
    localEngine.setSituation(situation)

    const postSum = POST_RULES.reduce(
      (acc, rule) => acc + (localEngine.evaluate(rule).nodeValue as number),
      0,
    )
    expect(localEngine.evaluate('bilan').nodeValue).toBe(postSum)
  })
})
