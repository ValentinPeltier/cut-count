import { isSourceForEnv } from '@/services/importEmissionFactor/import'
import { hasAccessToCreateStudyWithEmissionFactorVersions } from '@/services/permissions/environment'
import { filterAllowedStudies } from '@/services/permissions/study'
import { ChangeStudyCinemaCommand } from '@/services/serverFunctions/study.command'
import { mapCncToStudySite } from '@/utils/cnc'
import { isAdminOnOrga } from '@/utils/organization'
import { getAllowedLevels, getUserRoleOnPublicStudy, hasSufficientLevel, StudyWithRoleFields } from '@/utils/study'
import { isAdmin } from '@/utils/user'
import type { Level, Prisma } from '@abc-transitionbascarbone/db-common'
import { Environment, Import, StudyRole } from '@abc-transitionbascarbone/db-common/enums'
import { getEnvVar } from '@abc-transitionbascarbone/lib/environment'
import { UserSession } from 'next-auth'
import { cache } from 'react'
import { getAccountOrganizationVersions } from './account'
import { prismaClient } from './client.server'

export const createStudy = async (
  data: Prisma.StudyCreateInput,
  environment: Environment,
  shouldCreateFEVersions = true,
  tx?: Prisma.TransactionClient,
) => {
  const client = tx ?? prismaClient
  const dbStudy = await client.study.create({
    data,
    select: {
      id: true,
      sites: {
        select: {
          id: true,
          etp: true,
          distanceToParis: true,
          numberOfTickets: true,
          numberOfSessions: true,
          numberOfOpenDays: true,
        },
      },
      simplified: true,
    },
  })

  if (hasAccessToCreateStudyWithEmissionFactorVersions(environment) || shouldCreateFEVersions) {
    const studyEmissionFactorVersions = (await getSourceCutImportVersionIds()).map((importVersion) => ({
      studyId: dbStudy.id,
      source: importVersion.source,
      importVersionId: importVersion.id,
    }))
    await client.studyEmissionFactorVersion.createMany({ data: studyEmissionFactorVersions })
  }
  return dbStudy
}

const fullStudyInclude = {
  allowedUsers: {
    select: {
      accountId: true,
      createdAt: true,
      account: {
        select: {
          id: true,
          organizationVersionId: true,
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              level: true,
            },
          },
        },
      },
      role: true,
    },
    orderBy: { account: { user: { email: 'asc' } } },
  },
  sites: {
    select: {
      id: true,
      etp: true,
      ca: true,
      openingHours: true,
      numberOfOpenDays: true,
      numberOfSessions: true,
      numberOfTickets: true,
      distanceToParis: true,
      site: {
        select: {
          id: true,
          name: true,
          postalCode: true,
          city: true,
          address: true,
          etp: true,
          cnc: {
            select: {
              id: true,
              numberOfProgrammedFilms: true,
              ecrans: true,
              fauteuils: true,
            },
          },
        },
      },
      cncVersion: {
        select: {
          id: true,
          year: true,
        },
      },
    },
  },
  emissionFactorVersions: {
    select: {
      id: true,
      importVersionId: true,
      source: true,
      importVersion: {
        select: {
          name: true,
          source: true,
          id: true,
        },
      },
    },
  },
  organizationVersion: {
    select: {
      id: true,
      isCR: true,
      parentId: true,
      parent: {
        select: { id: true },
      },
      environment: true,
      organization: {
        select: {
          id: true,
          name: true,
          wordpressId: true,
        },
      },
    },
  },
} satisfies Prisma.StudyInclude

const normalizeAllowedUsers = (
  allowedUsers: Prisma.StudyGetPayload<{ include: typeof fullStudyInclude }>['allowedUsers'],
  studyLevel: Level,
  organizationVersionId: string | null,
) =>
  allowedUsers.map((allowedUser) => {
    const readerOnly =
      !allowedUser.account.organizationVersionId || !hasSufficientLevel(allowedUser.account.user.level, studyLevel)
    return organizationVersionId && allowedUser.account.organizationVersionId === organizationVersionId
      ? { ...allowedUser, account: { ...allowedUser.account, readerOnly } }
      : {
          ...allowedUser,
          account: {
            ...allowedUser.account,
            organizationVersionId: undefined,
            level: undefined,
            readerOnly,
          },
        }
  })

