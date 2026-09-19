import StudiesContainer from '@/components/study/StudiesContainer'
import withAuth, { UserSessionProps } from '@/components/hoc/withAuth'
import Block from '@/lib/components/base/Block'
import dynamic from 'next/dynamic'

const FooterCut = dynamic(() => import('@/environments/cut/layout/Footer'))
const SimplifiedUserView = dynamic(() => import('@/environments/simplified/home/UserView'))
const CUTLogosHome = dynamic(() => import('@/environments/cut/home/LogosHome'))

export const revalidate = 0

const Home = async ({ user: account }: UserSessionProps) => {
  const hasOrganization = !!account.organizationVersionId

  return (
    <>
      <Block>
        <SimplifiedUserView account={account} />
        {!hasOrganization && <StudiesContainer user={account} />}
        <CUTLogosHome user={account} />
      </Block>
      <FooterCut />
    </>
  )
}

export default withAuth(Home)
