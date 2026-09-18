import { studySiteToCutSituation } from '@/environments/cut/publicodes/studySiteToSituation'
import { Situation } from 'publicodes'

export interface CutStudySiteFields {
  distanceToParis?: number | null
  numberOfTickets?: number | null
  numberOfSessions?: number | null
  numberOfOpenDays?: number | null
}

export type StudySiteFields = CutStudySiteFields

export type StudySiteToSituationFn = (studySite: StudySiteFields | undefined) => Situation<string>

export function getStudySiteToSituation(): StudySiteToSituationFn {
  return studySiteToCutSituation
}

export function studySiteToSituation(studySite: StudySiteFields | undefined): Situation<string> {
  return studySiteToCutSituation(studySite)
}
