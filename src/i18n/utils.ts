'use server'

import { Locale, LocaleType } from '@/lib/i18n/config'

export const getMessages = async (locale: LocaleType = Locale.FR, _environment?: string) => {
  const messages = (await import(`./translations/${Locale.FR}.json`)).default

  return {
    locale: Locale.FR,
    messages,
  }
}
