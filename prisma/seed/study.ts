import { PrismaClient } from '@/generated/prisma/client'
import { Import, Level, StudyRole } from '@/generated/prisma/enums'
import type { Account } from '@/generated/prisma/client'

const studyId = '91bb3826-2be7-4d56-bb9b-363f4d9af62f'

export const createRealStudy = async (prisma: PrismaClient, creator: Account) => {
  if (!creator.organizationVersionId) {
    return null
  }

  const creatorOrganizationVersion = await prisma.organizationVersion.findFirst({
    where: { id: creator.organizationVersionId },
    include: { organization: { include: { sites: true } } },
  })

  const site = creatorOrganizationVersion?.organization.sites[0]
  if (!site) {
    return null
  }

  await prisma.study.upsert({
    where: { id: studyId },
    update: {},
    create: {
      id: studyId,
      name: 'Count seed study',
      isPublic: true,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      level: Level.Initial,
      simplified: true,
      createdBy: { connect: { id: creator.id } },
      organizationVersion: { connect: { id: creator.organizationVersionId } },
      allowedUsers: {
        create: { accountId: creator.id, role: StudyRole.Validator },
      },
      sites: {
        create: {
          siteId: site.id,
          etp: site.etp,
          ca: site.ca,
        },
      },
    },
  })

  return studyId
}

export const addSourceToStudies = async (_source: Import) => undefined
