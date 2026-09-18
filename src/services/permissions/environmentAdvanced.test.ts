import { Environment, Level } from '@/db-common/enums'
import { hasAccessToEmissionFactors } from './environmentAdvanced'

describe('environmentAdvanced permissions', () => {
  describe('hasAccessToEmissionFactors', () => {
    it('forbids Count users from the emission-factor UI', () => {
      expect(hasAccessToEmissionFactors(Environment.CUT, Level.Advanced)).toBe(false)
    })
  })
})