export const getOrganizationVersionStudiesOrderedByStartDate = async (
  organizationVersionId: string,
  displaySimplifiedStudies: boolean,
) => {
  const studies = await prismaClient.study.findMany({
    where: {
      organizationVersionId,
      simplified: displaySimplifiedStudies ? undefined : false,
    },
    include: fullStudyInclude,
    orderBy: { startDate: 'desc' },
  })
  return studies.map((study) => ({
    ...study,
    allowedUsers: normalizeAllowedUsers(study.allowedUsers, study.level, organizationVersionId),
  }))
}

export const getAllowedStudiesByAccount = async (user: UserSession) => {
  const accountOrganizationVersions = await getAccountOrganizationVersions(user.accountId)

  const studies = await prismaClient.study.findMany({
    where: {
      OR: [
        {
          AND: [
            {
              organizationVersionId: {
                in: accountOrganizationVersions.map((organizationVersion) => organizationVersion.id),
              },
            },
            ...(isAdmin(user.role) ? [] : [{ isPublic: true, level: { in: getAllowedLevels(user.level) } }]),
          ],
        },
        { allowedUsers: { some: { accountId: user.accountId } } },
      ],
    },
  })
  return filterAllowedStudies(user, studies)
}

export const getExternalAllowedStudiesByUser = async (user: UserSession) => {
  const userOrganizationVersions = await getAccountOrganizationVersions(user.accountId)
  const studies = await prismaClient.study.findMany({
    where: {
      AND: [
        {
          organizationVersionId: {
            notIn: userOrganizationVersions.map((organizationVersion) => organizationVersion.id),
          },
        },
        { allowedUsers: { some: { accountId: user.accountId } } },
      ],
    },
  })
  return filterAllowedStudies(user, studies)
}

export const getAllowedStudiesByAccountIdAndOrganizationId = async (organizationVersionIds: string[]) => {
  return prismaClient.study.findMany({
    select: {
      id: true,
      name: true,
      allowedUsers: true,
      organizationVersionId: true,
      organizationVersion: { select: { organization: { select: { name: true } } } },
    },
    where: {
      organizationVersionId: { in: organizationVersionIds },
    },
  })
}

export const getAllowedStudyIdByAccount = async (account: UserSession) => {
  const organizationVersionIds = (await getAccountOrganizationVersions(account.accountId)).map(
    (organizationVersion) => organizationVersion.id,
  )
  const isAllowedOnPublicStudies =
    account.level && getUserRoleOnPublicStudy(account, account.level) !== StudyRole.Reader
  const study = await prismaClient.study.findFirst({
    where: {
      OR: [
        { allowedUsers: { some: { accountId: account.id, role: { notIn: [StudyRole.Reader] } } } },
        ...(isAllowedOnPublicStudies
          ? [
              {
                AND: [
                  { organizationVersionId: { in: organizationVersionIds } },
                  ...(isAdmin(account.role)
                    ? []
                    : [{ isPublic: true, level: { in: getAllowedLevels(account.level) } }]),
                ],
              },
            ]
          : []),
      ],
    },
    orderBy: { createdAt: 'desc' },
  })
  return study?.id
}

export const getAllowedStudiesByUserAndOrganization = async (
  user: UserSession,
  organizationVersionId: string,
  simplified = false,
) => {
  const organizationVersion = await prismaClient.organizationVersion.findUnique({
    where: { id: organizationVersionId },
    select: {
      id: true,
      environment: true,
      parentId: true,
    },
  })
  if (!organizationVersion) {
    return []
  }

  if (!user.organizationVersionId) {
    return []
  }
  const childOrganizations = await prismaClient.organizationVersion.findMany({
    where: { parentId: user.organizationVersionId },
    select: { id: true },
  })

  const studies = await prismaClient.study.findMany({
    where: {
      organizationVersionId,
      simplified,
      ...(isAdminOnOrga(user, organizationVersion)
        ? {}
        : {
            OR: [
              { allowedUsers: { some: { accountId: user.accountId } } },
              { isPublic: true, organizationVersionId: user.organizationVersionId as string },
              {
                isPublic: true,
                organizationVersionId: {
                  in: childOrganizations.map((childOrganization) => childOrganization.id),
                },
              },
            ],
          }),
    },
  })
  return filterAllowedStudies(user, studies)
}

const fetchStudyById = cache(async (id: string) => {
  return prismaClient.study.findUnique({
    where: { id },
    include: fullStudyInclude,
  })
})

