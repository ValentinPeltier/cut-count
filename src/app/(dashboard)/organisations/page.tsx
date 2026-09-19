import withAuth, { UserSessionProps } from '@/components/hoc/withAuth'
import OrganizationOnboarding from '@/components/organization/OrganizationOnboarding'
import OrganizationPage from '@/components/pages/Organization'
import { getAccountOrganizationVersions } from '@/db/account'
import NotFound from '@/lib/components/pages/NotFound'

const Organisation = async ({ user }: UserSessionProps) => {
  if (!user.organizationVersionId) {
    return <OrganizationOnboarding user={user} />
  }
  const organizationVersions = await getAccountOrganizationVersions(user.accountId)
  const organizationVersion = organizationVersions[0]
  if (!organizationVersion) {
    return <NotFound />
  }
  return <OrganizationPage organizationVersion={organizationVersion} user={user} />
}

export default withAuth(Organisation)
