import { getEnvironnementRessources } from '@/utils/ressources'
import { Environment } from '@abc-transitionbascarbone/db-common/enums'
import { Locale } from '@abc-transitionbascarbone/i18n/config'
import { Translations } from '@abc-transitionbascarbone/lib'
import { getEnvVar } from '@abc-transitionbascarbone/lib/environment'
import { getLocale } from 'next-intl/server'

jest.mock('next-intl/server', () => ({
  getLocale: jest.fn(),
}))

jest.mock('@abc-transitionbascarbone/lib/environment', () => ({
  getEnvVar: jest.fn(),
}))

const t = ((key: string) => key) as Translations

describe('getEnvironnementRessources', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('CUT environment exposes method download keys used on /ressources', async () => {
    jest.mocked(getLocale).mockResolvedValue(Locale.FR)
    jest.mocked(getEnvVar).mockImplementation(async (key) => {
      if (key === 'CONTACT_FORM_URL') {
        return 'https://contact.form'
      }
      if (key === 'FAQ_LINK') {
        return 'https://faq.fr'
      }
      if (key === 'SUPPORT_EMAIL') {
        return 'support@count.fr'
      }
      return ''
    })

    const resources = await getEnvironnementRessources(Environment.CUT, t)
    const methodsSection = resources.find((section) => section.title === 'countMethods')

    expect(methodsSection).toBeDefined()
    expect(methodsSection?.links).toEqual([
      { title: 'countMethodLink', downloadKey: 'SCW_CUT_METHOD_KEY' },
      { title: 'resilioMethodLink', downloadKey: 'SCW_RESILIO_METHOD_KEY' },
    ])
    expect(resources.some((section) => section.title === 'questionMethodo')).toBe(true)
    expect(resources.some((section) => section.title === 'enSavoirPlusBilan')).toBe(true)
  })
})
