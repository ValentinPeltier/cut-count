import { ZodConfigClientProvider } from '@/components/providers/zod.provider'
import RouteChangeListener from '@/components/RouteChangeListener'
import '@/css/index.css'
import CutThemeProvider from '@/environments/cut/theme/CutThemeProvider'

import { getLocale } from '@/i18n/locale'
import { Providers, configureZod } from '@/lib'
import { MuiAppProvidersWithNonce } from '@/lib/MuiAppProviders'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Count',
  description: "Count, le calculateur d'impact écologique dédié aux salles de cinéma",
}

interface Props {
  children: React.ReactNode
}

const RootLayout = async ({ children }: Readonly<Props>) => {
  const locale = await getLocale()
  setRequestLocale(locale)
  const t = await getTranslations()
  configureZod(locale, t)
  const messages = await getMessages()

  return (
    <html lang={locale} className={'CUT'}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <RouteChangeListener />
          <Providers>
            <MuiAppProvidersWithNonce>
              <CutThemeProvider>
                <ZodConfigClientProvider>{children}</ZodConfigClientProvider>
              </CutThemeProvider>
            </MuiAppProvidersWithNonce>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default RootLayout
