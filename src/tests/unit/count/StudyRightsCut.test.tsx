import type { FullStudy } from '@/db/study'
import StudyRightsCut from '@/environments/cut/study/StudyRightsCut'
import { render, screen, waitFor } from '@testing-library/react'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('@/components/study/site/useStudySite', () => ({
  __esModule: true,
  default: () => ({
    siteId: 'site-1',
    studySiteId: 'study-site-1',
    setSite: jest.fn(),
  }),
}))

jest.mock('@/services/serverFunctions/study', () => ({
  getStudySite: jest.fn().mockResolvedValue({
    id: 'study-site-1',
    openingHours: [],
  }),
  changeStudyCinema: jest.fn(),
}))

jest.mock('@/lib/components/hooks/useServerFunction', () => ({
  useServerFunction: () => ({
    callServerFunction: jest.fn(async (fn) => fn()),
  }),
}))

describe('StudyRightsCut', () => {
  it('renders loading indicator then form fields', async () => {
    const study = {
      id: 'study-1',
      name: 'Count',
      sites: [{ id: 'study-site-1', siteId: 'site-1', site: { name: 'Cinema' } }],
    } as unknown as FullStudy

    render(<StudyRightsCut study={study} />)

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })
  })
})
