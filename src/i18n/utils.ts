'use server'

import { Locale, LocaleType } from '@/lib/i18n/config'

export const getMessages = async (locale: LocaleType = Locale.FR, _environment?: string) => {
  void _environment
  const messages = (await import(`./translations/${locale}.json`)).default

  return {
    locale,
    messages,
  }
}
