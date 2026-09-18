import withAuth, { UserSessionProps } from '@/components/hoc/withAuth'
import { StudyProps } from '@/components/hoc/withStudy'
import withStudyDetails from '@/components/hoc/withStudyDetails'
import StudyDataEntryInfographyPage from '@/components/pages/StudyDataEntryInfographyPage'
import { isOrganizationVersionCR } from '@/db/organization'
import { canDeleteStudy } from '@/services/permissions/study'
import { getAccountRoleOnStudy } from '@/utils/study'
import NotFound from '@abc-transitionbascarbone/components/src/pages/NotFound'

const DataEntry = async ({ study, user }: StudyProps & UserSessionProps) => {
  const userRole = getAccountRoleOnStudy(user, study)

  const [canDelete, userOrgIsCR] = await Promise.all([
    canDeleteStudy(study.id),
    isOrganizationVersionCR(user.organizationVersionId),
  ])

  if (!userRole) {
    return <NotFound />
  }
  return (
    <StudyDataEntryInfographyPage
      study={study}
      userRole={userRole}
      user={user}
      canDeleteStudy={canDelete}
      organizationVersionId={userOrgIsCR ? study.organizationVersionId : null}
    />
  )
}

export default withAuth(withStudyDetails(DataEntry))
