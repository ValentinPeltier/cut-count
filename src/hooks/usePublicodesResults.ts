'use client'

/* eslint-disable react-compiler/react-compiler */

import type { FullStudy } from '@/db/study'
import { getSimplifiedPublicodesConfig } from '@/services/publicodes/simplifiedPublicodesConfig'
import { computeResultsForAllSitesFromSituations } from '@/services/results/computeSimplifiedResults'
import { loadSituations } from '@/services/serverFunctions/situation'
import type { BaseResultsBySite } from '@/types/study.types'
import { useTranslations } from 'next-intl'
import { Situation } from 'publicodes'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface UsePublicodesResultsReturn extends BaseResultsBySite {
  isLoading: boolean
  error: string | null
  refresh: () => void
}

export function usePublicodesResults(study: FullStudy, studySite: string | 'all'): UsePublicodesResultsReturn {
  const tPost = useTranslations('emissionFactors.post')
  const [situationBySiteId, setSituationsBySiteId] = useState<Record<string, Situation<string>>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const config = useMemo(() => getSimplifiedPublicodesConfig(undefined), [study.subPostsConfigVersion])

  const studySiteIds = useMemo(() => {
    if (studySite === 'all') {
      return study.sites.map((s) => s.id).toSorted()
    }
    return [studySite]
  }, [study.sites, studySite])

  const studySiteIdsKey = useMemo(() => studySiteIds.join(','), [studySiteIds])

  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const refresh = useCallback(() => setRefreshTrigger((t) => t + 1), [])

  useEffect(() => {
    const load = async () => {
      if (studySiteIds.length === 0 || !config) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const result = await loadSituations(study.id, studySiteIds)
        if (!result.success) {
          throw new Error(result.errorMessage || 'Failed to load situations')
        }

        const loadedSituationBySiteId = (result.data ?? []).reduce(
          (acc, situation) => {
            if (situation.situation) {
              acc[situation.studySiteId] = situation.situation as Situation<string>
            }
            return acc
          },
          {} as Record<string, Situation<string>>,
        )

        setSituationsBySiteId(loadedSituationBySiteId)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load situations')
        setIsLoading(false)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [study.id, studySiteIdsKey, config, refreshTrigger, studySiteIds.length])

  const results = useMemo(() => {
    if (!config || Object.keys(situationBySiteId).length === 0) {
      return { aggregated: [], bySite: {} }
    }
    return computeResultsForAllSitesFromSituations(situationBySiteId, config, tPost)
  }, [config, situationBySiteId, tPost])

  return { ...results, isLoading, error, refresh }
}
