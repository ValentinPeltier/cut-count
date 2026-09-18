import { Environment, Level } from '@abc-transitionbascarbone/db-common/enums'
import { hasAccessToCarbonResponsibilityIntensities } from './environment'

const { BC, CUT } = Environment

export const isTiltSimplified = (_environment: Environment, _simplified?: boolean | null) => false

export const isAdvancedAndNotTiltSimplified = (environment: Environment, _simplified?: boolean | null) =>
  environment === BC

export const hasAccessToEmissionFactors = (environment: Environment, _userLevel: Level | null) => environment === BC

export const hasAccessToStudies = (environment: Environment, _userLevel: Level | null) =>
  environment === BC || environment === CUT

export const hasAccessToSettings = (environment: Environment, _userLevel: Level | null) => environment === BC

export const hasAccessToMethodology = (environment: Environment, _userLevel: Level | null) => environment === BC

export const hasAccessToCarbonResponsibilityIntensitiesAdvanced = (
  environment: Environment,
  _simplified?: boolean | null,
) => hasAccessToCarbonResponsibilityIntensities(environment)

export const hasAccessToEngagementActions = isAdvancedAndNotTiltSimplified

export const hasAccessToPerimeterPage = isAdvancedAndNotTiltSimplified

export const hasAccessToDuplicateStudy = isAdvancedAndNotTiltSimplified