export const getStudyAllowedUsersUnfiltered = async (studyId: string) => {
  const study = await prismaClient.study.findUnique({
    where: { id: studyId },
    include: { allowedUsers: fullStudyInclude.allowedUsers },
  })
  return study ? normalizeAllowedUsers(study.allowedUsers, study.level, study.organizationVersionId) : []
}

export const getStudyById = async (id: string, organizationVersionId: string | null, tx?: Prisma.TransactionClient) => {
  const study = tx ? await tx.study.findUnique({ where: { id }, include: fullStudyInclude }) : await fetchStudyById(id)
  if (!study) {
    return null
  }
  return { ...study, allowedUsers: normalizeAllowedUsers(study.allowedUsers, study.level, organizationVersionId) }
}

type StudyForNavbar = StudyWithRoleFields & {
  name: string
  simplified: boolean
}

export const getStudyForNavbar = async (id: string): Promise<StudyForNavbar | null> => {
  return prismaClient.study.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      simplified: true,
      level: true,
      isPublic: true,
      organizationVersion: {
        select: {
          id: true,
          parentId: true,
          environment: true,
        },
      },
      allowedUsers: {
        select: {
          role: true,
          account: { select: { id: true, user: { select: { email: true } } } },
        },
      },
    },
  })
}

export const getStudyOrganizationVersion = async (id: string) => {
  const study = await prismaClient.study.findUnique({
    where: { id },
    select: { organizationVersion: { select: { id: true, parentId: true } } },
  })
  return study?.organizationVersion ?? null
}

export const getStudiesForCards = async (ids: string[]) => {
  const studies = await prismaClient.study.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      name: true,
      simplified: true,
      level: true,
      isPublic: true,
      allowedUsers: {
        select: {
          role: true,
          account: { select: { id: true, user: { select: { email: true } } } },
        },
      },
      organizationVersion: {
        select: {
          id: true,
          parentId: true,
          environment: true,
        },
      },
    },
  })
  return Object.fromEntries(studies.map((study) => [study.id, study]))
}

type StudiesForCardsMap = AsyncReturnType<typeof getStudiesForCards>

export type StudyCardItem = StudiesForCardsMap[string]

export const getStudyByIds = async (ids: string[]) => {
  const studies = await prismaClient.study.findMany({
    where: { id: { in: ids } },
    include: fullStudyInclude,
  })
  return studies.map((study) => ({
    ...study,
    allowedUsers: normalizeAllowedUsers(study.allowedUsers, study.level, null),
  }))
}
export type FullStudy = Exclude<AsyncReturnType<typeof getStudyById>, null>

export const getStudyNameById = async (id: string) => {
  const study = await prismaClient.study.findUnique({
    where: { id },
    select: { name: true },
  })
  if (!study) {
    return null
  }
  return study.name
}

export const getStudyStartDate = async (id: string) => {
  const study = await prismaClient.study.findUnique({
    where: { id },
    select: { startDate: true },
  })

  if (!study) {
    return null
  }

  return study.startDate
}

export const createUserOnStudy = async (right: Prisma.UserOnStudyCreateInput, tx?: Prisma.TransactionClient) =>
  (tx ?? prismaClient).userOnStudy.create({
    data: right,
  })

export const updateUserOnStudy = (accountId: string, studyId: string, role: StudyRole) =>
  prismaClient.userOnStudy.update({
    where: {
      studyId_accountId: {
        accountId,
        studyId,
      },
    },
    data: {
      role,
    },
  })

export const getUsersOnStudy = async (studyId: string) => prismaClient.userOnStudy.findMany({ where: { studyId } })

export const deleteAccountOnStudy = async (studyId: string, accountId: string) =>
  prismaClient.userOnStudy.delete({
    where: { studyId_accountId: { studyId, accountId } },
  })

export const getUsersLevel = async (userIds: string[]) =>
  prismaClient.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, level: true },
  })

export const updateStudy = (id: string, data: Prisma.StudyUpdateInput) =>
  prismaClient.study.update({ where: { id }, data })

export const downgradeStudyUserRoles = (studyId: string, accountIds: string[]) =>
  prismaClient.userOnStudy.updateMany({
    where: { studyId, accountId: { in: accountIds } },
    data: { role: StudyRole.Reader },
  })

