'use client'

import LoginFormCommon from '@/lib/components/auth/LoginFormCommon'
import { getEnvRoute } from '@/lib/services/email/utils'
import { customRich } from '@/lib/utils/customRich'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

const LoginForm = () => {
  'use memo'

  const support = process.env.NEXT_PUBLIC_CUT_SUPPORT_EMAIL
  const t = useTranslations('login.form')

  const getResetLink = (email: string) => getEnvRoute(`reset-password?email=${email}`)
  const getActivationLink = (email: string) => getEnvRoute(`register?email=${email}`)

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
