import { Environment, Role } from '@abc-transitionbascarbone/db-common/enums'
import { expect } from '@jest/globals'
import { canBeUntrainedRole } from './user'

describe('commonuserUtils functions', () => {
  describe('canBeUntrainedRole', () => {
    test('should return true for all roles in CUT environment', () => {
      expect(canBeUntrainedRole(Role.ADMIN, Environment.CUT)).toBe(true)
      expect(canBeUntrainedRole(Role.DEFAULT, Environment.CUT)).toBe(true)
    })

    test('should return true for GESTIONNAIRE and DEFAULT roles in BASE environment', () => {
      expect(canBeUntrainedRole(Role.GESTIONNAIRE, Environment.BC)).toBe(true)
      expect(canBeUntrainedRole(Role.DEFAULT, Environment.BC)).toBe(true)
    })

    test('should return false for other roles in BASE environment', () => {
      expect(canBeUntrainedRole(Role.ADMIN, Environment.BC)).toBe(false)
      expect(canBeUntrainedRole(Role.COLLABORATOR, Environment.BC)).toBe(false)
      expect(canBeUntrainedRole(Role.SUPER_ADMIN, Environment.BC)).toBe(false)
    })
  })
})
