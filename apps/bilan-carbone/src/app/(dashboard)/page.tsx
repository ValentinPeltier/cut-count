import withAuth, { UserSessionProps } from '@/components/hoc/withAuth'
import UserFeedback from '@/components/home/UserFeedback'
import { displayFeedBackForm } from '@/services/serverFunctions/user'
import Block from '@abc-transitionbascarbone/components/src/base/Block'
import dynamic from 'next/dynamic'

const FooterCut = dynamic(() => import('@/environments/cut/layout/Footer'))
const SimplifiedUserView = dynamic(() => import('@/environments/simplified/home/UserView'))
const CUTLogosHome = dynamic(() => import('@/environments/cut/home/LogosHome'))

export const revalidate = 0

const Home = async ({ user: account }: UserSessionProps) => {
  const displayFeedback = await displayFeedBackForm()

  return (
    <>
      <Block>
        <SimplifiedUserView account={account} />
        <CUTLogosHome user={account} />
        {displayFeedback.success && displayFeedback.data && <UserFeedback environment={account.environment} />}
      </Block>
      <FooterCut />
    </>
  )
}

export default withAuth(Home)
