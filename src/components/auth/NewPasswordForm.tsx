'use client'

import { Environment } from '@/db-common/enums'
import NewPasswordFormCommon from '@/lib/components/auth/NewPasswordFormCommon'
import { useServerFunction } from '@/lib/components/hooks/useServerFunction'
import { getEnvRoute } from '@/lib/services/email/utils'
import { resetPassword } from '@/services/serverFunctions/user'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

interface Props {
  environment?: Environment
}

const NewPasswordForm = ({ environment = Environment.CUT }: Props) => {
  const t = useTranslations('login.form')
  const { callServerFunction } = useServerFunction()
  const router = useRouter()

  const loginLink = getEnvRoute('login', environment)

  const resetPasswordHandler = async (email: string) => {
    callServerFunction(() => resetPassword(email.toLowerCase(), environment), {
      getSuccessMessage: () => t('emailSent'),
      getErrorMessage: (error) => t(error),
      onSuccess: () => {
        router.push(loginLink)
      },
    })
  }
  return <NewPasswordFormCommon resetPassword={resetPasswordHandler} />
}

export default NewPasswordForm
