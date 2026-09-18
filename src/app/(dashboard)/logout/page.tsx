'use client'

import { Environment } from '@/db-common/enums'
import { signOutEnv } from '@/services/auth.utils'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const LogoutPage = () => {
  const searchParams = useSearchParams()

  useEffect(() => {
    signOutEnv((searchParams.get('env') as Environment) || undefined)
  }, [])

  return <div />
}

export default LogoutPage
