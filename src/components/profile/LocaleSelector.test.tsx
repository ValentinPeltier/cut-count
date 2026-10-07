import { Locale } from '@/lib/i18n/config'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import LocaleSelector from './LocaleSelector'

const switchLocale = jest.fn()
const getLocale = jest.fn()
const refresh = jest.fn()

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh }),
}))

jest.mock('@/i18n/locale', () => ({
  getLocale: (...args: unknown[]) => getLocale(...args),
  switchLocale: (...args: unknown[]) => switchLocale(...args),
}))

describe('LocaleSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getLocale.mockResolvedValue(Locale.FR)
  })

  it('lists French and English and switches locale', async () => {
    render(<LocaleSelector />)

    await waitFor(() => {
      expect(screen.getByTestId('locale-selector')).toHaveTextContent('fr')
    })

    fireEvent.mouseDown(screen.getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: 'en' }))

    await waitFor(() => {
      expect(switchLocale).toHaveBeenCalledWith(Locale.EN)
      expect(refresh).toHaveBeenCalled()
    })
  })
})
