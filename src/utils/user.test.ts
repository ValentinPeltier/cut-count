import { Role, UserStatus } from '@/generated/prisma/enums'
import { CutRoles } from '@/services/roles'
import { getMockedAuthUser } from '@/tests/utils/models/user'
import { expect } from '@jest/globals'
import { findUserInfo, getRoleToSetForUntrained, getTeamRoles, isAdmin } from './user'

describe('userUtils functions', () => {
  describe('isAdmin', () => {
    test('should return true for ADMIN roles', () => {
      expect(isAdmin(Role.ADMIN)).toBe(true)
      expect(isAdmin(Role.SUPER_ADMIN)).toBe(true)
    })

    test('should return false for non-ADMIN roles', () => {
      expect(isAdmin(Role.GESTIONNAIRE)).toBe(false)
      expect(isAdmin(Role.COLLABORATOR)).toBe(false)
      expect(isAdmin(Role.DEFAULT)).toBe(false)
      expect(isAdmin('OTHER_ROLE' as Role)).toBe(false)
    })
  })

  describe('findUserInfo', () => {
    test('should return correct arguments for user find info when user can edit member role', () => {
      const user = getMockedAuthUser({ role: Role.ADMIN })

      const result = findUserInfo(user)
      expect(result).toEqual({
        select: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
              level: true,
              updatedAt: true,
            },
          },
          status: true,
          role: true,
          updatedAt: true,
        },
        where: { organizationVersionId: user.organizationVersionId },
      })
    })

    test('should return correct arguments for user find info when user cannot edit member role', () => {
      const user = getMockedAuthUser({ role: Role.DEFAULT })

      const result = findUserInfo(user)
      expect(result).toEqual({
        select: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
              level: true,
              updatedAt: true,
            },
          },
          status: true,
          role: true,
          updatedAt: true,
        },
        where: { status: UserStatus.ACTIVE, organizationVersionId: user.organizationVersionId },
      })
    })
  })

  describe('getTeamRoles', () => {
    test('should return CutRoles', () => {
      expect(getTeamRoles()).toEqual(CutRoles)
    })
  })

  describe('getRoleToSetForUntrained', () => {
    test('should return the same role for Count', () => {
      expect(getRoleToSetForUntrained(Role.ADMIN)).toBe(Role.ADMIN)
      expect(getRoleToSetForUntrained(Role.DEFAULT)).toBe(Role.DEFAULT)
      expect(getRoleToSetForUntrained(Role.GESTIONNAIRE)).toBe(Role.GESTIONNAIRE)
      expect(getRoleToSetForUntrained(Role.COLLABORATOR)).toBe(Role.COLLABORATOR)
    })
  })
})
