import RessourcesPage from '@/components/pages/Ressources'
import { getEnvironnementRessources } from '@/utils/ressources'
import { Environment } from '@/db-common/enums'
import { render, screen } from '@testing-library/react'

jest.mock('@/lib/components/base/Block', () => ({
  __esModule: true,
  default: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div data-testid="ressources-page-block">
      <h1>{title}</h1>
      {children}
    </div>
  ),
}))

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(async () => (key: string) => key),
}))

jest.mock('@/lib/utils/customRich', () => ({
  customRich: (_t: unknown, key: string) => key,
}))

jest.mock('@/utils/ressources', () => ({
  getEnvironnementRessources: jest.fn(),
}))

jest.mock('@/lib/components/hooks/useServerFunction', () => ({
  useServerFunction: () => ({
    callServerFunction: jest.fn(async (fn: () => Promise<unknown>) => fn()),
  }),
}))

jest.mock('@/services/serverFunctions/documents', () => ({
  getDocumentUrl: jest.fn(),
}))

const mockGetEnvironnementRessources = jest.mocked(getEnvironnementRessources)

const cutResourcesFixture = [
  {
    title: 'countMethods',
    links: [
      { title: 'countMethodLink', downloadKey: 'SCW_CUT_METHOD_KEY' },
      { title: 'resilioMethodLink', downloadKey: 'SCW_RESILIO_METHOD_KEY' },
    ],
  },
  {
    title: 'questionMethodo',
    links: [{ title: 'openCarbonPractice', link: 'https://opencarbon.example' }],
  },
]

describe('RessourcesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders CUT resource sections including download cards', async () => {
    mockGetEnvironnementRessources.mockResolvedValue(cutResourcesFixture)

    const ui = await RessourcesPage({ environment: Environment.CUT })
    render(ui)

    expect(screen.getByTestId('ressources-sections')).toBeInTheDocument()
    expect(screen.getByTestId('ressources-cut-description')).toBeInTheDocument()
    expect(screen.getByTestId('ressources-cut-france2030')).toBeInTheDocument()
    expect(screen.getAllByTestId('ressource-links-card')).toHaveLength(2)
    expect(screen.getAllByTestId('ressource-download-button')).toHaveLength(2)
    expect(screen.getByTestId('ressource-external-link')).toHaveAttribute('href', 'https://opencarbon.example')
  })

  it('does not render CUT-only alerts for BC environment', async () => {
    mockGetEnvironnementRessources.mockResolvedValue([
      {
        title: 'enSavoirPlusBilan',
        links: [{ title: 'methodeBilanCarbone', link: 'https://www.bilancarbone-methode.com/' }],
      },
    ])

    const ui = await RessourcesPage({ environment: Environment.BC })
    render(ui)

    expect(screen.queryByTestId('ressources-cut-description')).not.toBeInTheDocument()
    expect(screen.queryByTestId('ressources-cut-france2030')).not.toBeInTheDocument()
  })

  it('passes environment to getEnvironnementRessources', async () => {
    mockGetEnvironnementRessources.mockResolvedValue([])

    await RessourcesPage({ environment: Environment.CUT })

    expect(mockGetEnvironnementRessources).toHaveBeenCalledWith(Environment.CUT, expect.any(Function))
  })
})
