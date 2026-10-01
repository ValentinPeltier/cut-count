import {
  ADMIN_STUDIES_EXPORT_ROWS,
  ADMIN_STUDIES_EXPORT_SHEET_NAME,
  type AdminStudiesExportRow,
} from '@/constants/adminStudiesExport'
import { getSimplifiedPublicodesConfig } from '@/services/publicodes/simplifiedPublicodesConfig'
import { computeResultsFromConfig } from '@/services/results/computeSimplifiedResults'
import {
  cinemaDisplayName,
  extractField,
  extractImpact,
  mergedSituation,
  type AdminExportCell,
  type AdminExportContext,
} from './extractors'
import type { AdminExportStudySite } from './types'

export type AdminStudiesExportSheet = {
  name: string
  data: AdminExportCell[][]
  options: object
}

const emptyCells = (count: number): AdminExportCell[] => Array.from({ length: count }, () => '')

const sortSites = (sites: AdminExportStudySite[]): AdminExportStudySite[] =>
  [...sites].sort((left, right) => {
    const byName = cinemaDisplayName(left).localeCompare(cinemaDisplayName(right), 'fr')
    if (byName !== 0) {
      return byName
    }
    return left.id.localeCompare(right.id)
  })

const rowValues = (row: AdminStudiesExportRow, contexts: AdminExportContext[]): AdminExportCell[] => {
  if (row.kind === 'section') {
    return emptyCells(contexts.length)
  }
  if (row.kind === 'impactTotal') {
    return contexts.map((context) => extractImpact(context.results, 'total'))
  }
  if (row.kind === 'field') {
    return contexts.map((context) => extractField(row.extractor, context))
  }
  if (row.kind === 'subPost') {
    return contexts.map((context) => extractImpact(context.results, row.post, row.subPost))
  }
  return contexts.map((context) => extractImpact(context.results, row.post))
}

export const buildAdminStudiesExportSheet = (
  sites: AdminExportStudySite[],
  tPost: (key: string) => string,
): AdminStudiesExportSheet => {
  const orderedSites = sortSites(sites)
  const config = getSimplifiedPublicodesConfig(undefined)
  const engine = config.getEngine()

  const contexts: AdminExportContext[] = orderedSites.map((site) => {
    const situation = mergedSituation(site)
    const situatedEngine = engine.shallowCopy()
    situatedEngine.setSituation(situation)
    return {
      site,
      situation,
      engine: situatedEngine,
      results: computeResultsFromConfig(engine, situation, config, tPost),
    }
  })

  const header: AdminExportCell[] = ['', ...orderedSites.map(cinemaDisplayName)]
  const data: AdminExportCell[][] = [
    header,
    ...ADMIN_STUDIES_EXPORT_ROWS.map((row) => [row.label, ...rowValues(row, contexts)]),
  ]

  return {
    name: ADMIN_STUDIES_EXPORT_SHEET_NAME,
    data,
    options: {},
  }
}
