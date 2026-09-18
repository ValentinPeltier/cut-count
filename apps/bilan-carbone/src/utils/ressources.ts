import { Environment } from '@abc-transitionbascarbone/db-common/enums'
import { Locale } from '@abc-transitionbascarbone/i18n/config'
import { Translations } from '@abc-transitionbascarbone/lib'
import { getEnvVar } from '@abc-transitionbascarbone/lib/environment'
import { getLocale } from 'next-intl/server'

export const getEnvironnementRessources = async (env: Environment, t: Translations) => {
  const locale = await getLocale()

  const contactForm = await getEnvVar('CONTACT_FORM_URL', env)

  const faq = await getEnvVar('FAQ_LINK', env)

  const supportEmail = await getEnvVar('SUPPORT_EMAIL', env)

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
          link: contactForm,
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

  switch (env) {
    case Environment.CUT:
      return [
        {
          title: t('countMethods'),
          links: [
            {
              title: t('countMethodLink'),
              downloadKey: 'SCW_CUT_METHOD_KEY',
            },
            {
              title: t('resilioMethodLink'),
              downloadKey: 'SCW_RESILIO_METHOD_KEY',
            },
          ],
        },
        ...commonRessources,
        methodBC,
      ]
    default:
      return [methodBC, ...commonRessources]
  }
}
