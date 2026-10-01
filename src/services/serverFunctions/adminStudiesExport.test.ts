import * as adminExportDb from '@/db/adminStudiesExport'
import { Role } from '@/generated/prisma/enums'
import { NOT_AUTHORIZED } from '@/lib/services/permissions/check'
import * as authModule from '@/services/auth'
import { exportAdminStudiesExcel } from './adminStudiesExport'

jest.mock('../auth', () => ({
  auth: jest.fn(),
  dbActualizedAuth: jest.fn(),
}))

jest.mock('@/db/adminStudiesExport', () => ({
  findAllStudySitesForAdminExport: jest.fn(),
}))

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(async (namespace: string) => (key: string) => {
    if (namespace === 'adminPanel' && key === 'exportStudiesFilename') {
      return 'export-count.xlsx'
    }
    return key
  }),
}))

const mockAuth = authModule.auth as jest.Mock
const mockDbActualizedAuth = authModule.dbActualizedAuth as jest.Mock
const mockFindAll = adminExportDb.findAllStudySitesForAdminExport as jest.Mock

describe('exportAdminStudiesExcel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuth.mockResolvedValue(null)
  })

  it('refuses a missing session before reading studies', async () => {
    mockDbActualizedAuth.mockResolvedValue(null)

    const result = await exportAdminStudiesExcel()

    expect(result).toEqual({ success: false, errorMessage: NOT_AUTHORIZED })
    expect(mockFindAll).not.toHaveBeenCalled()
  })

  it('refuses an organization admin before reading studies', async () => {
    mockDbActualizedAuth.mockResolvedValue({ user: { id: 'admin', role: Role.ADMIN } })

    const result = await exportAdminStudiesExcel()

    expect(result).toEqual({ success: false, errorMessage: NOT_AUTHORIZED })
    expect(mockFindAll).not.toHaveBeenCalled()
  })

  it('returns an xlsx buffer for a super admin', async () => {
    mockDbActualizedAuth.mockResolvedValue({ user: { id: 'super', role: Role.SUPER_ADMIN } })
    mockFindAll.mockResolvedValue([])

    const result = await exportAdminStudiesExcel()

    expect(mockFindAll).toHaveBeenCalledTimes(1)
    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.filename).toBe('export-count.xlsx')
    expect(result.data.xlsxBuffer.slice(0, 2)).toEqual([0x50, 0x4b])
  })
})
