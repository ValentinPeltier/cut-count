import { studySiteToSituation } from '@/services/studySiteToSituation'
import * as situationDbModule from '@/db/situation'


jest.mock('@/db/situation', () => ({
  updateSituationFields: jest.fn(),
}))

const mockUpdateSituationFields = situationDbModule.updateSituationFields as jest.Mock

describe('studySiteToSituation for CUT', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('produces Publicodes keys used when syncing perimeter fields', async () => {
    const updates = studySiteToSituation({
      numberOfTickets: 2000,
      numberOfSessions: 100,
      numberOfOpenDays: 250,
    })

    expect(updates).toEqual({
      'général . nombre entrées': 2000,
      'général . nombre séances': 100,
      'général . nombre de jours ouverture': 250,
    })

    mockUpdateSituationFields.mockResolvedValue(undefined)
    await mockUpdateSituationFields('study-site-id', updates)

    expect(mockUpdateSituationFields).toHaveBeenCalledWith('study-site-id', updates)
  })
})
