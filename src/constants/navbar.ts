import { Translations } from '@/lib'

interface MenuLink {
  href: string
  label: string
  testId?: string
  disabled?: boolean
  external?: boolean
  hide?: boolean
  info?: string
}

interface MenuSection {
  header?: string
  links: MenuLink[]
}

interface Menu {
  title: MenuLink
  sections: MenuSection[]
}

export const getStudyNavbarMenu = (t: Translations, studyId: string, studyName: string): Menu => ({
  title: {
    href: `/etudes/${studyId}`,
    label: studyName,
  },
  sections: [
    {
      links: [
        {
          href: `/etudes/${studyId}/cadrage`,
          label: t('framing'),
          testId: 'study-cadrage-link',
        },
        {
          href: `/etudes/${studyId}/comptabilisation/saisie-des-donnees`,
          label: t('dataEntry'),
        },
        {
          href: `/etudes/${studyId}/comptabilisation/resultats`,
          label: t('results'),
        },
      ],
    },
  ],
})
