import MuiAppProvidersClient from '@/lib/MuiAppProviders.client'
import { headers } from 'next/headers'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

/** Single Emotion cache for the whole app — must live in the root layout so soft
 *  navigations between route groups keep the document CSP nonce on injected styles. */
export const MuiAppProvidersWithNonce = async ({ children }: Props) => {
  const nonce = (await headers()).get('x-nonce') || undefined
  return <MuiAppProvidersClient nonce={nonce}>{children}</MuiAppProvidersClient>
}
