/**
 * Regenerates src/tests/fixtures/count/expected/*.json from situation fixtures.
 *
 * Run from repo root (after publicodes-count is compiled):
 *   yarn tsx src/scripts/cut/generate-golden-results.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Engine from 'publicodes'
import rules from '@/publicodes/rules/publicodes-build/index.js'
import { POST_TO_RULENAME, getSubPostRuleNameCut } from '@/environments/cut/publicodes/subPostMapping'
import { CutPost, subPostsByPostCUT } from '@/services/posts'
import {
  COUNT_FIXTURE_NAMES,
  loadCountSituation,
  type CountGoldenPostResults,
} from '@/tests/fixtures/count/loadFixtures'

const TOTAL_RULE = 'bilan'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const expectedDir = path.join(scriptDir, '../../tests/fixtures/count/expected')

function evaluateSubPosts(situation: Record<string, unknown>): Record<string, number> {
  const engine = new Engine(rules).shallowCopy()
  engine.setSituation(situation)
  const results: Record<string, number> = {}

  for (const post of Object.values(CutPost)) {
    for (const subPost of subPostsByPostCUT[post]) {
      const ruleName = getSubPostRuleNameCut(subPost)
      if (!ruleName) {
        continue
      }
      results[`${post}.${subPost}`] = engine.evaluate(ruleName).nodeValue as number
    }
  }

  return results
}

function evaluateSituation(situation: Record<string, unknown>): CountGoldenPostResults {
  const engine = new Engine(rules).shallowCopy()
  engine.setSituation(situation)

  const results: CountGoldenPostResults = {}
  for (const post of Object.values(CutPost)) {
    const ruleName = POST_TO_RULENAME[post]
    results[ruleName] = engine.evaluate(ruleName).nodeValue as number
  }
  results[TOTAL_RULE] = engine.evaluate(TOTAL_RULE).nodeValue as number
  return results
}

function main() {
  fs.mkdirSync(expectedDir, { recursive: true })

  for (const name of COUNT_FIXTURE_NAMES) {
    const situation = loadCountSituation(name)
    const results = evaluateSituation(situation)
    const outPath = path.join(expectedDir, `${name}.json`)
    fs.writeFileSync(outPath, `${JSON.stringify(results, null, 2)}\n`)
    console.log(`Wrote ${outPath}`)

    const subPostResults = evaluateSubPosts(situation)
    const subPostPath = path.join(expectedDir, `${name}-subposts.json`)
    fs.writeFileSync(subPostPath, `${JSON.stringify(subPostResults, null, 2)}\n`)
    console.log(`Wrote ${subPostPath}`)
  }
}

main()
