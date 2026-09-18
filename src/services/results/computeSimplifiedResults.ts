import type { EnvironmentWithSimplifiedStudies } from '@/services/permissions/environment'
import type { SimplifiedPublicodesConfig } from '@/services/publicodes/simplifiedPublicodesConfig'
import type { BaseResultsByPost } from '@/services/posts'
import { aggregateBaseResultsByPost, computeBaseResultsByPostFromEngine } from '@/services/results/publicodes'
import type { BaseResultsBySite } from '@/types/study.types'
import { Environment } from '@/db-common/enums'
import Engine, { Situation } from 'publicodes'

export function computeResultsFromConfig(
  engine: Engine,
  situation: Situation<string>,
  config: SimplifiedPublicodesConfig,
  tPost: (key: string) => string,
  environment: Environment,
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
    environment,
  )
}

export const computeResultsForAllSitesFromSituations = (
  situations: Record<string, Situation<string>>,
  config: SimplifiedPublicodesConfig,
  tPost: (key: string) => string,
  environment: EnvironmentWithSimplifiedStudies,
): BaseResultsBySite => {
  const engine = config.getEngine()
  const bySite = Object.entries(situations).reduce(
    (bySiteAcc, [siteId, situation]) => {
      bySiteAcc[siteId] = computeResultsFromConfig(engine, situation, config, tPost, environment)
      return bySiteAcc
    },
    {} as Record<string, BaseResultsByPost[]>,
  )

  return {
    aggregated: aggregateBaseResultsByPost(Object.values(bySite)),
    bySite,
  }
}
