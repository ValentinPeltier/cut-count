import { studySiteToCutSituation } from '@/environments/cut/publicodes/studySiteToSituation'
import {
  getFormLayoutsForSubPostCUT,
  getPostRuleNameCut,
  getSubPostRuleNameCut,
  hasPublicodesMapping,
  POST_TO_RULENAME,
} from '@/environments/cut/publicodes/subPostMapping'
import { getCutEngine } from '@/environments/cut/publicodes/cut-engine'
import { PUBLICODES_COUNT_VERSION } from '@/constants/versions'
import { CutPost, subPostsByPostCUT } from '@/services/posts'
import type { SimplifiedPublicodesConfig } from '@/services/publicodes/simplifiedPublicodesConfig'
import { computeResultsForAllSitesFromSituations } from '@/services/results/computeSimplifiedResults'
import { getTotalValueFromBaseResults } from '@/services/results/publicodes'
import {
  COUNT_FIXTURE_NAMES,
  loadCountExpectedResults,
  loadCountExpectedSubPostResults,
  loadCountSituation,
} from '@/tests/fixtures/count/loadFixtures'
import { studySiteToSituation } from '@/services/studySiteToSituation'
import { StudyResultUnit, SubPost } from '@/db-common/enums'
import { roundTo } from '@/lib/utils/number'
import { Situation } from 'publicodes'

const tPostIdentity = (key: string) => key

const cutConfig: SimplifiedPublicodesConfig<CutPost> = {
  posts: Object.values(CutPost),
  subPostsByPost: subPostsByPostCUT,
  getFormLayout: getFormLayoutsForSubPostCUT,
  getPostRuleName: getPostRuleNameCut,
  getSubPostRuleName: getSubPostRuleNameCut,
  getEngine: getCutEngine,
  modelVersion: PUBLICODES_COUNT_VERSION,
}

