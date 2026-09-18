import { Environment } from '@abc-transitionbascarbone/db-common/enums'
import { canSaveSituationOnStudy, isSimplifiedContributor } from './situation'
import * as studyPermissionsModule from './study'

jest.mock('./study', () => ({
  hasEditAccessOnStudy: jest.fn(),
}))

const mockHasEditAccessOnStudy = jest.mocked(studyPermissionsModule.hasEditAccessOnStudy)

describe('isSimplifiedContributor', () => {
  const mockStudy: Parameters<typeof isSimplifiedContributor>[0] = {
    contributors: [{ accountId: 'account-1' }],
  }

  it('returns false for remaining environments', () => {
    const session = {
      user: {
        accountId: 'account-1',
        environment: Environment.CUT,
      } as Parameters<typeof isSimplifiedContributor>[1]['user'],
    }

    expect(isSimplifiedContributor(mockStudy, session)).toBe(false)
  })
})

describe('canSaveSituationOnStudy', () => {
  const mockStudy: Parameters<typeof canSaveSituationOnStudy>[1] = {
    contributors: [{ accountId: 'account-1' }],
  }

  const session: Parameters<typeof canSaveSituationOnStudy>[2] = {
    user: {
      accountId: 'account-1',
      environment: Environment.CUT,
    } as Parameters<typeof canSaveSituationOnStudy>[2]['user'],
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns true when user has edit access', async () => {
    mockHasEditAccessOnStudy.mockResolvedValue(true)

    const result = await canSaveSituationOnStudy('study-1', mockStudy, session)

    expect(result).toBe(true)
  })

  it('returns false when user has no edit access', async () => {
    mockHasEditAccessOnStudy.mockResolvedValue(false)

    const result = await canSaveSituationOnStudy('study-1', mockStudy, session)

    expect(result).toBe(false)
  })
})
