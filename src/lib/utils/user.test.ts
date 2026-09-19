import { Role } from '@/generated/prisma/enums'
import { expect } from '@jest/globals'
import { canBeUntrainedRole } from './user'

describe('commonuserUtils functions', () => {
  describe('canBeUntrainedRole', () => {
    test('should return true for all roles in Count', () => {
      expect(canBeUntrainedRole(Role.ADMIN)).toBe(true)
      expect(canBeUntrainedRole(Role.DEFAULT)).toBe(true)
      expect(canBeUntrainedRole(Role.GESTIONNAIRE)).toBe(true)
      expect(canBeUntrainedRole(Role.COLLABORATOR)).toBe(true)
      expect(canBeUntrainedRole(Role.SUPER_ADMIN)).toBe(true)
    })
  })
})
