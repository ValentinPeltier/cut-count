'use client'

import theme from '@/environments/base/theme/theme'
import DynamicComponent from '@/environments/core/utils/DynamicComponent'
import cutTheme from '@/environments/cut/theme/theme'
import { Environment } from '@abc-transitionbascarbone/db-common/enums'
import { ThemeProvider } from '@mui/material'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  environment: Environment
}

const DynamicTheme = ({ children, environment }: Props) => {
  return (
    <DynamicComponent
      defaultComponent={<ThemeProvider theme={theme}>{children}</ThemeProvider>}
      environmentComponents={{
        [Environment.CUT]: <ThemeProvider theme={cutTheme}>{children}</ThemeProvider>,
      }}
      forceEnvironment={environment}
    />
  )
}

export default DynamicTheme
