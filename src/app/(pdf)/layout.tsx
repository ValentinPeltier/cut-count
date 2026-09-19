import CutThemeProvider from '@/environments/cut/theme/CutThemeProvider'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const PdfLayout = ({ children }: Props) => {
  return <CutThemeProvider>{children}</CutThemeProvider>
}

export default PdfLayout
