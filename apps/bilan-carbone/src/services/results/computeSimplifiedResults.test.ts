import { getCutEngine } from '@/environments/cut/publicodes/cut-engine'
import {
  aggregateBaseResultsByPost,
  computeTotalForBaseResults,
  getTotalValueFromBaseResults,
} from '@/services/results/publicodes'
import { computeResultsForAllSitesFromSituations } from '@/services/results/computeSimplifiedResults'
import type { BaseResultsByPost } from '@/services/posts'
import { loadCountSituation } from '@/tests/fixtures/count/loadFixtures'
import { Environment, StudyResultUnit } from '@abc-transitionbascarbone/db-common/enums'
import Engine, { Situation } from 'publicodes'

describe('computeSimplifiedResults edge cases', () => {
  const tPost = (key: string) => key

  it('aggregateBaseResultsByPost returns empty array for empty input', () => {
    expect(aggregateBaseResultsByPost([])).toEqual([])
  })

  it('getTotalValueFromBaseResults returns 0 when no total row', () => {
    expect(getTotalValueFromBaseResults([], StudyResultUnit.K)).toBe(0)
  })

  it('computeTotalForBaseResults uses bilan rule on Count engine', () => {
    const engine = getCutEngine()
    engine.setSituation(loadCountSituation('minimal') as Situation<string>)
    const postResults: BaseResultsByPost[] = [
      { post: 'Fonctionnement', label: 'a', value: 10, children: [] },
      { post: 'Dechets', label: 'b', value: 5, children: [] },
    ]

    const total = computeTotalForBaseResults(engine, postResults, tPost)
    expect(total.value).toBe(700)
    expect(total.post).toBe('total')
  })
})

describe('computeResultsForAllSitesFromSituations', () => {
  it('returns empty aggregation when no situations are provided', () => {
    const config = {
      posts: [],
      subPostsByPost: {},
      getFormLayout: () => [],
      getPostRuleName: () => 'x',
      getSubPostRuleName: () => undefined,
      getEngine: () => new Engine({}),
      modelVersion: 'test',
    }

    const result = computeResultsForAllSitesFromSituations({}, config, (k) => k, Environment.CUT)
    expect(result.aggregated).toEqual([])
    expect(result.bySite).toEqual({})
  })
})
