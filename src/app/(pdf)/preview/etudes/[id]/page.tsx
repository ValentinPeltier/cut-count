import withPdfAuth, { PdfAuthProps } from '@/components/hoc/withPdfAuth'
import PDFSummaryContainer from './PDFSummaryContainer'

const PDFPreviewPage = async ({ study, locale }: PdfAuthProps) => {
  return <PDFSummaryContainer study={study} locale={locale} />
}

export default withPdfAuth(PDFPreviewPage)
