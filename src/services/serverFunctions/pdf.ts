'use server'

import { NOT_AUTHORIZED } from '@/lib/services/permissions/check'
import { renderUrlToPdf } from '@/services/pdf/renderUrlToPdf'
import { dbActualizedAuth } from '@/services/auth'
import { withServerResponse } from '@/utils/serverResponse'
import { cookies, headers } from 'next/headers'

const getPdfRenderBaseUrl = async () => {
  if (process.env.PDF_RENDER_BASE_URL) {
    return process.env.PDF_RENDER_BASE_URL.replace(/\/$/, '')
  }

  const headersList = await headers()
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host')
  if (host) {
    const proto =
      headersList.get('x-forwarded-proto') ?? (process.env.NODE_ENV === 'production' ? 'https' : 'http')
    return `${proto}://${host}`
  }

  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL.replace(/\/$/, '')
  }

  const port = process.env.PORT ?? '3000'
  return `http://127.0.0.1:${port}`
}

export const generateStudySummaryPDF = async (studyId: string, studyName: string, referenceYear: number) =>
  withServerResponse('generateStudySummaryPDF', async () => {
    const session = await dbActualizedAuth()
    if (!session?.user) {
      throw new Error(NOT_AUTHORIZED)
    }

    try {
      const baseUrl = await getPdfRenderBaseUrl()
      const pdfUrl = `${baseUrl}/preview/etudes/${studyId}`
      const cookieStore = await cookies()

      const pdfBuffer = await renderUrlToPdf(
        pdfUrl,
        {
          format: 'A4',
          printBackground: true,
          margin: {
            top: '2cm',
            bottom: '2cm',
            left: '1.5cm',
            right: '1.5cm',
          },
        },
        cookieStore.getAll().map((cookie) => ({ name: cookie.name, value: cookie.value })),
      )

      const filename = `${studyName}_empreinte_carbone_${referenceYear}.pdf`

      return {
        pdfBuffer: Array.from(new Uint8Array(pdfBuffer)),
        filename,
        contentType: 'application/pdf',
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('PDF generation failed:', errorMessage)
      throw new Error(`PDF generation failed: ${errorMessage}`)
    }
  })
