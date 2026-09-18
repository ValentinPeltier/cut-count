import { Environment, Level } from '@/db-common/enums'

export const hasAccessToEmissionFactors = (_environment?: Environment, _userLevel?: Level | null) => false

export const hasAccessToStudies = (_environment?: Environment, _userLevel?: Level | null) => true

export const hasAccessToSettings = (_environment?: Environment, _userLevel?: Level | null) => false

export const hasAccessToMethodology = (_environment?: Environment, _userLevel?: Level | null) => false

export const hasAccessToCarbonResponsibilityIntensitiesAdvanced = (
  _environment?: Environment,
  _simplified?: boolean | null,
) => false

export const hasAccessToEngagementActions = (_environment?: Environment, _simplified?: boolean | null) => false

export const hasAccessToPerimeterPage = (_environment?: Environment, _simplified?: boolean | null) => false

export const hasAccessToDuplicateStudy = (_environment?: Environment, _simplified?: boolean | null) => false
