import { Translations } from '@/lib'
import { Locale } from '@/lib/i18n/config'
import { getLocale } from 'next-intl/server'

export const getRessources = async (t: Translations) => {
  const locale = await getLocale()

  const faq = process.env.NEXT_PUBLIC_FAQ_LINK ?? ''
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? ''

  const methodUrl =
    locale === Locale.FR
      ? 'https://www.bilancarbone-methode.com/'
      : 'https://www.bilancarbone-methode.com/methode-bilan-carbone-r-en'

  const commonRessources = [
    {
      title: t('questionMethodo'),
      links: [
        { title: t('openCarbonPractice'), link: 'https://www.opencarbonpractice.com/rejoindre-la-communaute' },
        {
          title: t('contacterViaFormulaire', { supportEmail }),
          link: `mailto:${supportEmail}`,
          isTranslated: true,
        },
      ],
    },
    {
      title: t('questionTechnique'),
      links: [
        ...(faq ? [{ title: t('lireLaFAQ'), link: faq }] : []),
        {
          title: t('ecrireMail', { supportEmail }),
          link: `mailto:${supportEmail}`,
          isTranslated: true,
        },
      ],
    },
  ]

  const methodBC = {
    title: t('enSavoirPlusBilan'),
    links: [{ title: t('methodeBilanCarbone'), link: methodUrl }],
  }

  return [
    {
      title: t('countMethods'),
      links: [
        {
          title: t('countMethodLink'),
          downloadKey: 'count',
        },
        {
          title: t('resilioMethodLink'),
          downloadKey: 'resilio',
        },
      ],
    },
    ...commonRessources,
    methodBC,
  ]
}
