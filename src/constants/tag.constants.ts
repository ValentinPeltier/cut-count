import { Environment, SubPost } from '@/db-common/enums'

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
type DefaultStudyTags = {
  [key in Environment]?: { name: string; tags: StudyTags }[]
}

export enum StudyTagColors {
  DEFAULT = '#ffffff',
  GREEN = '#94EBBF',
  RED = '#e04949',
  ORANGE = '#fc8514',
  BLUE = '#606af5',
}

export const DefaultStudyTags: DefaultStudyTags = {}
type DefaultStudyTagMap = {
  [key in Environment]?: {
    [key in DefaultStudyTagNames]?: SubPost[]
  }
}

export const DefaultStudyTagMap: DefaultStudyTagMap = {}
