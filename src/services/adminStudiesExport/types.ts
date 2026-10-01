import { StudyResultUnit } from '@/generated/prisma/enums'

export type AdminExportStudySite = {
  id: string
  numberOfSessions: number | null
  numberOfTickets: number | null
  numberOfOpenDays: number | null
  distanceToParis: number | null
  situation: {
    situation: unknown
    listLayoutSituations: unknown
  } | null
  site: {
    name: string
    cnc: {
      nom: string | null
      dep: string | null
      ecrans: number | null
      fauteuils: number | null
      numberOfProgrammedFilms: number
    } | null
  }
  study: {
    name: string
    resultsUnit: StudyResultUnit
    createdBy: { user: { email: string } }
  }
}
