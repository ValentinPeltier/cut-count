import type { UserSession } from 'next-auth'
import { hasEditAccessOnStudy } from './study'
export const isCutContributor = (study: object, session: { user: UserSession }) => {
  return false
}

export const canSaveSituationOnStudy = async (studyId: string, study: object, session: { user: UserSession }) => {
  const hasEditAccess = await hasEditAccessOnStudy(studyId, session)
  if (hasEditAccess) {
    return true
  }

  return isCutContributor(study, session)
}
