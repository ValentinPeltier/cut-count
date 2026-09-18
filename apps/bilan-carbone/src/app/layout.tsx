import { ZodConfigClientProvider } from '@/components/providers/zod.provider'
import RouteChangeListener from '@/components/RouteChangeListener'
import '@/css/index.css'
import { Environment } from '@abc-transitionbascarbone/db-common/enums'
import { Locale, LocaleType } from '@abc-transitionbascarbone/i18n/config'
import { Providers, configureZod } from '@abc-transitionbascarbone/lib'
import { CssBaseline } from '@mui/material'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { headers } from 'next/headers'

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

  const providerOptions = { key: 'mui', nonce: (await headers()).get('x-nonce') || undefined, prepend: true }
  return (
    <html lang={locale} className={Environment.CUT}>
      <body>
        <AppRouterCacheProvider options={providerOptions}>
          <NextIntlClientProvider messages={messages}>
            <RouteChangeListener />
            <Providers>
              <CssBaseline />
              <ZodConfigClientProvider>{children}</ZodConfigClientProvider>
            </Providers>
          </NextIntlClientProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}

export default RootLayout
