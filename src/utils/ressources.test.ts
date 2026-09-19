import { getRessources } from '@/utils/ressources'

import { Translations } from '@/lib'
import { Locale } from '@/lib/i18n/config'
import { getLocale } from 'next-intl/server'

jest.mock('next-intl/server', () => ({
  getLocale: jest.fn(),
}))

const t = ((key: string) => key) as Translations

describe('getRessources', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  test('CUT environment exposes method download keys used on /ressources', async () => {
    jest.mocked(getLocale).mockResolvedValue(Locale.FR)
    process.env.NEXT_PUBLIC_FAQ_LINK = 'https://faq.fr'
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL = 'support@count.fr'

    const resources = await getRessources(t)
    const methodsSection = resources.find((section) => section.title === 'countMethods')

    expect(methodsSection).toBeDefined()
    expect(methodsSection?.links).toEqual([
      { title: 'countMethodLink', downloadKey: 'count' },
      { title: 'resilioMethodLink', downloadKey: 'resilio' },
    ])
    expect(resources.some((section) => section.title === 'questionMethodo')).toBe(true)
    expect(resources.some((section) => section.title === 'enSavoirPlusBilan')).toBe(true)
  })
})
