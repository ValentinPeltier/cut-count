import { Environment } from '@abc-transitionbascarbone/db-common/enums'
import { Locale } from '@abc-transitionbascarbone/i18n/config'
import { isAdvanced, isSimplified } from '@abc-transitionbascarbone/utils/environments'

const { BC, CUT } = Environment

export const isBC = (environment: Environment) => environment === BC
export const isCut = (environment: Environment) => environment === CUT

export const getLocalesForEnv = (environment: Environment) => {
  switch (environment) {
    case Environment.CUT:
      return [Locale.FR]
    default:
      return [Locale.EN, Locale.FR]
  }
}

export const hasAccessToActualityCards = isBC

export const hasAccessToDownloadStudyEmissionSourcesButton = isAdvanced

export const hasAccessToCreateOrganization = isAdvanced

export const hasAccessToCreateStudyTag = isAdvanced

export const hasAccessToStudyFlowExample = isAdvanced

export const hasWasteImpact = isAdvanced

export const hasAccessToBcExport = (_environment: Environment) => false

export const hasAccessToDependencyMatrix = (_environment: Environment) => false

export const hasAccessToDependencyMatrixExample = (_environment: Environment) => false

export const needsLicenceToUseApp = isBC

export const hasAccessToEmissionSourceValidation = (environment: Environment, isSimplifiedStudy: boolean = false) => {
  return isAdvanced(environment) && !isSimplifiedStudy
}

export const hasRoleOnStudy = isAdvanced

export const hasAccessToCarbonResponsibilityIntensities = isAdvanced

export const hasAccessToMonetaryRatio = (_environment: Environment) => true

export const hasAccessToCreateStudyWithEmissionFactorVersions = isSimplified

export const showResultsInfoText = isCut

export const displayingStudyRightModalForAddingContributors = (_environment: Environment) => true

export const hasHomeAlert = isSimplified

export const hasAccessToAllLocales = (_environment: Environment) => false

export const hasAccessToSimplifiedEmissionAnalysis = (_environment: Environment) => false

export const canCreateStudyWithoutSpecificRights = isCut

export const canCreateStudyOnlyAsAdministrator = (_environment: Environment) => false

export const hasAccessToStudySiteAddAndSelection = (_environment: Environment) => true

export const hasAccessToStudyHomePage = isAdvanced

export const hasAccessToSimplifiedStudies = isSimplified

export const hasReaderRoleOnStudyAsContributor = (_environment: Environment) => false

export const hasAccessToStudyComments = (_environment: Environment) => false

export const hasAccessToManualImport = (_environment: Environment) => true

export const hasCustomGlossaryTextForEstablishment = (_environment: Environment) => false

export const hasAccessToStudyResults = isAdvanced

export const hasCustomPostOrder = (_environment: Environment) => false

export const hasAccessToResultsRatioTab = isCut

export const hasAccessToAdvancedEmissionAnalysis = (_environment: Environment) => false

export const hasAlwaysAccessToOrganizationVersion = (_environment: Environment) => false

export const hasStartLinkOnFootprints = (_environment: Environment) => false

export const hasAccessToPostTypeform = (_environment: Environment) => false

export const hasAccessToReductionObjectivesGlossary = (_environment: Environment) => false

export const hasAccessToHomeSubtitle = (_environment: Environment) => false

export const hasAccessToNamingInAddContributor = (_environment: Environment) => false

export const hasHomeButtonHeader = (_environment: Environment) => false

export const hasAccessToPDFExport = isCut

export const hasAccessToFeedbackButton = (_environment: Environment) => false

export const hasBCExportWithSimplifiedStudy = isCut

const environmentWithSimplifiedStudies = [CUT] as const
export type EnvironmentWithSimplifiedStudies = (typeof environmentWithSimplifiedStudies)[number]

export const hasSimplifiedStudies = (env: Environment): env is EnvironmentWithSimplifiedStudies => {
  return environmentWithSimplifiedStudies.includes(env as EnvironmentWithSimplifiedStudies)
}

export const isRedirectedToCadrage = isCut
