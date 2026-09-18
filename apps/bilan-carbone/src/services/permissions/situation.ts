import type { UserSession } from 'next-auth'
import { hasEditAccessOnStudy } from './study'
export const isSimplifiedContributor = (
  study: { contributors: Array<{ accountId: string }> },
  session: { user: UserSession },
) => {
  return false
}

export const canSaveSituationOnStudy = async (
  studyId: string,
  study: { contributors: Array<{ accountId: string }> },
  session: { user: UserSession },
) => {
  const hasEditAccess = await hasEditAccessOnStudy(studyId, session)
  if (hasEditAccess) {
    return true
  }

  return isSimplifiedContributor(study, session)
}