export const getStudySites = (studyId: string) => prismaClient.studySite.findMany({ where: { studyId } })

export const updateStudySiteData = async (studySiteId: string, data: Prisma.StudySiteUpdateInput) => {
  return prismaClient.studySite.update({
    where: { id: studySiteId },
    data,
  })
}

export const updateStudySites = async (
  studyId: string,
  newStudySites: Prisma.StudySiteCreateManyInput[],
  deletedSiteIds: string[],
) => {
  return prismaClient.$transaction(async (transaction) => {
    const promises = []
    if (deletedSiteIds.length) {
      promises.push(transaction.studySite.deleteMany({ where: { id: { in: deletedSiteIds }, studyId } }))
    }
    if (newStudySites.length) {
      const siteIds = newStudySites.map((site) => site.siteId)
      const sitesWithCNC = await transaction.site.findMany({
        where: { id: { in: siteIds } },
        include: {
          cnc: {
            select: {
              seances: true,
              entrees2024: true,
              entrees2023: true,
              semainesActivite: true,
              latitude: true,
              longitude: true,
            },
          },
        },
      })

      newStudySites.forEach((studySite) => {
        const siteWithCNC = sitesWithCNC.find((s) => s.id === studySite.siteId)
        const cncData = siteWithCNC?.cnc

        const enhancedStudySite = { ...studySite }

        if (cncData) {
          Object.assign(enhancedStudySite, mapCncToStudySite(cncData, enhancedStudySite))
        }

        promises.push(
          transaction.studySite.upsert({
            where: { studyId_siteId: { studyId, siteId: studySite.siteId } },
            update: {
              ca: studySite.ca,
              etp: studySite.etp,
            },
            create: enhancedStudySite,
          }),
        )
      })
    }

    return Promise.all(promises)
  })
}

export const updateStudyEmissionFactorVersion = async (
  studyId: string,
  source: Import,
  importVersionId?: string,
  tx?: Prisma.TransactionClient,
) =>
  (tx ?? prismaClient).studyEmissionFactorVersion.update({
    where: { studyId_source: { studyId, source } },
    data: { importVersionId },
  })

export const deleteStudy = async (id: string) => {
  return prismaClient.$transaction(async (transaction) => {
    const studySites = await getStudySites(id)

    await Promise.all([
      transaction.userOnStudy.deleteMany({ where: { studyId: id } }),
      ...studySites.map((studySite) => transaction.openingHours.deleteMany({ where: { studySiteId: studySite.id } })),
      transaction.studySite.deleteMany({ where: { studyId: id } }),
      transaction.studyEmissionFactorVersion.deleteMany({ where: { studyId: id } }),
    ])
    await transaction.study.delete({ where: { id } })
  })
}

export const getStudiesSitesFromIds = async (siteIds: string[]) =>
  prismaClient.studySite.findMany({
    where: {
      id: {
        in: siteIds,
      },
    },
    include: {
      study: {
        select: {
          id: true,
          name: true,
          isPublic: true,
          level: true,
          allowedUsers: { select: { accountId: true } },
          organizationVersionId: true,
          simplified: true,
          organizationVersion: {
            select: {
              id: true,
              isCR: true,
              parentId: true,
              organization: {
                select: { id: true },
              },
            },
          },
        },
      },
      site: {
        select: {
          name: true,
          organization: {
            select: {
              id: true,
              name: true,
              organizationVersions: {
                select: {
                  isCR: true,
                },
              },
            },
          },
          cnc: {
            select: {
              id: true,
              numberOfProgrammedFilms: true,
              latitude: true,
              longitude: true,
              seances: true,
              entrees2024: true,
              entrees2023: true,
              semainesActivite: true,
            },
          },
        },
      },
      cncVersion: {
        select: {
          id: true,
          year: true,
        },
      },
      situation: true,
    },
  })

export const getSourceCutImportVersionIds = async () => {
  const cutFeLegifrance = (await getEnvVar('FE_LEGIFRANCE_VERSION', Environment.CUT)) || ''
  const cutFeBaseEmpreinte = (await getEnvVar('FE_BASE_EMPREINTE_VERSION', Environment.CUT)) || ''
  return prismaClient.emissionFactorImportVersion.findMany({
    select: { id: true, source: true },
    where: {
      OR: [
        { source: Import.CUT },
        { name: cutFeLegifrance, source: Import.Legifrance },
        { name: cutFeBaseEmpreinte, source: Import.BaseEmpreinte },
      ],
    },
    orderBy: { createdAt: 'desc' },
    distinct: ['source'],
  })
}

