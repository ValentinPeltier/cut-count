import { PUBLICODES_COUNT_VERSION, PUBLICODES_ENGINE_VERSION } from '@/constants/versions'
import {
  COUNT_GOLDEN_SITE_ID,
  COUNT_GOLDEN_STUDY_ID,
  COUNT_GOLDEN_STUDY_NAME,
  COUNT_GOLDEN_STUDY_SITE_ID,
} from '@/tests/fixtures/count/constants'
import { loadCountSituation } from '@/tests/fixtures/count/loadFixtures'
import { PrismaClient } from '@/generated/prisma/client'
import { Level, StudyRole, StudyResultUnit, UserStatus } from '@/generated/prisma/enums'
import type { Prisma } from '@/generated/prisma/client'

const richSituation = loadCountSituation('rich')

export const createCountGoldenStudy = async (prisma: PrismaClient) => {
  const cutAdmin = await prisma.user.findUnique({
    where: { email: 'cut-env-admin-0@yopmail.com' },
    include: {
      accounts: {
        where: { status: UserStatus.ACTIVE },
        include: { organizationVersion: true },
      },
    },
  })

  const cutAccount = cutAdmin?.accounts[0]
  if (!cutAccount?.organizationVersionId || !cutAccount.organizationVersion) {
    console.warn('Count golden study seed skipped: cut-env-admin-0 account not found')
    return
  }

  const organizationId = cutAccount.organizationVersion.organizationId

  await prisma.site.upsert({
    where: { id: COUNT_GOLDEN_SITE_ID },
    create: {
      id: COUNT_GOLDEN_SITE_ID,
      name: 'Count golden cinema',
      organizationId,
      etp: 10,
      ca: 1_000_000,
    },
    update: {
      name: 'Count golden cinema',
      organizationId,
    },
  })

  await prisma.study.upsert({
    where: { id: COUNT_GOLDEN_STUDY_ID },
    create: {
      id: COUNT_GOLDEN_STUDY_ID,
      name: COUNT_GOLDEN_STUDY_NAME,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      isPublic: true,
      level: Level.Initial,
      simplified: true,
      resultsUnit: StudyResultUnit.T,
      createdById: cutAccount.id,
      organizationVersionId: cutAccount.organizationVersionId,
      sites: {
        create: {
          id: COUNT_GOLDEN_STUDY_SITE_ID,
          siteId: COUNT_GOLDEN_SITE_ID,
          distanceToParis: 200,
          numberOfTickets: 50000,
          numberOfSessions: 1200,
          numberOfOpenDays: 365,
          etp: 10,
          ca: 1_000_000,
        },
      },
      allowedUsers: {
        create: { role: StudyRole.Validator, accountId: cutAccount.id },
      },
    },
    update: {
      name: COUNT_GOLDEN_STUDY_NAME,
      simplified: true,
      resultsUnit: StudyResultUnit.T,
    },
  })

  await prisma.situation.upsert({
    where: { studySiteId: COUNT_GOLDEN_STUDY_SITE_ID },
    create: {
      studySiteId: COUNT_GOLDEN_STUDY_SITE_ID,
      situation: richSituation as Prisma.InputJsonValue,
      listLayoutSituations: {},
      publicodesVersion: PUBLICODES_ENGINE_VERSION,
      modelVersion: PUBLICODES_COUNT_VERSION,
    },
    update: {
      situation: richSituation as Prisma.InputJsonValue,
      listLayoutSituations: {},
      modelVersion: PUBLICODES_COUNT_VERSION,
    },
  })
}

