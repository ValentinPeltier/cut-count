import withAuth, { UserSessionProps } from '@/components/hoc/withAuth'
import withStudyCreation, { StudyCreationProps } from '@/components/hoc/withStudyCreation'
import NewStudyPage from '@/components/pages/NewStudy'
import { getAccountOrganizationVersions } from '@/db/account'
import { getOrganizationVersionAccounts, getOrganizationVersionForRightsCheck } from '@/db/organization'
import NotFound from '@/lib/components/pages/NotFound'
import { canCreateAStudy } from '@/services/permissions/study'
import { getUserSettings } from '@/services/serverFunctions/user'
import { defaultCAUnit } from '@/utils/number'
import { hasActiveLicence } from '@/utils/organization'
import { redirect } from 'next/navigation'

const NewStudy = async ({ user, isCut }: UserSessionProps & StudyCreationProps) => {
  if (!user.organizationVersionId || !(await canCreateAStudy(user, isCut))) {
    return <NotFound />
  }

  const [organizationVersions, accounts] = await Promise.all([
    getAccountOrganizationVersions(user.accountId),
    getOrganizationVersionAccounts(user.organizationVersionId),
  ])

  const organizationVersionId = organizationVersions.find(
    (organizationVersion) => organizationVersion.id === user.organizationVersionId,
  )?.id

  if (organizationVersionId) {
    const organizationVersion = await getOrganizationVersionForRightsCheck(organizationVersionId)
    if (!organizationVersion || !hasActiveLicence(organizationVersion)) {
      redirect('/')
    }
  }

  const userSettings = await getUserSettings()
  const caUnit = userSettings.success ? userSettings.data?.caUnit || defaultCAUnit : defaultCAUnit

  return (
    <NewStudyPage
      organizationVersions={organizationVersions}
      user={user}
      accounts={accounts}
      caUnit={caUnit}
    />
  )
}

export default withAuth(withStudyCreation(NewStudy))
