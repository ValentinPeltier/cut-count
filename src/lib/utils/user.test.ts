import { Environment, Role } from '@/db-common/enums'
import { expect } from '@jest/globals'
import { canBeUntrainedRole } from './user'

describe('commonuserUtils functions', () => {
  describe('canBeUntrainedRole', () => {
    test('should return true for all roles in Count', () => {
      expect(canBeUntrainedRole(Role.ADMIN, Environment.CUT)).toBe(true)
      expect(canBeUntrainedRole(Role.DEFAULT, Environment.CUT)).toBe(true)
      expect(canBeUntrainedRole(Role.GESTIONNAIRE, Environment.CUT)).toBe(true)
      expect(canBeUntrainedRole(Role.COLLABORATOR, Environment.CUT)).toBe(true)
      expect(canBeUntrainedRole(Role.SUPER_ADMIN, Environment.CUT)).toBe(true)
    })
  })
})
