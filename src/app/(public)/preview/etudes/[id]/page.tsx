import withPdfAuth, { PdfAuthProps } from '@/components/hoc/withPdfAuth'
import CutThemeProvider from '@/environments/cut/theme/CutThemeProvider'
import PDFSummaryContainer from './PDFSummaryContainer'

const PDFPreviewPage = async ({ study, locale }: PdfAuthProps) => {
  return (
    <CutThemeProvider>
      <PDFSummaryContainer study={study} locale={locale} />
    </CutThemeProvider>
  )
}

export default withPdfAuth(PDFPreviewPage)
