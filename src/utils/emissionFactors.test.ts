import { Environment, Import, Unit } from '@/db-common/enums'
import { expect } from '@jest/globals'
import { getEmissionFactorValue, isMonetaryEmissionFactor, isWasteEmissionFactor } from './emissionFactors'

// TODO : remove these mocks. Should not be mocked but tests fail if not
jest.mock('../services/file', () => ({ download: jest.fn() }))
jest.mock('../services/auth', () => ({ auth: jest.fn() }))

jest.mock('../services/permissions/study', () => ({ canReadStudy: jest.fn() }))
jest.mock('./study', () => ({ getAccountRoleOnStudy: jest.fn() }))
jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(() => (key: string) => key),
}))

describe('emissionFactors utils function', () => {
  describe('getEmissionFactorValue', () => {
    test('should return FE value even for waste emission factors', () => {
      const emissionFactor = { importedFrom: Import.BaseEmpreinte, importedId: '34662', totalCo2: 123 }

      expect(getEmissionFactorValue(emissionFactor, Environment.CUT)).toBe(123)
    })

    test('should return FE value if FE is from base empreinte but is not in wasteEmissionFactors', () => {
      const emissionFactor = { importedFrom: Import.BaseEmpreinte, importedId: '456789789787', totalCo2: 123 }

      expect(getEmissionFactorValue(emissionFactor, Environment.CUT)).toBe(123)
    })
  })

  describe('isMonetaryEmissionfactor', () => {
    test('should return true if FE has custom unit and is flagged as monetary', () => {
      const emissionFactor = { customUnit: '€', isMonetary: true }
      const result = isMonetaryEmissionFactor(emissionFactor)
      expect(result).toBe(true)
    })

    test('should return true if FE has monetary unit', () => {
      const emissionFactor = { unit: Unit.EURO }
      const result = isMonetaryEmissionFactor(emissionFactor)
      expect(result).toBe(true)
    })

    test('should return false if FE is not monetary', () => {
      const emissionFactor = { unit: Unit.KG }
      const result = isMonetaryEmissionFactor(emissionFactor)
      expect(result).toBe(false)
    })
  })

  describe('isWasteEmissionFactor', () => {
    test('should return false for Count even when the factor is in wasteEmissionFactors', () => {
      const emissionFactor = { importedFrom: Import.BaseEmpreinte, importedId: '34662' }

      expect(isWasteEmissionFactor(emissionFactor, Environment.CUT)).toBe(false)
    })

    test('should return false if FE is from base empreinte but is not in wasteEmissionFactors', () => {
      const emissionFactor = { importedFrom: Import.BaseEmpreinte, importedId: '456789789787' }

      expect(isWasteEmissionFactor(emissionFactor, Environment.CUT)).toBe(false)
    })
  })
})
