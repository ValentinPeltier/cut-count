import { Environment } from '@/db-common/enums'
import { studySiteToCutSituation } from '@/environments/cut/publicodes/studySiteToSituation'
import { Situation } from 'publicodes'
import { EnvironmentWithSimplifiedStudies } from './permissions/environment'

export interface CutStudySiteFields {
  distanceToParis?: number | null
  numberOfTickets?: number | null
  numberOfSessions?: number | null
  numberOfOpenDays?: number | null
}

export type StudySiteFields = CutStudySiteFields

export type StudySiteToSituationFn = (studySite: StudySiteFields | undefined) => Situation<string>

const studySiteToSituationByEnvironment: Record<EnvironmentWithSimplifiedStudies, StudySiteToSituationFn> = {
  [Environment.CUT]: studySiteToCutSituation,
}

export function getStudySiteToSituation(
  environment: EnvironmentWithSimplifiedStudies,
): StudySiteToSituationFn | undefined {
  return studySiteToSituationByEnvironment[environment]
}

export function studySiteToSituation(
  environment: EnvironmentWithSimplifiedStudies,
  studySite: StudySiteFields | undefined,
): Situation<string> {
  const fn = getStudySiteToSituation(environment)
  return fn ? fn(studySite) : {}
}
