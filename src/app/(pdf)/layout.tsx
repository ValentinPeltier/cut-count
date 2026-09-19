import CutThemeProvider from '@/environments/cut/theme/CutThemeProvider'
import { MuiAppProvidersWithNonce } from '@/lib/MuiAppProviders'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const PdfLayout = async ({ children }: Props) => {
  return (
    <MuiAppProvidersWithNonce>
      <CutThemeProvider>{children}</CutThemeProvider>
    </MuiAppProvidersWithNonce>
  )
}

export default PdfLayout
