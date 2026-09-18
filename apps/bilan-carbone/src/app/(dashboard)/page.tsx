import withAuth, { UserSessionProps } from '@/components/hoc/withAuth'
import UserFeedback from '@/components/home/UserFeedback'
import UserView from '@/components/home/UserView'
import Onboarding from '@/components/onboarding/Onboarding'
import { getOrganizationVersionById } from '@/db/organization'
import DynamicComponent from '@/environments/core/utils/DynamicComponent'
import { default as CUTLogosHome } from '@/environments/cut/home/LogosHome'
import { displayFeedBackForm } from '@/services/serverFunctions/user'
import Block from '@abc-transitionbascarbone/components/src/base/Block'
import { Environment } from '@abc-transitionbascarbone/db-common/enums'
import { environmentWithOnboarding } from '@abc-transitionbascarbone/utils/environments'
import dynamic from 'next/dynamic'

const FooterCut = dynamic(() => import('@/environments/cut/layout/Footer'))
const SimplifiedUserView = dynamic(() => import('@/environments/simplified/home/UserView'))

export const revalidate = 0

const Home = async ({ user: account }: UserSessionProps) => {
  const [userOrganizationVersion, displayFeedback] = await Promise.all([
    getOrganizationVersionById(account.organizationVersionId),
    displayFeedBackForm(),
  ])

  const showOnboarding =
    userOrganizationVersion &&
    !userOrganizationVersion.onboarded &&
    environmentWithOnboarding.includes(userOrganizationVersion.environment)

  return (
    <>
      <Block>
        <DynamicComponent
          environmentComponents={{
            [Environment.CUT]: <SimplifiedUserView account={account} />,
          }}
          defaultComponent={<UserView account={account} />}
          forceEnvironment={account.environment}
        />
        <CUTLogosHome user={account} />

        {showOnboarding && <Onboarding user={account} organizationVersion={userOrganizationVersion!} />}
        {displayFeedback.success && displayFeedback.data && <UserFeedback environment={account.environment} />}
      </Block>
      <DynamicComponent
        environmentComponents={{
          [Environment.CUT]: <FooterCut />,
        }}
      />
    </>
  )
}

export default withAuth(Home)
