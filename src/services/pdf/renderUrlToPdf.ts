import 'server-only'

import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'

export type RenderUrlToPdfOptions = {
  format?: 'A4'
  printBackground?: boolean
  margin?: {
    top: string
    bottom: string
    left: string
    right: string
  }
}

type PdfCookie = {
  name: string
  value: string
}

const DEFAULT_MARGIN = {
  top: '2cm',
  bottom: '2cm',
  left: '1.5cm',
  right: '1.5cm',
}

const getExecutablePath = async () => {
  if (process.env.PDF_CHROME_PATH) {
    return process.env.PDF_CHROME_PATH
  }

  return chromium.executablePath()
}

export const renderUrlToPdf = async (
  url: string,
  options: RenderUrlToPdfOptions = {},
  requestCookies: PdfCookie[] = [],
): Promise<Buffer> => {
  chromium.setGraphicsMode = false

  const browser = await puppeteer.launch({
    args: await puppeteer.defaultArgs({
      args: chromium.args,
      headless: 'shell',
    }),
    defaultViewport: { width: 794, height: 1123 },
    executablePath: await getExecutablePath(),
    headless: 'shell',
  })

  try {
    const page = await browser.newPage()
    if (requestCookies.length > 0) {
      const origin = new URL(url).origin
      await page.setCookie(
        ...requestCookies.map((cookie) => ({
          name: cookie.name,
          value: cookie.value,
          url: origin,
        })),
      )
    }

    await page.emulateMediaType('print')
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 120_000 })
    await page.waitForSelector('[data-testid="pdf-container"]', { visible: true, timeout: 120_000 })
    await page.evaluate(() => document.fonts.ready)

    const pdfBuffer = await page.pdf({
      format: options.format ?? 'A4',
      printBackground: options.printBackground ?? true,
      preferCSSPageSize: true,
      margin: options.margin ?? DEFAULT_MARGIN,
    })

    return Buffer.from(pdfBuffer)
  } finally {
    await browser.close()
  }
}
