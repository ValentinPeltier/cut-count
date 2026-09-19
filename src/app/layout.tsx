import { ZodConfigClientProvider } from '@/components/providers/zod.provider'
import RouteChangeListener from '@/components/RouteChangeListener'
import '@/css/index.css'

import { Providers, configureZod } from '@/lib'
import { Locale, LocaleType } from '@/lib/i18n/config'
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
  const t = await getTranslations()
  const locale = Locale.FR
  setRequestLocale(locale)
  configureZod(locale as LocaleType, t)
  const messages = await getMessages()

  return (
    <html lang={locale} className={'CUT'}>
      <head>
        <link rel="preconnect" href="https://fonts.cdnfonts.com" crossOrigin="" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <RouteChangeListener />
          <Providers>
            <ZodConfigClientProvider>{children}</ZodConfigClientProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default RootLayout
