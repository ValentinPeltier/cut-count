import { Environment, Level } from '@abc-transitionbascarbone/db-common/enums'
import { hasAccessToEmissionFactors } from './environmentAdvanced'

describe('environmentAdvanced permissions', () => {
  describe('hasAccessToEmissionFactors', () => {
    it('allows BC users', () => {
      expect(hasAccessToEmissionFactors(Environment.BC, null)).toBe(true)
    })

    it('forbids CUT users', () => {
      expect(hasAccessToEmissionFactors(Environment.CUT, Level.Advanced)).toBe(false)
    })
  })
})
