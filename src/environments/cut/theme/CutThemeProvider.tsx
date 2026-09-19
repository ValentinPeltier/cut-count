'use client'

import cutTheme from '@/environments/cut/theme/theme'
import { ThemeProvider } from '@mui/material/styles'
import { ReactNode } from 'react'

const CutThemeProvider = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={cutTheme}>{children}</ThemeProvider>
)

export default CutThemeProvider
