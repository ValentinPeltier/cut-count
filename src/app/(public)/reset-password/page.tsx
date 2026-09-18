import NewPasswordForm from '@/components/auth/NewPasswordForm'
import { Environment } from '@/db-common/enums'
import { auth } from '@/services/auth'
import { redirect } from 'next/navigation'

const NewPasswordPage = async () => {
  const session = await auth()
  if (session) {
    redirect('/')
  }

  return <NewPasswordForm environment={Environment.CUT} />
}

export default NewPasswordPage
