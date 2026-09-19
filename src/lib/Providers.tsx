'use client'

import { ToastProvider } from '@/lib/ui'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const Providers = ({ children }: Props) => {
  return <ToastProvider>{children}</ToastProvider>
}

export default Providers
