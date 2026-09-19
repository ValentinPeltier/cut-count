import { EmissionFactor } from '@/generated/prisma/client'

export const qualityKeys = [
  'reliability',
  'technicalRepresentativeness',
  'geographicRepresentativeness',
  'temporalRepresentativeness',
  'completeness',
] as const

type Quality = Pick<EmissionFactor, (typeof qualityKeys)[number]>

const coeffs: Record<keyof Quality, number[]> = {
  reliability: [1.5, 1.2, 1.1, 1.05, 1],
  technicalRepresentativeness: [2, 1.5, 1.2, 1.1, 1],
  geographicRepresentativeness: [1.1, 1.05, 1.02, 1.01, 1],
  temporalRepresentativeness: [1.5, 1.2, 1.1, 1.03, 1],
  completeness: [1.2, 1.1, 1.05, 1.02, 1],
}

export const getSquaredStandardDeviationForQuality = (quality: Quality | null) => {
  const qualities = Object.entries(coeffs).map(([key, values]) => {
    const value = Number(quality?.[key as keyof Quality]) || 1
    return values[value - 1]
  })

  return Math.exp(Math.sqrt(qualities.reduce((acc, value) => acc + Math.pow(Math.log(value), 2), 0)))
}

export const uncertaintyValues = [1.1199, 1.2621, 1.6361, 2.5163]
export const getQualitativeUncertaintyFromSquaredStandardDeviation = (squaredStandardDeviation: number) => {
  if (squaredStandardDeviation < uncertaintyValues[0]) {
    return 5
  } else if (squaredStandardDeviation < uncertaintyValues[1]) {
    return 4
  } else if (squaredStandardDeviation < uncertaintyValues[2]) {
    return 3
  } else if (squaredStandardDeviation < uncertaintyValues[3]) {
    return 2
  }

  return 1
}

export const getQualitativeUncertaintyFromQuality = (quality: Quality) => {
  const squaredStandardDeviation = getSquaredStandardDeviationForQuality(quality)

  return getQualitativeUncertaintyFromSquaredStandardDeviation(squaredStandardDeviation)
}
