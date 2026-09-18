import withAuth, { UserSessionProps } from '@/components/hoc/withAuth'
import SimplifiedStudies from '@/components/pages/SimplifiedStudies'
import { getOrgNameByOrgVersionId } from '@/db/organization'
import { hasAccessToSimplifiedStudies } from '@/services/permissions/environment'
import NotFound from '@abc-transitionbascarbone/components/src/pages/NotFound'

const MyFootprints = async ({ user }: UserSessionProps) => {
  if (!user.organizationVersionId || !hasAccessToSimplifiedStudies(user.environment)) {
    return <NotFound />
  }

  const organizationName = await getOrgNameByOrgVersionId(user.organizationVersionId)

  if (!organizationName) {
    return <NotFound />
  }

  return (
    <SimplifiedStudies
      organizationVersionId={user.organizationVersionId}
      organizationName={organizationName}
      user={user}
    />
  )
}

export default withAuth(MyFootprints)
