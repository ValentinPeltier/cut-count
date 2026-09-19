'use server'
import type { DeactivatableFeature, Prisma } from '@/generated/prisma/client'
import { UserSource } from '@/generated/prisma/enums'
import { prismaClient } from './client.server'

export type RestrictionsTypes = UserSource

export const isFeatureActive = async (feature: DeactivatableFeature) => {
  const featureStatus = await prismaClient.deactivatableFeatureStatus.findUnique({ where: { feature } })
  return !!featureStatus?.active
}

export const getFeaturesRestictions = async () =>
  prismaClient.deactivatableFeatureStatus.findMany({
    select: { feature: true, active: true, deactivatedSources: true },
    orderBy: { feature: 'asc' },
  })

export const getFeatureRestictions = async (feature: DeactivatableFeature) =>
  prismaClient.deactivatableFeatureStatus.findUnique({
    where: { feature },
    select: { active: true, deactivatedSources: true },
  })

export const updateFeatureRestictions = async (
  feature: DeactivatableFeature,
  target: 'deactivatedSources',
  value: RestrictionsTypes[],
) => prismaClient.deactivatableFeatureStatus.update({ where: { feature }, data: { [target]: value } })

export const createDeactivableFeatures = async (data: Prisma.DeactivatableFeatureStatusCreateManyInput[]) =>
  prismaClient.deactivatableFeatureStatus.createMany({ data })

export const createOrUpdateDeactivableFeature = async (
  feature: DeactivatableFeature,
  status: boolean,
  accountId: string,
) =>
  prismaClient.deactivatableFeatureStatus.upsert({
    where: { feature },
    create: { feature, active: status, updatedById: accountId },
    update: { active: status, updatedById: accountId },
  })
