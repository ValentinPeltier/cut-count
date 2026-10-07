import { defaultLocale, isLocale, LocaleType } from '@/lib/i18n/config'

export const LOCALE_COOKIE = 'NEXT_LOCALE'

export const resolveLocaleCookie = (current?: string): LocaleType | null => {
  if (current && isLocale(current)) {
    return null
  }
  return defaultLocale
}
