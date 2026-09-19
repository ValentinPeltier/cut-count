import MuiAppProvidersClient from '@/lib/MuiAppProviders.client'
import { headers } from 'next/headers'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export const MuiAppProviders = ({ children }: Props) => {
  return <MuiAppProvidersClient>{children}</MuiAppProvidersClient>
}

export const MuiAppProvidersWithNonce = async ({ children }: Props) => {
  const nonce = (await headers()).get('x-nonce') || undefined
  return <MuiAppProvidersClient nonce={nonce}>{children}</MuiAppProvidersClient>
}
