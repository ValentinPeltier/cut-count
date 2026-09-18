import withPdfAuth, { PdfAuthProps } from '@/components/hoc/withPdfAuth'
import cutTheme from '@/environments/cut/theme/theme'
import { ThemeProvider } from '@mui/material/styles'
import PDFSummaryContainer from './PDFSummaryContainer'

const PDFPreviewPage = async ({ study, locale }: PdfAuthProps) => {
  return (
    <ThemeProvider theme={cutTheme}>
      <PDFSummaryContainer study={study} locale={locale} />
    </ThemeProvider>
  )
}

export default withPdfAuth(PDFPreviewPage)
