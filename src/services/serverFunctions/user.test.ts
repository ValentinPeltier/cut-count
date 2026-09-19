import { DeactivatableFeature, Role, UserStatus } from '@/generated/prisma/enums'
import { expect } from '@jest/globals'

import {
  addAccount,
  getAccountByEmail,
  getAccountById,
  getAccountFromUserOrganization,
} from '@/db/account'
import { findCncByCncCode } from '@/db/cnc'
import {
  createOrganizationWithVersion,
  getOrganizationVersionByOrganizationId,
  getOrganizationVersionForRightsCheck,
  getRawOrganizationBySiret,
  getRawOrganizationBySiteCNC,
} from '@/db/organization'
import { addSite } from '@/db/site'
import { addUser, getUserByEmail, organizationVersionActiveAccountsCount, updateAccount, validateUser } from '@/db/user'
import { sendActivationRequest } from '@/lib/services/email/email'
import { EMAIL_SENT, NOT_AUTHORIZED } from '@/lib/services/permissions/check'
import { mockedOrganizationId } from '@/lib/services/tests/models/organization'
import { mockedUserId } from '@/lib/services/tests/models/user'
import { REQUEST_SENT, UNKNOWN_SIRET_OR_CNC } from '@/services/permissions/check'
import { mockedOrganizationVersionId } from '@/tests/utils/models/organization'
import { mockedAccountId } from '@/tests/utils/models/user'
import { getCompanyName } from '../associationApi'
import { getDeactivableFeatureRestrictions } from './deactivableFeatures'
import { activateEmail, signUpWithSiretOrCNC } from './user'

// TODO: ESM module issue with Jest. Remove these mocks when moving to Vitest
jest.mock('../file', () => ({ download: jest.fn() }))
jest.mock('uuid', () => ({ v4: jest.fn() }))
jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(() => (key: string) => key),
}))

jest.mock('@/services/auth', () => ({
  auth: jest.fn(),
  dbActualizedAuth: jest.fn(),
}))

jest.mock('@/db/account')
jest.mock('@/db/cnc')
jest.mock('@/db/deactivableFeatures')
jest.mock('@/db/organization')
jest.mock('@/db/site')
jest.mock('@/db/study', () => ({}))
jest.mock('@/db/user')
jest.mock('@/services/associationApi')
jest.mock('@/db/user')
jest.mock('@/lib/services/email/email', () => ({
  sendActivationEmail: jest.fn(),
  sendActivationRequest: jest.fn(),
}))
jest.mock('./deactivableFeatures')

jest.mock('./user', () => {
  const originalModule = jest.requireActual('./user')
  return {
    ...originalModule,
    activateEmail: jest.fn(),
  }
})

const mockGetDeactivableFeatureRestrictions = getDeactivableFeatureRestrictions as jest.Mock
const mockGetAccountByEmail = getAccountByEmail as jest.Mock
const mockGetUserByEmail = getUserByEmail as jest.Mock
const mockAddUser = addUser as jest.Mock
const mockAddAccount = addAccount as jest.Mock
const mockUpdateAccount = updateAccount as jest.Mock
const mockGetAccountById = getAccountById as jest.Mock
const mockGetAccountFromUserOrganization = getAccountFromUserOrganization as jest.Mock
const mockValidateUser = validateUser as jest.Mock
const mockFindCncByCncCode = findCncByCncCode as jest.Mock
const mockGetRawOrganizationBySiteCNC = getRawOrganizationBySiteCNC as jest.Mock
const mockGetOrganizationVersionByOrganizationId =
  getOrganizationVersionByOrganizationId as jest.Mock
const mockCreateOrganizationWithVersion = createOrganizationWithVersion as jest.Mock
const mockAddSite = addSite as jest.Mock
const mockGetRawOrganizationBySiret = getRawOrganizationBySiret as jest.Mock
const mockGetCompanyName = getCompanyName as jest.Mock
const mockSendActivationRequest = sendActivationRequest as jest.Mock
const mockGetOrganizationVersionForRightsCheck = getOrganizationVersionForRightsCheck as jest.Mock
const mockOrganizationVersionActiveAccountsCount = organizationVersionActiveAccountsCount as jest.Mock
const mockActivateEmail = activateEmail as jest.Mock

