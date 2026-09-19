import type { FullStudy } from '@/db/study'
import CarbonIntensitiesCut from '@/environments/cut/study/results/CarbonIntensitiesCut'
import { render, screen } from '@testing-library/react'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('@/store/AppLoading', () => ({
  useAppLoadingStore: () => ({ isLoading: false }),
}))

describe('CarbonIntensitiesCut', () => {
  it('uses divider 1 when ticket count is zero on a single site', () => {
    const study = {
      sites: [
        {
          id: 'site-1',
          numberOfTickets: 0,
          numberOfSessions: 0,
          superficy: 0,
          site: { cnc: { ecrans: 0, numberOfProgrammedFilms: 0, fauteuils: 0 } },
        },
      ],
    } as unknown as FullStudy

    render(<CarbonIntensitiesCut study={study} studySite="site-1" withDepValue={10} />)

    expect(screen.getByTestId('dependency-result-entries')).toHaveTextContent('10')
  })

  it('divides total by number of tickets', () => {
    const study = {
      sites: [
        {
          id: 'site-1',
          numberOfTickets: 5,
          numberOfSessions: 1,
          superficy: 1,
          site: { cnc: { ecrans: 1, numberOfProgrammedFilms: 1, fauteuils: 1 } },
        },
      ],
    } as unknown as FullStudy

    render(<CarbonIntensitiesCut study={study} studySite="site-1" withDepValue={100} />)

    expect(screen.getByTestId('dependency-result-entries')).toHaveTextContent('20')
  })
})
