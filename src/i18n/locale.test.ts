import { Locale } from '@/lib/i18n/config'
import { expect } from '@jest/globals'

const mockGet = jest.fn()
const mockSet = jest.fn()

jest.mock('next/headers', () => ({
  cookies: jest.fn(async () => ({
    get: mockGet,
    set: mockSet,
  })),
}))

describe('locale cookie helpers', () => {
  beforeEach(() => {
    mockGet.mockReset()
    mockSet.mockReset()
  })

  it('returns the default locale when the cookie is missing', async () => {
    mockGet.mockReturnValue(undefined)
    const { getLocale } = await import('./locale')
    await expect(getLocale()).resolves.toBe(Locale.FR)
  })

  it('returns English when NEXT_LOCALE is en', async () => {
    mockGet.mockReturnValue({ value: 'en' })
    const { getLocale } = await import('./locale')
    await expect(getLocale()).resolves.toBe(Locale.EN)
  })

  it('falls back to French for unsupported locale cookies', async () => {
    mockGet.mockReturnValue({ value: 'es' })
    const { getLocale } = await import('./locale')
    await expect(getLocale()).resolves.toBe(Locale.FR)
  })

  it('persists a supported locale in the cookie', async () => {
    const { switchLocale } = await import('./locale')
    await switchLocale(Locale.EN)
    expect(mockSet).toHaveBeenCalledWith('NEXT_LOCALE', Locale.EN)
  })
})
