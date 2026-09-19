import * as authModule from '../auth'
import { getDocumentUrl } from './documents'

jest.mock('../auth', () => ({
  auth: jest.fn(),
  dbActualizedAuth: jest.fn(),
}))

describe('getDocumentUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest
      .mocked(authModule.auth)
      .mockResolvedValue({ user: { id: 'user-1' } } as Awaited<ReturnType<typeof authModule.auth>>)
  })

  it('returns local API path for known methodology keys when authenticated', async () => {
    jest.mocked(authModule.dbActualizedAuth).mockResolvedValue({
      user: { id: 'user-1' },
      expires: '2099-01-01',
    } as Awaited<ReturnType<typeof authModule.dbActualizedAuth>>)

    const result = await getDocumentUrl('count')

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBe('/api/ressources/methodologie?documentKey=count')
    }
  })

  it('fails when not authenticated', async () => {
    jest.mocked(authModule.dbActualizedAuth).mockResolvedValue(null)

    const result = await getDocumentUrl('count')

    expect(result.success).toBe(false)
  })

  it('fails for unknown document keys', async () => {
    jest.mocked(authModule.dbActualizedAuth).mockResolvedValue({
      user: { id: 'user-1' },
      expires: '2099-01-01',
    } as Awaited<ReturnType<typeof authModule.dbActualizedAuth>>)

    const result = await getDocumentUrl('UNKNOWN_KEY')

    expect(result.success).toBe(false)
  })
})
