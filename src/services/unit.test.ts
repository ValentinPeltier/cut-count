import { Unit } from '@/db-common/enums'
import { CUTUnit, OldUnit } from './unit'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

describe('Unit service', () => {
  describe('CUT units are defined in the Unit enum', () => {
    const cutUnits = { ...CUTUnit, ...OldUnit }

    for (const unit of Object.values(cutUnits)) {
      it(`should have unit ${unit} in Unit enum`, () => {
        expect(Object.values(Unit)).toContain(unit)
      })
    }
  })
})
