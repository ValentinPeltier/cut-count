import RessourcesPage from '@/components/pages/Ressources'
import { getRessources } from '@/utils/ressources'

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
  getRessources: jest.fn(),
}))

jest.mock('@/lib/components/hooks/useServerFunction', () => ({
  useServerFunction: () => ({
    callServerFunction: jest.fn(async (fn: () => Promise<unknown>) => fn()),
  }),
}))

jest.mock('@/services/serverFunctions/documents', () => ({
  getDocumentUrl: jest.fn(),
}))

const mockGetRessources = jest.mocked(getRessources)

const cutResourcesFixture = [
  {
    title: 'countMethods',
    links: [
      { title: 'countMethodLink', downloadKey: 'count' },
      { title: 'resilioMethodLink', downloadKey: 'resilio' },
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
    mockGetRessources.mockResolvedValue(cutResourcesFixture)

    const ui = await RessourcesPage()
    render(ui)

    expect(screen.getByTestId('ressources-sections')).toBeInTheDocument()
    expect(screen.getByTestId('ressources-cut-description')).toBeInTheDocument()
    expect(screen.getByTestId('ressources-cut-france2030')).toBeInTheDocument()
    expect(screen.getAllByTestId('ressource-links-card')).toHaveLength(2)
    expect(screen.getAllByTestId('ressource-download-button')).toHaveLength(2)
    expect(screen.getByTestId('ressource-external-link')).toHaveAttribute('href', 'https://opencarbon.example')
  })

  it('calls getRessources with translations', async () => {
    mockGetRessources.mockResolvedValue([])

    await RessourcesPage()

    expect(mockGetRessources).toHaveBeenCalledWith(expect.any(Function))
  })
})
