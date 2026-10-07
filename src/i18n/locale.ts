'use server'

import { defaultLocale, isLocale, LocaleType } from '@/lib/i18n/config'
import { cookies as getCookies } from 'next/headers'
import { LOCALE_COOKIE } from './localeCookie'

export const getLocale = async (): Promise<LocaleType> => {
  const cookies = await getCookies()
  const value = cookies.get(LOCALE_COOKIE)?.value
  return value && isLocale(value) ? value : defaultLocale
}

export const switchLocale = async (value: LocaleType) => {
  if (!isLocale(value)) {
    return
  }
  const cookies = await getCookies()
  cookies.set(LOCALE_COOKIE, value)
}
