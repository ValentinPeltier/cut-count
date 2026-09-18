'use client'

import { Environment } from '@/db-common/enums'
import LoginFormCommon from '@/lib/components/auth/LoginFormCommon'
import { getEnvRoute } from '@/lib/services/email/utils'
import { customRich } from '@/lib/utils/customRich'
import { getEnvVarClient } from '@/lib/utils/environmentClient'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface Props {
  environment?: Environment
}

const LoginForm = ({ environment = Environment.CUT }: Props) => {
  'use memo'

  const support = getEnvVarClient('SUPPORT_EMAIL', environment)
  const t = useTranslations('login.form')

  const getResetLink = (email: string) => getEnvRoute(`reset-password?email=${email}`, environment)
  const getActivationLink = (email: string) => getEnvRoute(`register?email=${email}`, environment)

  return (
    <LoginFormCommon
      errorMessageCustom={(error) =>
        customRich(t, error, {
          link: (children) => <Link href={`mailto:${support}`}>{children}</Link>,
        })
      }
      getResetLink={getResetLink}
      getActivationLink={getActivationLink}
      t={t}
    />
  )
}

export default LoginForm
