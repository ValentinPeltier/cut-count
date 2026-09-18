import { Locale } from '@/lib/i18n/config'

export const isCut = () => true

export const getLocalesForEnv = () => [Locale.FR]

export const hasAccessToActualityCards = () => false
export const hasAccessToDownloadStudyEmissionSourcesButton = () => false
export const hasAccessToCreateOrganization = () => false
export const hasAccessToCreateStudyTag = () => false
export const hasAccessToStudyFlowExample = () => false
export const hasWasteImpact = () => false
export const hasAccessToBcExport = () => false
export const hasAccessToDependencyMatrix = () => false
export const hasAccessToDependencyMatrixExample = () => false
export const needsLicenceToUseApp = () => false
export const hasAccessToEmissionSourceValidation = (_isCutStudy: boolean = false) => false
export const hasRoleOnStudy = () => true
export const hasAccessToCarbonResponsibilityIntensities = () => false
export const hasAccessToMonetaryRatio = () => true
export const hasAccessToCreateStudyWithEmissionFactorVersions = () => true
export const showResultsInfoText = () => true
export const displayingStudyRightModalForAddingContributors = () => true
export const hasHomeAlert = () => true
export const hasAccessToAllLocales = () => false
export const hasAccessToSimplifiedEmissionAnalysis = () => false
export const canCreateStudyWithoutSpecificRights = () => true
export const canCreateStudyOnlyAsAdministrator = () => false
export const hasAccessToStudySiteAddAndSelection = () => true
export const hasAccessToStudyHomePage = () => false
export const hasAccessToSimplifiedStudies = () => true
export const hasReaderRoleOnStudyAsContributor = () => false
export const hasAccessToStudyComments = () => false
export const hasAccessToManualImport = () => true
export const hasCustomGlossaryTextForEstablishment = () => false
export const hasAccessToStudyResults = () => false
export const hasCustomPostOrder = () => false
export const hasAccessToResultsRatioTab = () => true
export const hasAccessToAdvancedEmissionAnalysis = () => false
export const hasAlwaysAccessToOrganizationVersion = () => false
export const hasStartLinkOnFootprints = () => false
export const hasAccessToPostTypeform = () => false
export const hasAccessToReductionObjectivesGlossary = () => false
export const hasAccessToHomeSubtitle = () => false
export const hasAccessToNamingInAddContributor = () => false
export const hasHomeButtonHeader = () => false
export const hasAccessToPDFExport = () => true
export const hasAccessToFeedbackButton = () => false
export const hasBCExportWithSimplifiedStudy = () => true
export const isRedirectedToCadrage = () => true

export const hasSimplifiedStudies = () => true
