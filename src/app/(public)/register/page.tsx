import SignUpFormCut from '@/components/auth/SignUpFormCut'
import { auth } from '@/services/auth'
import { redirect } from 'next/navigation'

const CountSignUpPage = async () => {
  const session = await auth()
  if (session?.user.organizationVersionId) {
    redirect('/')
  }

  return <SignUpFormCut defaultEmail={session?.user.email} />
}

export default CountSignUpPage
