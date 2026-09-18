'use server'

import { Locale, LocaleType } from '@/lib/i18n/config'
import { mergeObjects } from '@/lib/utils/object'

export const getMessages = async (locale: LocaleType = Locale.FR, _environment?: string) => {
  const commonMessages = (await import(`../lib/i18n/translations/${Locale.FR}/common.json`)).default
  const cutMessages = (await import(`./translations/${Locale.FR}/cut.json`)).default

  let publicodesRules = {}
  try {
    publicodesRules = (await import(`../lib/i18n/translations/${Locale.FR}/publicodes/cut-rules.json`)).default
  } catch {
    console.log('No publicodes rules translation file for Count')
  }

  let publicodesLayout = {}
  try {
    publicodesLayout = (await import(`../lib/i18n/translations/${Locale.FR}/publicodes/cut-layout.json`)).default
  } catch {
    console.log('No publicodes layout translation file for Count')
  }

  return {
    locale: Locale.FR,
    messages: mergeObjects({}, commonMessages, cutMessages, publicodesRules, publicodesLayout),
  }
}
