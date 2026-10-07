import { Locale } from '@/lib/i18n/config'
import { expect } from '@jest/globals'
import { resolveLocaleCookie } from './localeCookie'

describe('resolveLocaleCookie', () => {
  it('defaults to French when the cookie is missing', () => {
    expect(resolveLocaleCookie(undefined)).toBe(Locale.FR)
  })

  it('keeps a supported English cookie untouched', () => {
    expect(resolveLocaleCookie('en')).toBeNull()
  })

  it('resets an unsupported locale to French', () => {
    expect(resolveLocaleCookie('es')).toBe(Locale.FR)
  })
})
