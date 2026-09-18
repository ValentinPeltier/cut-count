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

const getFaqLinkFromResources = (resources: Awaited<ReturnType<typeof getEnvironnementRessources>>) => {
  const technicalSection = resources.find((resource) => resource.title === 'questionTechnique')
  const faqLink = technicalSection?.links.find(
    (resourceLink) => resourceLink.title === 'lireLaFAQ' && 'link' in resourceLink,
  )

  return faqLink && 'link' in faqLink ? faqLink.link : undefined
}

describe('getEnvironnementRessources', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('uses EN_FAQ_LINK when locale is EN and EN_FAQ_LINK is defined', async () => {
    jest.mocked(getLocale).mockResolvedValue(Locale.EN)
    jest.mocked(getEnvVar).mockImplementation(async (key) => {
      if (key === 'CONTACT_FORM_URL') {
        return 'https://contact.form'
      }
      if (key === 'EN_FAQ_LINK') {
        return 'https://en.faq'
      }
      if (key === 'FAQ_LINK') {
        return 'https://fr.faq'
      }
      if (key === 'SUPPORT_EMAIL') {
        return 'support@example.com'
      }
      return ''
    })

    const resources = await getEnvironnementRessources(Environment.BC, t)
    const faqLink = getFaqLinkFromResources(resources)

    expect(faqLink).toBe('https://en.faq')
  })

  test('falls back to FAQ_LINK when locale is EN and EN_FAQ_LINK is empty', async () => {
    jest.mocked(getLocale).mockResolvedValue(Locale.EN)
    jest.mocked(getEnvVar).mockImplementation(async (key) => {
      if (key === 'CONTACT_FORM_URL') {
        return 'https://contact.form'
      }
      if (key === 'EN_FAQ_LINK') {
        return ''
      }
      if (key === 'FAQ_LINK') {
        return 'https://fr.faq'
      }
      if (key === 'SUPPORT_EMAIL') {
        return 'support@example.com'
      }
      return ''
    })

    const resources = await getEnvironnementRessources(Environment.BC, t)
    const faqLink = getFaqLinkFromResources(resources)

    expect(faqLink).toBe('https://fr.faq')
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

  test('CLICKSON environment returns data collection sections only', async () => {
    jest.mocked(getLocale).mockResolvedValue(Locale.FR)
    jest.mocked(getEnvVar).mockResolvedValue('')

    const resources = await getEnvironnementRessources(Environment.CLICKSON, t)
    const titles = resources.map((section) => section.title)

    expect(titles).toEqual(['knowMoreDataCollect', 'toolsDataCollect', 'game'])
    expect(resources.every((section) => section.links.every((link) => 'link' in link && link.link))).toBe(true)
  })

  test('TILT environment includes method BC and common sections', async () => {
    jest.mocked(getLocale).mockResolvedValue(Locale.FR)
    jest.mocked(getEnvVar).mockImplementation(async (key) => {
      if (key === 'SUPPORT_EMAIL') {
        return 'support@tilt.fr'
      }
      if (key === 'CONTACT_FORM_URL') {
        return 'https://contact.tilt'
      }
      return ''
    })

    const resources = await getEnvironnementRessources(Environment.TILT, t)
    const titles = resources.map((section) => section.title)

    expect(titles[0]).toBe('methodeAssociative')
    expect(titles).toContain('enSavoirPlusBilan')
    expect(titles).toContain('questionMethodo')
    expect(titles).toContain('questionTechnique')
  })

  test('BC default environment uses French method URL when locale is FR', async () => {
    jest.mocked(getLocale).mockResolvedValue(Locale.FR)
    jest.mocked(getEnvVar).mockImplementation(async (key) => {
      if (key === 'SUPPORT_EMAIL') {
        return 'support@bc.fr'
      }
      if (key === 'CONTACT_FORM_URL') {
        return 'https://contact.bc'
      }
      return ''
    })

    const resources = await getEnvironnementRessources(Environment.BC, t)
    const methodSection = resources.find((section) => section.title === 'enSavoirPlusBilan')

    expect(methodSection?.links[0].link).toBe('https://www.bilancarbone-methode.com/')
  })
})
