import {
  resultsExportHeadersSimplified,
  simplifiedDisclaimerColSpan,
  simplifiedDisclaimerExportKeys,
} from '@/constants/exports'
import type { FullStudy } from '@/db/study'
import { StudyResultUnit } from '@/generated/prisma/enums'
import { Translations } from '@/lib'
import { formatDateFr } from '@/lib/utils/time'
import { formatEmissionValueForExport, getSiteLabelFromId, sanitizeStudyName } from '@/utils/study'
import { AdditionalResultTypes, BaseResultsBySite } from '../types/study.types'
import { download } from './file'
import { BaseResultsByPost } from './posts'
import { prepareExcel } from './serverFunctions/file'

export { getSiteLabelFromId, sanitizeStudyName }

type Merge = {
  s: { c: number; r: number }
  e: { c: number; r: number }
}

const getFormattedSimplifiedHeaders = (tStudy: Translations, tUnits: Translations, unit: StudyResultUnit) =>
  resultsExportHeadersSimplified.map((header) =>
    header !== 'value' ? tStudy(header) : tStudy(header, { unit: tUnits(unit) }),
  )

const getStudyResultsExportFilename = (studyName: string, tExport: Translations) => {
  const sanitized = sanitizeStudyName(studyName)
  return `${tExport('exportFilename', { studyName: sanitized })}.xlsx`
}

const buildResultsTableRows = (results: BaseResultsByPost[], resultsUnit: StudyResultUnit): (string | number)[][] => {
  const rows: (string | number)[][] = []

  for (const result of results) {
    rows.push([result.label, '', formatEmissionValueForExport(result.value ?? 0, resultsUnit)])

    if (result.post !== 'total') {
      for (const subPostResult of result.children) {
        rows.push(['', subPostResult.label, formatEmissionValueForExport(subPostResult.value ?? 0, resultsUnit)])
      }
    }
  }

  return rows
}

const buildStudyMetadataRows = (study: FullStudy, siteLabel: string, tExport: Translations): (string | number)[][] => [
  [tExport('simplified.metadata.organization'), study.organizationVersion.organization.name],
  [tExport('simplified.metadata.site'), siteLabel],
  [tExport('simplified.metadata.startDate'), formatDateFr(study.startDate)],
  [tExport('simplified.metadata.endDate'), formatDateFr(study.endDate)],
]

const buildDisclaimerRows = (
  tExport: Translations,
  keys: readonly string[] = simplifiedDisclaimerExportKeys,
  startRowIndex = 0,
  colSpan = simplifiedDisclaimerColSpan,
): { rows: (string | number)[][]; merges: Merge[] } => {
  const rows = keys.map((key) => [tExport(key)])
  const merges = keys.map((_, index) => ({
    s: { c: 0, r: startRowIndex + index },
    e: { c: colSpan - 1, r: startRowIndex + index },
  }))

  return { rows, merges }
}

const formatSimplifiedStudyResultsForExport = (
  study: FullStudy,
  siteLabel: string,
  results: BaseResultsByPost[],
  tStudy: Translations,
  tExport: Translations,
  tUnits: Translations,
  fileName: string,
) => {
  const dataForExport: (string | number)[][] = []
  const merges: Merge[] = []

  const disclaimer = buildDisclaimerRows(tExport)
  dataForExport.push(...disclaimer.rows)
  merges.push(...disclaimer.merges)
  dataForExport.push([])

  dataForExport.push(...buildStudyMetadataRows(study, siteLabel, tExport))
  dataForExport.push([])
  dataForExport.push(getFormattedSimplifiedHeaders(tStudy, tUnits, study.resultsUnit))
  dataForExport.push(...buildResultsTableRows(results, study.resultsUnit))

  return {
    name: fileName,
    data: dataForExport,
    options: {
      '!cols': [{ wch: 30 }, { wch: 15 }, { wch: 20 }],
      '!merges': merges,
    },
  }
}

export type SiteExportEntry = { name: string; siteId: string; studySiteId: string }

export const formatComputedResultsForExport = (
  study: FullStudy,
  siteList: SiteExportEntry[],
  resultsBySite: BaseResultsBySite,
  tStudy: Translations,
  tExport: Translations,
  tUnits: Translations,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _environment: string,
) => {
  const dataForExport: (string | number)[][] = []
  const formattedHeaders = getFormattedSimplifiedHeaders(tStudy, tUnits, study.resultsUnit)

  for (const site of siteList) {
    dataForExport.push([site.name])
    dataForExport.push(formattedHeaders)
    const results =
      site.studySiteId === 'all' ? resultsBySite.aggregated : (resultsBySite.bySite[site.studySiteId] ?? [])

    dataForExport.push(...buildResultsTableRows(results, study.resultsUnit))
  }

  dataForExport.push([])

  return {
    name: tExport(AdditionalResultTypes.ENV_SPECIFIC_EXPORT),
    data: dataForExport,
    options: { '!cols': [{ wch: 30 }, { wch: 15 }, { wch: 20 }] },
  }
}

export const downloadStudyResults = async (
  study: FullStudy,
  tStudy: Translations,
  tExport: Translations,
  tOrga: Translations,
  tUnits: Translations,
  resultsByPost?: BaseResultsByPost[],
  selectedSiteId?: string,
) => {
  const exportFilename = getStudyResultsExportFilename(study.name, tExport)

  if (!selectedSiteId || !resultsByPost) {
    throw new Error('Missing required parameters for Count study export')
  }

  const siteLabel = getSiteLabelFromId(study, selectedSiteId, tOrga)
  const sheet = formatSimplifiedStudyResultsForExport(
    study,
    siteLabel,
    resultsByPost,
    tStudy,
    tExport,
    tUnits,
    exportFilename,
  )
  const buffer = await prepareExcel([sheet])
  download([buffer], exportFilename, 'xlsx')
}
