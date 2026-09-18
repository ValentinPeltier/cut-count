import type { SimplifiedPublicodesConfig } from '@/services/publicodes/simplifiedPublicodesConfig'
import type { BaseResultsByPost } from '@/services/posts'
import { aggregateBaseResultsByPost, computeBaseResultsByPostFromEngine } from '@/services/results/publicodes'
import type { BaseResultsBySite } from '@/types/study.types'

import Engine, { Situation } from 'publicodes'

export function computeResultsFromConfig(
  engine: Engine,
  situation: Situation<string>,
  config: SimplifiedPublicodesConfig,
  tPost: (key: string) => string,
): BaseResultsByPost[] {
  const engineCopy = engine.shallowCopy()
  engineCopy.setSituation(situation)
  return computeBaseResultsByPostFromEngine(
    engineCopy,
    config.posts,
    config.subPostsByPost,
    tPost,
    config.getPostRuleName,
    config.getSubPostRuleName,
  )
}

export const computeResultsForAllSitesFromSituations = (
  situations: Record<string, Situation<string>>,
  config: SimplifiedPublicodesConfig,
  tPost: (key: string) => string,
): BaseResultsBySite => {
  const engine = config.getEngine()
  const bySite = Object.entries(situations).reduce(
    (bySiteAcc, [siteId, situation]) => {
      bySiteAcc[siteId] = computeResultsFromConfig(engine, situation, config, tPost)
      return bySiteAcc
    },
    {} as Record<string, BaseResultsByPost[]>,
  )

  const aggregated = aggregateBaseResultsByPost(Object.values(bySite))
  return { aggregated, bySite }
}