const testEmail = 'test@example.com'
const testSiret = '12345678901234'
const testCNC = 'CNC123'

describe('signUpWithSiretOrCNC', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetDeactivableFeatureRestrictions.mockResolvedValue({ active: false })
    mockActivateEmail.mockResolvedValue({ success: true, data: EMAIL_SENT })
  })

  describe('Feature deactivation checks', () => {
    it('returns NOT_AUTHORIZED when creation is deactivated for environment', async () => {
      mockGetDeactivableFeatureRestrictions.mockResolvedValue({
        active: true,
              })

      const result = await signUpWithSiretOrCNC(testEmail, testSiret)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errorMessage).toBe(NOT_AUTHORIZED)
      }
      expect(mockGetDeactivableFeatureRestrictions).toHaveBeenCalledWith(DeactivatableFeature.Creation)
    })

    it('allows signup when creation is not deactivated', async () => {
      mockGetDeactivableFeatureRestrictions.mockResolvedValue({
        active: false,
      })
      mockGetAccountByEmail.mockResolvedValue(null)
      mockGetUserByEmail.mockResolvedValue(null)
      mockAddUser.mockResolvedValue({
        id: mockedUserId,
        email: testEmail,
        accounts: [{ id: mockedAccountId }],
      })
      mockGetRawOrganizationBySiret.mockResolvedValue(null)
      mockGetCompanyName.mockResolvedValue('Test Company')
      mockCreateOrganizationWithVersion.mockResolvedValue({ id: mockedOrganizationVersionId })
      mockValidateUser.mockResolvedValue(undefined)

      const result = await signUpWithSiretOrCNC(testEmail, testSiret)

      expect(result.success).toBe(true)
    })
  })

  describe('Account already exists scenarios', () => {
    it('returns NOT_AUTHORIZED when account exists for CUT environment', async () => {
      mockGetAccountByEmail.mockResolvedValue({
        id: mockedAccountId,
        organizationVersionId: mockedOrganizationVersionId,
        status: UserStatus.ACTIVE,
      })

      const result = await signUpWithSiretOrCNC(testEmail, testSiret)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errorMessage).toBe(NOT_AUTHORIZED)
      }
    })
  })

  describe('User creation scenarios', () => {
    it('creates new account when user exists without account for environment', async () => {
      mockGetAccountByEmail.mockResolvedValue(null)
      mockGetUserByEmail.mockResolvedValue({ id: mockedUserId, email: testEmail })
      mockAddAccount.mockResolvedValue({ id: mockedAccountId })
      mockGetRawOrganizationBySiret.mockResolvedValue(null)
      mockGetCompanyName.mockResolvedValue('Test Company')
      mockCreateOrganizationWithVersion.mockResolvedValue({ id: mockedOrganizationVersionId })
      mockValidateUser.mockResolvedValue(undefined)

      const result = await signUpWithSiretOrCNC(testEmail, testSiret)

      expect(mockAddAccount).toHaveBeenCalledWith({
        user: { connect: { id: mockedUserId } },
        role: Role.DEFAULT,
        status: UserStatus.PENDING_REQUEST,
      })
      expect(result.success).toBe(true)
      expect(mockActivateEmail).not.toHaveBeenCalled()
    })
  })

  describe('CUT environment with CNC code', () => {
    it('creates organization and site when CNC exists but organization does not', async () => {
      mockGetAccountByEmail.mockResolvedValue(null)
      mockGetUserByEmail.mockResolvedValue(null)
      mockAddUser.mockResolvedValue({
        id: mockedUserId,
        email: testEmail,
        accounts: [{ id: mockedAccountId }],
      })
      mockFindCncByCncCode.mockResolvedValue({
        id: 'cnc-id',
        nom: 'Test CNC',
        codeInsee: '75001',
        commune: 'Paris',
      })
      mockGetRawOrganizationBySiteCNC.mockResolvedValue(null)
      mockGetOrganizationVersionByOrganizationId.mockResolvedValue(null)
      mockCreateOrganizationWithVersion.mockResolvedValue({
        id: mockedOrganizationVersionId,
        organizationId: mockedOrganizationId,
      })
      mockValidateUser.mockResolvedValue(undefined)

      const result = await signUpWithSiretOrCNC(testEmail, testCNC)

      expect(mockFindCncByCncCode).toHaveBeenCalledWith(testCNC)
      expect(mockCreateOrganizationWithVersion).toHaveBeenCalledWith({ name: 'Test CNC' }, {})
      expect(mockAddSite).toHaveBeenCalledWith({
        name: 'Test CNC',
        postalCode: '75001',
        city: 'Paris',
        cnc: {
          connectOrCreate: {
            create: {},
            where: { id: 'cnc-id' },
          },
        },
        organization: { connect: { id: mockedOrganizationId } },
      })
      expect(result.success).toBe(true)
    })

    it('uses existing organization when CNC and organization exist', async () => {
      mockGetAccountByEmail.mockResolvedValue(null)
      mockGetUserByEmail.mockResolvedValue(null)
      mockAddUser.mockResolvedValue({
        id: mockedUserId,
        email: testEmail,
        firstName: 'Test',
        lastName: 'User',
        accounts: [{ id: mockedAccountId }],
      })
      mockFindCncByCncCode.mockResolvedValue({
        id: 'cnc-id',
        nom: 'Test CNC',
        codeInsee: '75001',
        commune: 'Paris',
      })
      mockGetRawOrganizationBySiteCNC.mockResolvedValue({ id: mockedOrganizationId })
      mockGetOrganizationVersionByOrganizationId.mockResolvedValue({
        id: mockedOrganizationVersionId,
      })
      mockGetAccountById.mockResolvedValue({
        id: mockedAccountId,
        user: { email: testEmail, firstName: 'Test', lastName: 'User' },
      })
      mockGetAccountFromUserOrganization.mockResolvedValue([
        {
          role: Role.ADMIN,
          user: { email: 'admin@example.com' },
        },
      ])

      const result = await signUpWithSiretOrCNC(testEmail, testCNC)

      expect(mockCreateOrganizationWithVersion).not.toHaveBeenCalled()
      expect(mockAddSite).not.toHaveBeenCalled()
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe(REQUEST_SENT)
      }
    })
  })

  describe('SIRET validation', () => {
    it('returns UNKNOWN_SIRET_OR_CNC when identifier is too short and not CNC', async () => {
      mockGetAccountByEmail.mockResolvedValue(null)
      mockGetUserByEmail.mockResolvedValue(null)
      mockAddUser.mockResolvedValue({
        id: mockedUserId,
        email: testEmail,
        accounts: [{ id: mockedAccountId }],
      })
      mockFindCncByCncCode.mockResolvedValue(null)

      const result = await signUpWithSiretOrCNC(testEmail, '12345')

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errorMessage).toBe(UNKNOWN_SIRET_OR_CNC)
      }
    })
  })

  describe('CUT environment company name lookup', () => {
    it('fetches company name for CUT environment when organization does not exist', async () => {
      mockGetAccountByEmail.mockResolvedValue(null)
      mockGetUserByEmail.mockResolvedValue(null)
      mockAddUser.mockResolvedValue({
        id: mockedUserId,
        email: testEmail,
        accounts: [{ id: mockedAccountId }],
      })
      mockGetRawOrganizationBySiret.mockResolvedValue(null)
      mockGetCompanyName.mockResolvedValue('Test Company')
      mockCreateOrganizationWithVersion.mockResolvedValue({ id: mockedOrganizationVersionId })
      mockValidateUser.mockResolvedValue(undefined)

      const result = await signUpWithSiretOrCNC(testEmail, testSiret)

      expect(mockGetCompanyName).toHaveBeenCalledWith(testSiret)
      expect(mockCreateOrganizationWithVersion).toHaveBeenCalledWith(
        { wordpressId: testSiret, name: 'Test Company' },
        {},
      )
      expect(result.success).toBe(true)
    })
  })

  describe('Role assignment logic', () => {
    it('assigns ADMIN role when creating new organization', async () => {
      mockGetAccountByEmail.mockResolvedValue(null)
      mockGetUserByEmail.mockResolvedValue(null)
      mockAddUser.mockResolvedValue({
        id: mockedUserId,
        email: testEmail,
        accounts: [{ id: mockedAccountId }],
      })
      mockGetRawOrganizationBySiret.mockResolvedValue(null)
      mockGetCompanyName.mockResolvedValue('Test Company')
      mockCreateOrganizationWithVersion.mockResolvedValue({ id: mockedOrganizationVersionId })
      mockValidateUser.mockResolvedValue(undefined)

      const result = await signUpWithSiretOrCNC(testEmail, testSiret)

      expect(mockUpdateAccount).toHaveBeenCalledWith(mockedAccountId, {
        role: Role.ADMIN,
        organizationVersion: { connect: { id: mockedOrganizationVersionId } },
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe(EMAIL_SENT)
      }
    })

    it('assigns DEFAULT role when joining existing organization', async () => {
      mockGetAccountByEmail.mockResolvedValue(null)
      mockGetUserByEmail.mockResolvedValue(null)
      mockAddUser.mockResolvedValue({
        id: mockedUserId,
        email: testEmail,
        accounts: [{ id: mockedAccountId }],
      })
      mockGetRawOrganizationBySiret.mockResolvedValue({ id: mockedOrganizationId })
      mockGetOrganizationVersionByOrganizationId.mockResolvedValue({
        id: mockedOrganizationVersionId,
      })
      mockGetAccountById.mockResolvedValue({
        id: mockedAccountId,
        user: { email: testEmail },
      })
      mockGetAccountFromUserOrganization.mockResolvedValue([
        {
          role: Role.ADMIN,
          user: { email: 'admin@example.com' },
        },
      ])

      const result = await signUpWithSiretOrCNC(testEmail, testSiret)

      expect(mockUpdateAccount).toHaveBeenCalledWith(mockedAccountId, {
        role: Role.DEFAULT,
        organizationVersion: { connect: { id: mockedOrganizationVersionId } },
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe(REQUEST_SENT)
      }
    })
  })

  describe('Email flow scenarios', () => {
    it('sends activation request to admins when joining existing organization', async () => {
      mockGetAccountByEmail.mockResolvedValue(null)
      mockGetUserByEmail.mockResolvedValue(null)
      mockAddUser.mockResolvedValue({
        id: mockedUserId,
        email: testEmail,
        firstName: 'Test',
        lastName: 'User',
        accounts: [{ id: mockedAccountId }],
      })
      mockGetRawOrganizationBySiret.mockResolvedValue({ id: mockedOrganizationId })
      mockGetOrganizationVersionByOrganizationId.mockResolvedValue({
        id: mockedOrganizationVersionId,
      })
      mockGetAccountById.mockResolvedValue({
        id: mockedAccountId,
        user: { email: testEmail, firstName: 'Test', lastName: 'User' },
      })
      mockGetAccountFromUserOrganization.mockResolvedValue([
        {
          role: Role.ADMIN,
          user: { email: 'admin@example.com' },
        },
        {
          role: Role.GESTIONNAIRE,
          user: { email: 'gestionnaire@example.com' },
        },
        {
          role: Role.DEFAULT,
          user: { email: 'member@example.com' },
        },
      ])

      const result = await signUpWithSiretOrCNC(testEmail, testSiret)

      expect(mockSendActivationRequest).toHaveBeenCalledWith(
        ['admin@example.com', 'gestionnaire@example.com'],
        testEmail,
        'Test User',
      )
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe(REQUEST_SENT)
      }
    })

    it('validates user and sends activation when creating new organization', async () => {
      mockGetAccountByEmail.mockResolvedValue(null)
      mockGetUserByEmail.mockResolvedValue(null)
      mockAddUser.mockResolvedValue({
        id: mockedUserId,
        email: testEmail,
        accounts: [{ id: mockedAccountId }],
      })
      mockGetRawOrganizationBySiret.mockResolvedValue(null)
      mockGetCompanyName.mockResolvedValue('Test Company')
      mockCreateOrganizationWithVersion.mockResolvedValue({ id: mockedOrganizationVersionId })
      mockValidateUser.mockResolvedValue(undefined)

      const result = await signUpWithSiretOrCNC(testEmail, testSiret)

      expect(mockValidateUser).toHaveBeenCalledWith(mockedAccountId)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe(EMAIL_SENT)
      }
    })
  })
})
