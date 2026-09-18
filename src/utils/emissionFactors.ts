import { wasteImpact } from '@/constants/emissions'
import { wasteEmissionFactors } from '@/constants/wasteEmissionFactors'
import type { EmissionFactor, Prisma } from '@/db-common'
import { Import, SubPost, Unit } from '@/db-common/enums'
import { hasWasteImpact } from '@/services/permissions/environment'
import { unique } from './array'

export const isWasteEmissionFactor = (emissionFactor: Pick<EmissionFactor, 'importedFrom' | 'importedId'>) =>
  hasWasteImpact() &&
  emissionFactor.importedFrom === Import.BaseEmpreinte &&
  !!emissionFactor.importedId &&
  !!wasteEmissionFactors[emissionFactor.importedId]

export const getEmissionFactorValue = (emissionFactor: {
  totalCo2: EmissionFactor['totalCo2']
  importedFrom?: EmissionFactor['importedFrom']
  importedId?: EmissionFactor['importedId']
}) => {
  if (emissionFactor.importedFrom && emissionFactor.importedId) {
    if (
      isWasteEmissionFactor({
        importedFrom: emissionFactor.importedFrom,
        importedId: emissionFactor.importedId,
      })
    ) {
      return wasteImpact
    }
  }

  return emissionFactor.totalCo2
}

export const emissionFactorDefautQualityStar = '☆'

export function getEmissionFactorFullName(
  metaData: { title?: string | null; attribute?: string | null; frontiere?: string | null } | null | undefined,
  valueIfMissing = '',
  importedFrom?: Import | null,
): string {
  if (!metaData) {
    return valueIfMissing
  }
  if (importedFrom === Import.Manual) {
    return metaData.title || valueIfMissing
  }
  return [metaData.title, metaData.attribute, metaData.frontiere].filter(Boolean).join(' - ') || valueIfMissing
}

export const ManualEmissionFactorUnitList: Unit[] = [
  Unit.PERCENT,
  Unit.GJ_PCI,
  Unit.GJ_PCS,
  Unit.GO,
  Unit.GWH,
  Unit.HA,
  Unit.HA_YEAR,
  Unit.HOUR,
  Unit.DAY,
  Unit.KG,
  Unit.KM,
  Unit.KWH,
  Unit.KWH_PCI,
  Unit.KWH_PCS,
  Unit.LITER,
  Unit.METER,
  Unit.M2,
  Unit.M3,
  Unit.PASSENGER_KM,
  Unit.TEP_PCI,
  Unit.TEP_PCS,
  Unit.TON,
  Unit.UNIT,
  Unit.VEHICLE_KM,
  Unit.EURO,
  Unit.DOLLAR,
  Unit.JPY,
  Unit.CNY,
  Unit.YEAR,
  Unit.CUSTOM,
]

export const isMonetaryEmissionFactor = (
  emissionFactor: Partial<Pick<Prisma.EmissionFactorCreateInput, 'unit' | 'customUnit' | 'isMonetary'>>,
) => (emissionFactor.customUnit && emissionFactor.isMonetary) || monetaryUnits.includes(emissionFactor.unit as Unit)

export const monetaryUnits: Unit[] = [
  Unit.DOLLAR,
  Unit.EURO,
  Unit.CNY,
  Unit.JPY,
  Unit.KEURO,
  Unit.KEURO_2019_HT,
  Unit.KEURO_2020_HT,
  Unit.KEURO_2021_HT,
  Unit.KEURO_2022_HT,
  Unit.KEURO_2023_HT,
  Unit.EURO_SPENT,
  Unit.FRANC_CFP,
]

const getEmissionFactorSubPostMap = (subPost: SubPost): SubPost[] => {
  return [subPost]
}

export const getEmissionFactorSubPostsMap = (subPosts: SubPost[]) =>
  unique(subPosts.reduce((res, subPost) => res.concat(getEmissionFactorSubPostMap(subPost)), [] as SubPost[]))
