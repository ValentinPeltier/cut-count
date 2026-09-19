'use client'

import ResetFormCommon from '@/lib/components/auth/ResetFormCommon'
import { useServerFunction } from '@/lib/components/hooks/useServerFunction'
import ResetLinkAlreadyUsed from '@/lib/components/pages/ResetLinkAlreadyUsed'
import { signOutEnv } from '@/lib/services/auth/auth.utils'
import { getEnvRoute } from '@/lib/services/email/utils'
import { checkToken, reset } from '@/services/serverFunctions/auth'
import { UserSession } from 'next-auth'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Props {
  user?: UserSession
  token: string
}

const ResetForm = ({ user, token }: Props) => {
  useEffect(() => {
    checkToken(token).then((invalidtoken) => {
      // eslint-disable-next-line react-hooks/immutability
      setInvalidResetLink(invalidtoken)
    })
  }, [token])

  useEffect(() => {
    if (user) {
      signOutEnv({ redirect: false })
    }
  }, [user])

  const router = useRouter()
  const t = useTranslations('login.form')
  const [invalidResetLink, setInvalidResetLink] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { callServerFunction } = useServerFunction()

  if (invalidResetLink) {
    return <ResetLinkAlreadyUsed />
  }

  const loginLink = getEnvRoute('login')

  const resetPassword = async (password: string, token: string) => {
    await callServerFunction(() => reset(password, token), {
      getSuccessMessage: () => t('validated'),
      getErrorMessage: () => t('resetError'),
      onSuccess: () => {
        setSubmitting(false)
        router.push(loginLink)
      },
      onError: () => {
        setSubmitting(false)
      },
    })
  }

  return (
    <ResetFormCommon
      resetPassword={resetPassword}
      token={token}
      submitting={submitting}
      setSubmitting={setSubmitting}
    />
  )
}

export default ResetForm