export const getSourceEnvironmentImportVersionIds = async (
  environment: Environment,
): Promise<{ id: string; source: Import }[]> => {
  const sources = await isSourceForEnv(environment)
  return prismaClient.emissionFactorImportVersion.findMany({
    select: { id: true, source: true },
    where: {
      source: { in: sources },
    },
    orderBy: { createdAt: 'desc' },
    distinct: ['source'],
  })
}

export const getSourcesLatestImportVersionId = async (sources: Import[]) =>
  prismaClient.emissionFactorImportVersion.findMany({
    select: { id: true, source: true },
    where: { source: { in: sources } },
    orderBy: { createdAt: 'desc' },
    distinct: ['source'],
  })

export const getSourceLatestImportVersionId = async (source: Import, transaction?: Prisma.TransactionClient) =>
  (transaction || prismaClient).emissionFactorImportVersion.findFirst({
    select: { id: true, source: true },
    where: { source },
    orderBy: { createdAt: 'desc' },
  })

export const countOrganizationStudiesFromOtherUsers = async (organizationVersionId: string, accountId: string) =>
  prismaClient.study.count({ where: { organizationVersionId, createdById: { not: accountId } } })

export const updateStudyOpeningHours = async (
  studySiteId: string,
  openingHours: ChangeStudyCinemaCommand['openingHours'],
  openingHoursHoliday: ChangeStudyCinemaCommand['openingHoursHoliday'],
) => {
  await prismaClient.$transaction(async (prisma) => {
    const existingOpeningHours = await prisma.openingHours.findMany({
      where: { studySiteId },
      select: { id: true },
    })
    const mergedOpeningHours = [...Object.values(openingHours || {}), ...Object.values(openingHoursHoliday || {})]

    const existingIds = new Set(existingOpeningHours.map((openingHour) => openingHour.id))
    const updateIds = new Set(mergedOpeningHours.map((openingHour) => openingHour.id))

    const openingHourIdsToDelete = [...existingIds].filter((id) => !updateIds.has(id))

    if (openingHourIdsToDelete.length > 0) {
      await prisma.openingHours.deleteMany({
        where: { id: { in: openingHourIdsToDelete } },
      })
    }

    await Promise.all(
      mergedOpeningHours
        .map((openingHour) => {
          if (!openingHour.id) {
            return prisma.openingHours.create({
              data: {
                ...openingHour,
                studySite: { connect: { id: studySiteId } },
              },
            })
          }

          return prisma.openingHours.update({
            where: { id: openingHour.id },
            data: openingHour,
          })
        })
        .filter((promise) => promise !== undefined),
    )
  })
}

export const deleteStudyMemberFromOrganization = async (accountId: string, organizationVersionIds: string[]) => {
  const studies = await getAllowedStudiesByAccountIdAndOrganizationId(organizationVersionIds)
  return prismaClient.userOnStudy.deleteMany({
    where: { accountId, studyId: { in: studies.map((study) => study.id) } },
  })
}

export const getOrganizationStudiesBeforeDate = (organizationVersionId: string, date: Date) =>
  prismaClient.study.findMany({
    select: { id: true, name: true },
    where: { organizationVersionId, startDate: { lt: date } },
  })

export const addSourceToStudy = async (source: Import, studyId: string) => {
  const [study, importVersion] = await Promise.all([
    prismaClient.study.findFirst({
      where: { id: studyId },
      select: {
        id: true,
        organizationVersion: {
          select: { environment: true },
        },
      },
    }),
    getSourceLatestImportVersionId(source),
  ])

  if (study && !!importVersion && (await isSourceForEnv(study.organizationVersion.environment)).includes(source)) {
    await prismaClient.studyEmissionFactorVersion.createMany({
      data: { studyId: study.id, source, importVersionId: importVersion.id },
      skipDuplicates: true,
    })
  }
}

export const removeSourceToStudy = async (source: Import, studyId: string) =>
  prismaClient.studyEmissionFactorVersion.deleteMany({
    where: { studyId, source },
  })

export const removeSourceToAllStudies = async (source: Import) => {
  await prismaClient.studyEmissionFactorVersion.deleteMany({
    where: { source },
  })
}
