import { Level } from '@/db-common/enums'

export const hasAccessToEmissionFactors = (_userLevel?: Level | null) => false

export const hasAccessToStudies = (_userLevel?: Level | null) => true

export const hasAccessToSettings = (_userLevel?: Level | null) => false

export const hasAccessToMethodology = (_userLevel?: Level | null) => false

export const hasAccessToCarbonResponsibilityIntensitiesAdvanced = (_simplified?: boolean | null) => false

export const hasAccessToEngagementActions = (_simplified?: boolean | null) => false

export const hasAccessToPerimeterPage = (_simplified?: boolean | null) => false

export const hasAccessToDuplicateStudy = (_simplified?: boolean | null) => false
