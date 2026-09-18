'use server'
import { Environment } from '@abc-transitionbascarbone/db-common/enums'
import { Locale, LocaleType } from '@abc-transitionbascarbone/i18n/config'
import { mergeObjects } from '@abc-transitionbascarbone/utils/object'

export const getMessages = async (locale: LocaleType = Locale.FR, _environment?: Environment) => {
  const commonMessages = (await import(`../../../../packages/i18n/translations/${Locale.FR}/common.json`)).default
  const cutMessages = (await import(`./translations/${Locale.FR}/cut.json`)).default

  let publicodesRules = {}
  try {
    publicodesRules = (await import(`../../../../packages/i18n/translations/${Locale.FR}/publicodes/cut-rules.json`))
      .default
  } catch {
    console.log('No publicodes rules translation file for Count')
  }

  let publicodesLayout = {}
  try {
    publicodesLayout = (await import(`../../../../packages/i18n/translations/${Locale.FR}/publicodes/cut-layout.json`))
      .default
  } catch {
    console.log('No publicodes layout translation file for Count')
  }

  return {
    locale: Locale.FR,
    messages: mergeObjects({}, commonMessages, cutMessages, publicodesRules, publicodesLayout),
  }
}
