import { getAccountById, getAccountFromUserOrganization } from '@/db/account'
import { getOrganizationVersionForRightsCheck } from '@/db/organization'
import { changeStatus, getUserByEmail, organizationVersionActiveAccountsCount, validateUser } from '@/db/user'
import { UserStatus } from '@/generated/prisma/enums'
import { sendActivationEmail, sendActivationRequest } from '@/lib/services/email/email'
import { EMAIL_SENT } from '@/lib/services/permissions/check'
import { updateUserResetToken } from '@/lib/services/serverFunctions/user'
import { REQUEST_SENT } from '@/services/permissions/check'
import { AccountWithUser } from '@/types/account.types'
import { expect } from '@jest/globals'

jest.mock('@/services/auth', () => ({
  auth: jest.fn(),
  dbActualizedAuth: jest.fn(),
}))
jest.mock('@/db/study', () => ({}))
jest.mock('@/db/account')
jest.mock('@/db/organization')
jest.mock('@/db/user')
jest.mock('@/lib/services/serverFunctions/user', () => ({
  updateUserResetToken: jest.fn(),
}))
jest.mock('@/lib/services/email/email', () => ({
  sendActivationEmail: jest.fn(),
  sendActivationRequest: jest.fn(),
}))

const { activateEmail } = jest.requireActual<typeof import('./user')>('./user')

const mockGetUserByEmail = getUserByEmail as jest.Mock
const mockGetAccountById = getAccountById as jest.Mock
const mockValidateUser = validateUser as jest.Mock
const mockSendActivationEmail = sendActivationEmail as jest.Mock
const mockUpdateUserResetToken = updateUserResetToken as jest.Mock
const mockGetOrganizationVersionForRightsCheck = getOrganizationVersionForRightsCheck as jest.Mock
const mockOrganizationVersionActiveAccountsCount = organizationVersionActiveAccountsCount as jest.Mock
const mockGetAccountFromUserOrganization = getAccountFromUserOrganization as jest.Mock
const mockSendActivationRequest = sendActivationRequest as jest.Mock
const mockChangeStatus = changeStatus as jest.Mock

describe('activateEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('sends activation email for validated account without organization', async () => {
    const account = {
      id: 'account-id',
      organizationVersionId: null,
      organizationVersion: null,
      status: UserStatus.VALIDATED,
    } as AccountWithUser

    mockGetUserByEmail.mockResolvedValue({ accounts: [{ id: account.id }] })
    mockGetAccountById.mockResolvedValue(account)
    mockValidateUser.mockResolvedValue(undefined)
    mockUpdateUserResetToken.mockResolvedValue('token')
    mockSendActivationEmail.mockResolvedValue(undefined)

    const result = await activateEmail('user@example.com')

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBe(EMAIL_SENT)
    }
    expect(mockValidateUser).toHaveBeenCalledWith(account.id)
    expect(mockSendActivationEmail).toHaveBeenCalledWith('user@example.com', 'token', false)
    expect(mockGetOrganizationVersionForRightsCheck).not.toHaveBeenCalled()
  })

  it('rejects activation without organization for imported account', async () => {
    const account = {
      id: 'account-id',
      organizationVersionId: null,
      organizationVersion: null,
      status: UserStatus.IMPORTED,
    } as AccountWithUser

    mockGetUserByEmail.mockResolvedValue({ accounts: [{ id: account.id }] })
    mockGetAccountById.mockResolvedValue(account)

    const result = await activateEmail('user@example.com')

    expect(result.success).toBe(false)
    expect(mockValidateUser).not.toHaveBeenCalled()
  })

  it('keeps organization validation path when organizationVersionId is set', async () => {
    const account = {
      id: 'account-id',
      organizationVersionId: 'org-version-id',
      organizationVersion: { organizationId: 'org-id', id: 'org-version-id' },
      status: UserStatus.PENDING_REQUEST,
      user: {
        id: 'user-id',
        email: 'user@example.com',
        firstName: 'Test',
        lastName: 'User',
      },
    } as AccountWithUser

    mockGetUserByEmail.mockResolvedValue({
      firstName: 'Test',
      lastName: 'User',
      accounts: [{ id: account.id }],
    })
    mockGetAccountById.mockResolvedValue(account)
    mockGetOrganizationVersionForRightsCheck.mockResolvedValue({ id: 'org-version-id' })
    mockOrganizationVersionActiveAccountsCount.mockResolvedValue(1)
    mockGetAccountFromUserOrganization.mockResolvedValue([])
    mockChangeStatus.mockResolvedValue(undefined)
    mockSendActivationRequest.mockResolvedValue(undefined)
    mockChangeStatus.mockResolvedValue(undefined)

    const result = await activateEmail('user@example.com')

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBe(REQUEST_SENT)
    }
    expect(mockGetOrganizationVersionForRightsCheck).toHaveBeenCalledWith('org-version-id')
    expect(mockSendActivationRequest).toHaveBeenCalled()
  })
})
