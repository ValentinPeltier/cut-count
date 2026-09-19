import RessourceLinks from '@/components/ressources/RessourceLinks'
import * as documentsModule from '@/services/serverFunctions/documents'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockCallServerFunction = jest.fn()

jest.mock('@/lib/components/hooks/useServerFunction', () => ({
  useServerFunction: () => ({
    callServerFunction: mockCallServerFunction,
  }),
}))

jest.mock('@/services/serverFunctions/documents', () => ({
  getDocumentUrl: jest.fn(),
}))

describe('RessourceLinks', () => {
  const openSpy = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    openSpy.mockReset()
    window.open = openSpy as unknown as typeof window.open
    mockCallServerFunction.mockImplementation(async (fn: () => Promise<unknown>) => fn())
  })

  it('renders section title and external links with correct href', () => {
    render(
      <RessourceLinks
        title="countMethods"
        links={[
          { title: 'FAQ', link: 'https://faq.example.com' },
          { title: 'Contact', link: 'mailto:support@count.example' },
        ]}
      />,
    )

    expect(screen.getByTestId('ressource-links-title')).toHaveTextContent('countMethods')
    expect(screen.getByTestId('ressource-links-list')).toBeInTheDocument()

    const externalLinks = screen.getAllByTestId('ressource-external-link')
    expect(externalLinks).toHaveLength(2)
    expect(externalLinks[0]).toHaveAttribute('href', 'https://faq.example.com')
    expect(externalLinks[0]).toHaveAttribute('target', '_blank')
    expect(externalLinks[1]).toHaveAttribute('href', 'mailto:support@count.example')
  })

  it('renders download buttons for links with downloadKey only', () => {
    render(
      <RessourceLinks
        title="countMethods"
        links={[
          { title: 'countMethodLink', downloadKey: 'count' },
          { title: 'resilioMethodLink', downloadKey: 'resilio' },
        ]}
      />,
    )

    const downloadButtons = screen.getAllByTestId('ressource-download-button')
    expect(downloadButtons).toHaveLength(2)
    expect(downloadButtons[0]).toHaveAttribute('data-download-key', 'count')
    expect(downloadButtons[1]).toHaveAttribute('data-download-key', 'resilio')
    expect(screen.queryByTestId('ressource-external-link')).not.toBeInTheDocument()
  })

  it('opens document URL in a new tab when download succeeds', async () => {
    jest.mocked(documentsModule.getDocumentUrl).mockResolvedValue({
      success: true,
      data: '/api/ressources/methodologie?documentKey=count',
    })

    render(<RessourceLinks title="countMethods" links={[{ title: 'countMethodLink', downloadKey: 'count' }]} />)

    await userEvent.click(screen.getByTestId('ressource-download-button'))

    await waitFor(() => {
      expect(documentsModule.getDocumentUrl).toHaveBeenCalledWith('count')
      expect(openSpy).toHaveBeenCalledWith(
        '/api/ressources/methodologie?documentKey=count',
        '_blank',
        'noopener,noreferrer',
      )
    })
  })

  it('does not open a tab when download fails', async () => {
    jest.mocked(documentsModule.getDocumentUrl).mockResolvedValue({
      success: false,
      errorMessage: 'NOT_FOUND',
    })

    render(<RessourceLinks title="countMethods" links={[{ title: 'countMethodLink', downloadKey: 'count' }]} />)

    await userEvent.click(screen.getByTestId('ressource-download-button'))

    await waitFor(() => {
      expect(documentsModule.getDocumentUrl).toHaveBeenCalled()
    })
    expect(openSpy).not.toHaveBeenCalled()
  })

  it('uses distinct React keys for multiple download-only links', () => {
    const { container } = render(
      <RessourceLinks
        title="countMethods"
        links={[
          { title: 'same visible title', downloadKey: 'KEY_A' },
          { title: 'same visible title', downloadKey: 'KEY_B' },
        ]}
      />,
    )

    expect(screen.getAllByTestId('ressource-download-button')).toHaveLength(2)
    expect(container.querySelectorAll('[data-download-key]')).toHaveLength(2)
  })
})
