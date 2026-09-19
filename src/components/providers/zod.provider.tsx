'use client'

import { configureZod } from '@/lib'
import { LocaleType } from '@/lib/i18n/config'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect } from 'react'

export function ZodConfigClientProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale()
  const t = useTranslations('validation')

  useEffect(() => {
    configureZod(locale as LocaleType, t)
  }, [locale, t])

  return <>{children}</>
}
