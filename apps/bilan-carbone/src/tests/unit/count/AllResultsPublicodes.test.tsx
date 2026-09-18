import { Environment, StudyResultUnit } from '@abc-transitionbascarbone/db-common/enums'
import { ThemeProvider } from '@mui/material/styles'
import { render, screen } from '@testing-library/react'
import theme from '@/environments/cut/theme/theme'
import type { FullStudy } from '@/db/study'

const mockUsePublicodesResults = jest.fn()

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('@/hooks/usePublicodesResults', () => ({
  usePublicodesResults: (...args: unknown[]) => mockUsePublicodesResults(...args),
}))

jest.mock('@/components/study/site/useStudySite', () => ({
  __esModule: true,
  default: () => ({
    siteId: 'all',
    studySiteId: 'site-1',
    setSite: jest.fn(),
  }),
}))

jest.mock('@/store/AppEnvironment', () => ({
  useAppEnvironmentStore: () => ({ environment: Environment.CUT }),
}))

jest.mock('@/services/permissions/environment', () => ({
  hasAccessToFeedbackButton: () => false,
  hasAccessToPDFExport: () => false,
  hasAccessToResultsRatioTab: () => true,
  hasAccessToSimplifiedEmissionAnalysis: () => false,
  hasAccessToAdvancedEmissionAnalysis: () => false,
  showResultsInfoText: () => false,
  isCut: () => true,
  isClickson: () => false,
  isTilt: () => false,
}))

jest.mock('@/services/serverFunctions/pdf', () => ({ generateStudySummaryPDF: jest.fn() }))
jest.mock('@abc-transitionbascarbone/components/src/hooks/useServerFunction', () => ({
  useServerFunction: () => ({ callServerFunction: jest.fn() }),
}))

jest.mock('@/services/study', () => ({ downloadStudyResults: jest.fn() }))

// eslint-disable-next-line @typescript-eslint/no-require-imports
const AllResultsPublicodes = require('@/environments/simplified/study/results/AllResultsPublicodes').default

const cutStudy = {
  id: 'study-1',
  name: 'Count study',
  resultsUnit: StudyResultUnit.T,
  organizationVersion: { environment: Environment.CUT },
  sites: [{ id: 'site-1', siteId: 'physical-site' }],
} as unknown as FullStudy

describe('AllResultsPublicodes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading state', () => {
    mockUsePublicodesResults.mockReturnValue({
      aggregated: [],
      bySite: {},
      isLoading: true,
      error: null,
      refresh: jest.fn(),
    })

    render(
      <ThemeProvider theme={theme}>
        <AllResultsPublicodes study={cutStudy} />
      </ThemeProvider>,
    )

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('shows error message', () => {
    mockUsePublicodesResults.mockReturnValue({
      aggregated: [],
      bySite: {},
      isLoading: false,
      error: 'Failed to load',
      refresh: jest.fn(),
    })

    render(
      <ThemeProvider theme={theme}>
        <AllResultsPublicodes study={cutStudy} />
      </ThemeProvider>,
    )

    expect(screen.getByText('Failed to load')).toBeInTheDocument()
  })
})