describe('Count! results pipeline', () => {

  describe('studySiteToCutSituation', () => {
    it('maps study site numeric fields to Publicodes keys', () => {
      expect(
        studySiteToCutSituation({
          distanceToParis: 42,
          numberOfTickets: 1000,
          numberOfSessions: 50,
          numberOfOpenDays: 300,
        }),
      ).toEqual({
        'général . distance depuis paris': 42,
        'général . nombre entrées': 1000,
        'général . nombre séances': 50,
        'général . nombre de jours ouverture': 300,
      })
    })

    it('returns empty object when study site is undefined', () => {
      expect(studySiteToCutSituation(undefined)).toEqual({})
    })

    it('omits null fields', () => {
      expect(studySiteToCutSituation({ distanceToParis: null, numberOfTickets: 10 })).toEqual({
        'général . nombre entrées': 10,
      })
    })
  })

  describe('CUT Publicodes mapping', () => {
    it('maps every CutPost to a rule name', () => {
      for (const post of Object.values(CutPost)) {
        expect(POST_TO_RULENAME[post]).toBeTruthy()
      }
    })

    it('maps every CUT sub-post to a Publicodes rule', () => {
      for (const subPosts of Object.values(subPostsByPostCUT)) {
        for (const subPost of subPosts) {
          expect(hasPublicodesMapping(subPost)).toBe(true)
        }
      }
    })
  })

  describe('golden fixtures', () => {
    it.each(COUNT_FIXTURE_NAMES)('computes post totals for fixture %s', (fixtureName) => {
      const situation = loadCountSituation(fixtureName) as Situation<string>
      const expected = loadCountExpectedResults(fixtureName)
      const { aggregated } = computeResultsForAllSitesFromSituations(
        { site1: situation },
        cutConfig,
        tPostIdentity,
      )

      for (const post of Object.values(CutPost)) {
        const ruleName = POST_TO_RULENAME[post]
        const row = aggregated.find((r) => r.post === post)
        expect(row).toBeDefined()
        expect(roundTo(row!.value, 3)).toBe(roundTo(expected[ruleName], 3))
      }

      const totalRow = aggregated.find((r) => r.post === 'total')
      expect(totalRow).toBeDefined()
      expect(roundTo(totalRow!.value, 3)).toBe(roundTo(expected.bilan, 3))
    })

    it('rich-all-posts fixture has non-zero emissions on every post', () => {
      const situation = loadCountSituation('rich-all-posts') as Situation<string>
      const expected = loadCountExpectedResults('rich-all-posts')

      for (const ruleName of Object.values(POST_TO_RULENAME)) {
        expect(expected[ruleName]).toBeGreaterThan(0)
      }
      expect(expected.bilan).toBeGreaterThan(0)

      const { aggregated } = computeResultsForAllSitesFromSituations(
        { site1: situation },
        cutConfig,
        tPostIdentity,
      )
      const totalRow = aggregated.find((r) => r.post === 'total')
      expect(roundTo(totalRow!.value, 3)).toBe(roundTo(expected.bilan, 3))
    })

    it('rich-all-posts sub-post pipeline matches golden sub-post values', () => {
      const situation = loadCountSituation('rich-all-posts') as Situation<string>
      const expectedSubPosts = loadCountExpectedSubPostResults('rich-all-posts')
      const { aggregated } = computeResultsForAllSitesFromSituations(
        { site1: situation },
        cutConfig,
        tPostIdentity,
      )

      for (const post of Object.values(CutPost)) {
        const postRow = aggregated.find((r) => r.post === post)
        expect(postRow).toBeDefined()

        for (const subPost of subPostsByPostCUT[post]) {
          const key = `${post}.${subPost}`
          const child = postRow!.children.find((c) => c.post === subPost)
          expect(child).toBeDefined()
          expect(roundTo(child!.value, 3)).toBe(roundTo(expectedSubPosts[key], 3))
        }
      }
    })
  })

  describe('study site merge', () => {
    it('merges study site fields into situation before computing results', () => {
      const siteFields = {
        distanceToParis: 200,
        numberOfTickets: 50000,
        numberOfSessions: 1200,
        numberOfOpenDays: 365,
      }
      const formAnswers = loadCountSituation('rich') as Situation<string>
      const merged = { ...formAnswers, ...studySiteToCutSituation(siteFields) }

      const fromMerged = computeResultsForAllSitesFromSituations(
        { site1: merged },
        cutConfig,
        tPostIdentity,
      )
      const fromFormOnly = computeResultsForAllSitesFromSituations(
        { site1: formAnswers },
        cutConfig,
        tPostIdentity,
      )

      expect(fromMerged.aggregated.find((r) => r.post === 'total')?.value).toBe(
        fromFormOnly.aggregated.find((r) => r.post === 'total')?.value,
      )
    })
  })

  describe('multi-site aggregation', () => {
    it('sums minimal fixture across two sites', () => {
      const situation = loadCountSituation('minimal') as Situation<string>
      const { aggregated } = computeResultsForAllSitesFromSituations(
        { siteA: situation, siteB: situation },
        cutConfig,
        tPostIdentity,
      )

      const totalRow = aggregated.find((r) => r.post === 'total')
      expect(totalRow?.value).toBe(1400)
    })
  })

  describe('getTotalValueFromBaseResults', () => {
    it('converts kgCO2e to study display unit', () => {
      const situation = loadCountSituation('rich') as Situation<string>
      const { aggregated } = computeResultsForAllSitesFromSituations(
        { site1: situation },
        cutConfig,
        tPostIdentity,
      )
      const totalKg = aggregated.find((r) => r.post === 'total')!.value
      expect(getTotalValueFromBaseResults(aggregated, StudyResultUnit.T)).toBe(totalKg / 1000)
      expect(getTotalValueFromBaseResults(aggregated, StudyResultUnit.K)).toBe(totalKg)
    })
  })
})

describe('studySiteToSituation registry', () => {
  it('includes CUT in simplified environments mapping', () => {
    expect(subPostsByPostCUT[CutPost.Fonctionnement]).toContain(SubPost.Energie)
  })
})
