'use client'

import { CssBaseline } from '@mui/material'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  nonce?: string
}

const MuiAppProviders = ({ children, nonce }: Props) => {
  return (
    <AppRouterCacheProvider options={{ key: 'mui', nonce, prepend: true }}>
      <CssBaseline />
      {children}
    </AppRouterCacheProvider>
  )
}

export default MuiAppProviders
