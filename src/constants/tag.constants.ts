import { SubPost } from '@/generated/prisma/enums'

export const OTHER_TAG_ID = 'other'

export enum DefaultStudyTagNames {
  PERIMETRE_INTERNE = 'Périmètre Interne',
  PERIMETRE_BENEVOLES = 'Périmètre Bénévoles',
  PERIMETRE_BENEFICIAIRES = 'Périmètre Bénéficiaires',
  NUMERIQUE = 'Numérique',
}

type StudyTags = {
  name: string
  color: string
}[]

export enum StudyTagColors {
  DEFAULT = '#ffffff',
  GREEN = '#94EBBF',
  RED = '#e04949',
  ORANGE = '#fc8514',
  BLUE = '#606af5',
}

export const DefaultStudyTags: { name: string; tags: StudyTags }[] = []

export const DefaultStudyTagMap: {
  [key in DefaultStudyTagNames]?: SubPost[]
} = {}
