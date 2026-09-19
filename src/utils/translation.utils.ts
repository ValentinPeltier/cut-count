import frMessages from '@/i18n/translations/fr.json'
import { LocaleType } from '@/lib/i18n/config'

const COMMON_MESSAGE_KEYS = [
  'common',
  'saveStatus',
  'signup',
  'navigation',
  'country',
  'study',
  'locale',
  'login',
  'spinner',
  'error',
  'email',
  'nav',
  'team',
  'level',
  'role',
  'newMember',
] as const satisfies readonly (keyof typeof frMessages)[]

export type CommonTranslations = Pick<typeof frMessages, (typeof COMMON_MESSAGE_KEYS)[number]>

export function getCommonTranslations(_locale?: LocaleType): CommonTranslations {
  const {
    common,
    saveStatus,
    signup,
    navigation,
    country,
    study,
    locale,
    login,
    spinner,
    error,
    email,
    nav,
    team,
    level,
    role,
    newMember,
  } = frMessages

  return {
    common,
    saveStatus,
    signup,
    navigation,
    country,
    study,
    locale,
    login,
    spinner,
    error,
    email,
    nav,
    team,
    level,
    role,
    newMember,
  }
}

/**
 * Extracts the ="one" singular form from an ICU plural string, e.g. "{count, plural, =0 {None} one {Litre} other {Litres}}" → "Litre"
 */
export function getSingularForm(value: string): string {
  const match = value.match(/\bone\s*\{([^}]+)\}/)
  return match ? match[1].trim() : value.trim()
}

/**
 * Extracts the forms from an ICU plural string
 * e.g. "{count, plural, =0 {Litre} one {Litre} other {Litres}}" → ["Litre", "Litres"]
 */
export function extractAllForms(value: string): string[] {
  const hasPlural = /\{[^{}]*,\s*plural/.test(value)
  if (hasPlural) {
    const forms = [...value.matchAll(/(?:=\d+|one|other)\s*\{([^}]+)\}/g)].map((m) => m[1].trim())
    return forms.length ? [...new Set(forms)] : [value.trim()]
  }
  return [value.trim()]
}

export type BcTranslations = typeof frMessages

export function getBcTranslations(_locale?: LocaleType): BcTranslations {
  return frMessages
}
