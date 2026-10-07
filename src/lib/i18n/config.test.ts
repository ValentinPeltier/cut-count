import { expect } from '@jest/globals'
import { Locale, availableLocales, defaultLocale, isLocale } from './config'

describe('i18n config', () => {
  it('supports French and English', () => {
    expect(availableLocales).toEqual([Locale.FR, Locale.EN])
    expect(defaultLocale).toBe(Locale.FR)
  })

  it('validates locale codes', () => {
    expect(isLocale('fr')).toBe(true)
    expect(isLocale('en')).toBe(true)
    expect(isLocale('es')).toBe(false)
    expect(isLocale('fr-FR')).toBe(false)
  })
})
