import SignUpFormCut from '@/components/auth/SignUpFormCut'
import { render, screen } from '@testing-library/react'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}))

jest.mock('@abc-transitionbascarbone/utils/environmentClient', () => ({
  getEnvVarClient: () => 'test@example.com',
}))

jest.mock('@abc-transitionbascarbone/components/src/hooks/useServerFunction', () => ({
  useServerFunction: () => ({
    callServerFunction: jest.fn(async (fn) => {
      const result = await fn()
      return result
    }),
  }),
}))

jest.mock('@/services/serverFunctions/cnc', () => ({
  getAllCNCs: jest.fn().mockResolvedValue([]),
}))

jest.mock('@/services/serverFunctions/user', () => ({
  signUpWithSiretOrCNC: jest.fn(),
}))

describe('SignUpFormCut', () => {
  it('renders activation email field', async () => {
    render(<SignUpFormCut />)

    expect(screen.getByTestId('activation-email')).toBeInTheDocument()
    expect(screen.getByTestId('activation-button')).toBeInTheDocument()
  })
})
