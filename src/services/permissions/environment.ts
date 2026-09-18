import { Environment } from '@/db-common/enums'
import { Locale } from '@/lib/i18n/config'

export const isCut = (_environment?: Environment) => true

export const getLocalesForEnv = (_environment?: Environment) => [Locale.FR]

export const hasAccessToActualityCards = (_environment?: Environment) => false
export const hasAccessToDownloadStudyEmissionSourcesButton = (_environment?: Environment) => false
export const hasAccessToCreateOrganization = (_environment?: Environment) => false
export const hasAccessToCreateStudyTag = (_environment?: Environment) => false
export const hasAccessToStudyFlowExample = (_environment?: Environment) => false
export const hasWasteImpact = (_environment?: Environment) => false
export const hasAccessToBcExport = (_environment?: Environment) => false
export const hasAccessToDependencyMatrix = (_environment?: Environment) => false
export const hasAccessToDependencyMatrixExample = (_environment?: Environment) => false
export const needsLicenceToUseApp = (_environment?: Environment) => false
export const hasAccessToEmissionSourceValidation = (_environment?: Environment, _isCutStudy: boolean = false) => false
export const hasRoleOnStudy = (_environment?: Environment) => true
export const hasAccessToCarbonResponsibilityIntensities = (_environment?: Environment) => false
export const hasAccessToMonetaryRatio = (_environment?: Environment) => true
export const hasAccessToCreateStudyWithEmissionFactorVersions = (_environment?: Environment) => true
export const showResultsInfoText = (_environment?: Environment) => true
export const displayingStudyRightModalForAddingContributors = (_environment?: Environment) => true
export const hasHomeAlert = (_environment?: Environment) => true
export const hasAccessToAllLocales = (_environment?: Environment) => false
export const hasAccessToSimplifiedEmissionAnalysis = (_environment?: Environment) => false
export const canCreateStudyWithoutSpecificRights = (_environment?: Environment) => true
export const canCreateStudyOnlyAsAdministrator = (_environment?: Environment) => false
export const hasAccessToStudySiteAddAndSelection = (_environment?: Environment) => true
export const hasAccessToStudyHomePage = (_environment?: Environment) => false
export const hasAccessToSimplifiedStudies = (_environment?: Environment) => true
export const hasReaderRoleOnStudyAsContributor = (_environment?: Environment) => false
export const hasAccessToStudyComments = (_environment?: Environment) => false
export const hasAccessToManualImport = (_environment?: Environment) => true
export const hasCustomGlossaryTextForEstablishment = (_environment?: Environment) => false
export const hasAccessToStudyResults = (_environment?: Environment) => false
export const hasCustomPostOrder = (_environment?: Environment) => false
export const hasAccessToResultsRatioTab = (_environment?: Environment) => true
export const hasAccessToAdvancedEmissionAnalysis = (_environment?: Environment) => false
export const hasAlwaysAccessToOrganizationVersion = (_environment?: Environment) => false
export const hasStartLinkOnFootprints = (_environment?: Environment) => false
export const hasAccessToPostTypeform = (_environment?: Environment) => false
export const hasAccessToReductionObjectivesGlossary = (_environment?: Environment) => false
export const hasAccessToHomeSubtitle = (_environment?: Environment) => false
export const hasAccessToNamingInAddContributor = (_environment?: Environment) => false
export const hasHomeButtonHeader = (_environment?: Environment) => false
export const hasAccessToPDFExport = (_environment?: Environment) => true
export const hasAccessToFeedbackButton = (_environment?: Environment) => false
export const hasBCExportWithSimplifiedStudy = (_environment?: Environment) => true
export const isRedirectedToCadrage = (_environment?: Environment) => true

export type EnvironmentWithSimplifiedStudies = Environment

export const hasSimplifiedStudies = (_env?: Environment): _env is EnvironmentWithSimplifiedStudies => true
