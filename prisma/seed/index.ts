import type { Account, User } from '@/generated/prisma/client'
import { PrismaClient } from '@/generated/prisma/client'
import {
  EmissionFactorBase,
  EmissionFactorStatus,
  Import,
  Level,
  Role,
  StudyRole,
  SubPost,
  Unit,
  UserStatus,
} from '@/generated/prisma/enums'
import { signPassword } from '@/lib/utils/auth'
import { getAllowedLevels } from '@/utils/study'
import { faker } from '@faker-js/faker'
import { PrismaPg } from '@prisma/adapter-pg'

import { Command } from 'commander'
import { createCountGoldenStudy } from './countGoldenStudy'
import { createRealStudy } from './study'

const program = new Command()

/** Roles used by Count accounts. */
const CUT_SEED_ROLES = [Role.ADMIN, Role.DEFAULT] as const

type userAndAccountsAndOrganizationVersion = {
  user: User
  accounts: {
    account: Account
    organizationVersion: { organizationId: string | null }
  }[]
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
}) as PrismaClient

const users = async () => {
  await prisma.emissionFactorPartMetaData.deleteMany()
  await prisma.emissionFactorPart.deleteMany()
  await prisma.emissionFactorMetaData.deleteMany()
  await prisma.emissionFactorVersion.deleteMany()
  await prisma.emissionFactor.deleteMany()

  await prisma.userOnStudy.deleteMany()
  await prisma.studyEmissionFactorVersion.deleteMany()

  await prisma.openingHours.deleteMany()
  await prisma.situation.deleteMany()
  await prisma.studySite.deleteMany()
  await prisma.study.deleteMany()

  await prisma.emissionFactorImportVersion.deleteMany()

  await prisma.site.deleteMany()
  await prisma.userApplicationSettings.deleteMany()
  await prisma.account.deleteMany()

  await prisma.user.deleteMany()

  await prisma.organizationVersion.deleteMany()
  await prisma.organization.deleteMany()

  await prisma.cnc.deleteMany()

  await prisma.cnc.create({
    data: {
      cncCode: '1321',
      nom: 'PATHE',
      codeInsee: '75102',
      commune: 'Paris 2e Arrondissement',
      ecrans: 21,
    },
  })

  const unOnboardedOrganization = await prisma.organization.create({
    data: {
      name: faker.company.name(),
      wordpressId: faker.finance.accountNumber(14),
    },
  })

  const unOnboardedOrganizationVersion = await prisma.organizationVersion.create({
    data: {
      isCR: false,
      onboarded: false,
      organizationId: unOnboardedOrganization.id,
    },
  })

  const onboardingPassword = await signPassword('onboarding1234')
  const onboarding = await prisma.user.create({
    data: {
      email: 'onboarding@yopmail.com',
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: onboardingPassword,
      level: Level.Initial,
    },
  })

  await prisma.account.create({
    data: {
      organizationVersionId: unOnboardedOrganizationVersion.id,
      role: Role.DEFAULT,
      userId: onboarding.id,
      status: UserStatus.IMPORTED,
    },
  })
  const onboardingNotTrained = await prisma.user.create({
    data: {
      email: 'onboardingnottrained@yopmail.com',
      password: onboardingPassword,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    },
  })

  await prisma.account.create({
    data: {
      organizationVersionId: unOnboardedOrganizationVersion.id,
      role: Role.DEFAULT,
      userId: onboardingNotTrained.id,
      status: UserStatus.IMPORTED,
    },
  })

  const clientLessOrganization = await prisma.organization.create({
    data: {
      name: faker.company.name(),
      wordpressId: faker.finance.accountNumber(14),
    },
  })

  const clientLessOrganizationVersion = await prisma.organizationVersion.create({
    data: {
      isCR: true,
      onboarded: true,
      organizationId: clientLessOrganization.id,
    },
  })

  const clientLessUser = await prisma.user.create({
    data: {
      email: 'clientless@yopmail.com',
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: await signPassword(`client1234`),
      level: Level.Initial,
    },
  })

  await prisma.account.create({
    data: {
      organizationVersionId: clientLessOrganizationVersion.id,
      role: Role.DEFAULT,
      userId: clientLessUser.id,
      status: UserStatus.ACTIVE,
    },
  })

  const organizationVersionCutSignup = await prisma.organizationVersion.create({
    data: {
      organizationId: (
        await prisma.organization.create({
          data: {
            name: faker.company.name(),
            wordpressId: '1234567891234',
          },
        })
      ).id,
    },
  })

  await prisma.account.create({
    data: {
      organizationVersionId: organizationVersionCutSignup.id,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      userId: (
        await prisma.user.create({
          data: {
            email: 'cut-admin-test@yopmail.com',
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            password: await signPassword('password'),
          },
        })
      ).id,
    },
  })

  const organizations = await prisma.organization.createManyAndReturn({
    data: Array.from({ length: 10 }).map(() => ({
      name: faker.company.name(),
      wordpressId: faker.finance.accountNumber(14),
    })),
  })

  const organizationVersions = await prisma.organizationVersion.createManyAndReturn({
    data: organizations.map((organization, index) => ({
      organizationId: organization.id,
      isCR: index % 2 === 1,
      onboarded: true,
    })),
  })

  const crOrganizationVersions = organizationVersions.filter((organization) => organization.isCR)
  const regularOrganizationVersions = organizationVersions.filter((organization) => !organization.isCR)

  const cutOrganizationVersions = regularOrganizationVersions

  const childOrganizations = await prisma.organization.createManyAndReturn({
    data: Array.from({ length: 50 }).map(() => ({
      name: faker.company.name(),
    })),
  })

  await Promise.all([
    prisma.emissionFactor.create({
      data: {
        importedFrom: Import.Manual,
        status: EmissionFactorStatus.Valid,
        totalCo2: 111,
        completeness: 4,
        reliability: 5,
        technicalRepresentativeness: 5,
        temporalRepresentativeness: 5,
        importedId: '1',
        unit: Unit.KG,
        isMonetary: false,
        subPosts: [SubPost.Achats],
        metaData: {
          create: {
            language: 'fr',
            title: 'FE Test 1',
          },
        },
      },
    }),
    prisma.emissionFactor.create({
      data: {
        importedFrom: Import.Manual,
        status: EmissionFactorStatus.Valid,
        totalCo2: 123,
        geographicRepresentativeness: 3,
        completeness: 1,
        reliability: 5,
        technicalRepresentativeness: 5,
        temporalRepresentativeness: 5,
        importedId: '2',
        unit: Unit.KG_DRY_MATTER,
        isMonetary: false,
        subPosts: [SubPost.Achats],
        metaData: {
          create: {
            language: 'fr',
            title: 'FE Test 2',
          },
        },
      },
    }),
    prisma.emissionFactor.create({
      data: {
        importedFrom: Import.Manual,
        status: EmissionFactorStatus.Archived,
        totalCo2: 42,
        geographicRepresentativeness: 4,
        technicalRepresentativeness: 5,
        temporalRepresentativeness: 5,
        completeness: 2,
        reliability: 3,
        importedId: '3',
        unit: Unit.CAR_KM,
        isMonetary: false,
        subPosts: [SubPost.Achats],
        organizationId: regularOrganizationVersions[0]?.organizationId,
        metaData: {
          create: {
            language: 'fr',
            title: 'FE Test Archived',
          },
        },
      },
    }),
  ])

  await prisma.organizationVersion.createManyAndReturn({
    data: childOrganizations.map((childOrganization) => ({
      parentId: faker.helpers.arrayElement(crOrganizationVersions).id,
      organizationId: childOrganization.id,
      isCR: false,
      onboarded: true,
    })),
  })

  const cncRecord = await prisma.cnc.findUnique({ where: { cncCode: '1321' } })

  const sites = await prisma.site.createManyAndReturn({
    data: [...organizations, ...childOrganizations].flatMap((organization) => {
      const sitesNumber = faker.number.int({ min: 1, max: 5 })
      return Array.from({ length: sitesNumber }).map(() => ({
        name: faker.commerce.department(),
        etp: faker.number.int({ min: 1, max: 100 }),
        ca: Math.round(faker.number.float({ min: 100_000, max: 1_000_000_000 })) / 100,
        organizationId: organization.id,
      }))
    }),
  })

  if (cncRecord) {
    const cutOrganizationIds = organizationVersions.map((orgVersion) => orgVersion.organizationId)
    const cutSites = sites.filter((site) => cutOrganizationIds.includes(site.organizationId))

    await Promise.all(
      cutSites.map((site) =>
        prisma.site.update({
          where: { id: site.id },
          data: { cncId: cncRecord.id },
        }),
      ),
    )
  }

  const levels = Object.keys(Level)

  const toUserWithAccounts = async (
    email: string,
    role: Role,
    organizationVersionId: string,
    level: Level,
    passwordIndex: number,
  ): Promise<userAndAccountsAndOrganizationVersion> => {
    const user = await prisma.user.create({
      data: {
        email,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: await signPassword(`password-${passwordIndex}`),
        level,
      },
    })
    const account = await prisma.account.create({
      data: {
        organizationVersionId,
        role,
        userId: user.id,
        status: UserStatus.ACTIVE,
      },
    })
    if (!account.organizationVersionId) {
      return { user, accounts: [{ account, organizationVersion: { organizationId: null } }] }
    }
    const organizationVersion = await prisma.organizationVersion.findFirst({
      where: { id: account.organizationVersionId },
    })
    if (!organizationVersion) {
      return { user, accounts: [{ account, organizationVersion: { organizationId: null } }] }
    }
    return { user, accounts: [{ account, organizationVersion }] }
  }

  const usersWithAccounts = await Promise.all([
    ...CUT_SEED_ROLES.flatMap((role) =>
      Array.from({ length: 2 }).map((_, index) =>
        toUserWithAccounts(
          `${role.toLocaleLowerCase()}-${index}@yopmail.com`,
          role,
          cutOrganizationVersions[index % cutOrganizationVersions.length].id,
          levels[index % levels.length] as Level,
          index,
        ),
      ),
    ),
    ...CUT_SEED_ROLES.flatMap((role) =>
      Array.from({ length: 2 }).map((_, index) =>
        toUserWithAccounts(
          `cr-${role.toLocaleLowerCase()}-${index}@yopmail.com`,
          role,
          crOrganizationVersions[index % crOrganizationVersions.length].id,
          levels[index % levels.length] as Level,
          index,
        ),
      ),
    ),
  ])

  await prisma.account.create({
    data: {
      organizationVersionId: regularOrganizationVersions[1].id,
      role: Role.DEFAULT,
      status: UserStatus.ACTIVE,
      userId: (
        await prisma.user.create({
          data: {
            email: 'untrained@yopmail.com',
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            password: await signPassword('password'),
          },
        })
      ).id,
    },
  })

  await prisma.user
    .create({
      data: {
        email: 'imported@yopmail.com',
        firstName: 'User',
        lastName: 'Imported',
        level: Level.Initial,
      },
    })
    .then(async (user) => {
      await prisma.account.create({
        data: {
          organizationVersionId: regularOrganizationVersions[0].id,
          role: Role.DEFAULT,
          userId: user.id,
          status: UserStatus.IMPORTED,
        },
      })
    })

  const creator = faker.helpers.arrayElement(
    usersWithAccounts.filter((userWithAccount) => userWithAccount.accounts[0].account.status === UserStatus.ACTIVE),
  )
  const studies = await Promise.all(
    Array.from({ length: 20 }).map(() => {
      const organizationVersionSites = sites.filter(
        (site) => site.organizationId === creator.accounts[0].organizationVersion.organizationId,
      )
      return prisma.study.create({
        include: { sites: true },
        data: {
          createdById: creator.accounts[0].account.id,
          startDate: new Date(),
          endDate: faker.date.future(),
          isPublic: faker.datatype.boolean(),
          level: faker.helpers.arrayElement(getAllowedLevels(creator.user.level)),
          name: faker.lorem.words({ min: 2, max: 5 }),
          organizationVersionId: creator.accounts[0].account.organizationVersionId as string,
          sites: {
            createMany: {
              data: faker.helpers
                .arrayElements(organizationVersionSites, { min: 1, max: organizationVersionSites.length })
                .map((site) => ({
                  siteId: site.id,
                  etp: faker.helpers.maybe(() => faker.number.int({ min: 1, max: 100 })) || site.etp,
                  ca:
                    faker.helpers.maybe(
                      () => Math.round(faker.number.float({ min: 100_000, max: 1_000_000_000 })) / 100,
                    ) || site.ca,
                })),
            },
          },
          allowedUsers: {
            create: { role: StudyRole.Validator, accountId: creator.accounts[0].account.id },
          },
        },
      })
    }),
  )

  const defaultUserWithAccount = usersWithAccounts.find(
    (userWithAccount) => userWithAccount.user.email === 'default-0@yopmail.com',
  ) as userAndAccountsAndOrganizationVersion
  const readerWithAccount = usersWithAccounts.find(
    (userWithAccount) => userWithAccount.user.email === 'default-1@yopmail.com',
  ) as userAndAccountsAndOrganizationVersion
  const editorWithAccount = usersWithAccounts.find(
    (userWithAccount) => userWithAccount.user.email === 'admin-1@yopmail.com',
  ) as userAndAccountsAndOrganizationVersion

  if (!defaultUserWithAccount.accounts[0].account.organizationVersionId) {
    return null
  }
  const defaultUserWithAccountOrganizationVersion = await prisma.organizationVersion.findFirst({
    where: { id: defaultUserWithAccount.accounts[0].account.organizationVersionId },
  })
  if (!defaultUserWithAccountOrganizationVersion) {
    return null
  }
  const organizationVersionSites = sites.filter(
    (site) => site.organizationId === defaultUserWithAccountOrganizationVersion.organizationId,
  )

  const cutAdminWithAccount = usersWithAccounts.find(
    (userWithAccount) => userWithAccount.user.email === 'admin-0@yopmail.com',
  ) as userAndAccountsAndOrganizationVersion
  const cutAdminAccount = cutAdminWithAccount.accounts[0]
  const cutAdminSites = sites.filter(
    (site) => site.organizationId === cutAdminAccount.organizationVersion.organizationId,
  )

  // e2e emission factor
  await prisma.emissionFactor.create({
    data: {
      importedFrom: Import.Manual,
      status: EmissionFactorStatus.Valid,
      totalCo2: 81,
      geographicRepresentativeness: 5,
      completeness: 5,
      reliability: 5,
      technicalRepresentativeness: 5,
      temporalRepresentativeness: 5,
      importedId: '4',
      unit: Unit.GWH,
      isMonetary: false,
      source: 'Magic',
      base: EmissionFactorBase.LocationBased,
      subPosts: [SubPost.Energie],
      organizationId: defaultUserWithAccount.accounts[0].organizationVersion.organizationId,
      emissionFactorParts: {
        create: [
          {
            co2f: 1,
            ch4f: 2,
            ch4b: 3,
            n2o: 4,
            co2b: 5,
            sf6: 6,
            hfc: 7,
            pfc: 8,
            otherGES: 9,
            type: 'Amont',
            totalCo2: 45,
            createdAt: new Date('2025-01-01 07:00:00.00'),
            metaData: {
              create: {
                language: 'fr',
                title: 'My first part',
              },
            },
          },
          {
            co2f: 2,
            ch4f: 3,
            ch4b: 4,
            n2o: 5,
            co2b: 6,
            sf6: 7,
            hfc: 8,
            pfc: 9,
            otherGES: 10,
            type: 'Combustion',
            totalCo2: 54,
            createdAt: new Date('2025-01-01 08:00:00.00'),
            metaData: {
              create: {
                language: 'fr',
                title: 'My second part',
              },
            },
          },
        ],
      },
      metaData: {
        create: {
          language: 'fr',
          title: 'My FE to edit',
        },
      },
    },
  })

  studies.push(
    await prisma.study.create({
      include: { sites: true },
      data: {
        id: '88c93e88-7c80-4be4-905b-f0bbd2ccc779',
        createdById: defaultUserWithAccount.accounts[0].account.id,
        startDate: new Date(),
        endDate: faker.date.future(),
        isPublic: false,
        level: faker.helpers.enumValue(Level),
        name: faker.lorem.words({ min: 2, max: 5 }),
        organizationVersionId: defaultUserWithAccount.accounts[0].account.organizationVersionId as string,
        sites: {
          createMany: {
            data: faker.helpers
              .arrayElements(organizationVersionSites, { min: 1, max: organizationVersionSites.length })
              .map((site) => ({
                siteId: site.id,
                etp: faker.helpers.maybe(() => faker.number.int({ min: 1, max: 100 })) || site.etp,
                ca:
                  faker.helpers.maybe(
                    () => Math.round(faker.number.float({ min: 100_000, max: 1_000_000_000 })) / 100,
                  ) || site.ca,
              })),
          },
        },
        allowedUsers: {
          createMany: {
            data: [
              { role: StudyRole.Validator, accountId: defaultUserWithAccount.accounts[0].account.id },
              { role: StudyRole.Reader, accountId: readerWithAccount.accounts[0].account.id },
              { role: StudyRole.Editor, accountId: editorWithAccount.accounts[0].account.id },
            ],
          },
        },
      },
    }),
  )

  studies.push(
    await prisma.study.create({
      include: { sites: true },
      data: {
        id: '88c93e88-7c80-4be4-905b-f0bbd2ccc840',
        createdById: cutAdminAccount.account.id,
        startDate: new Date(),
        endDate: faker.date.future(),
        isPublic: false,
        level: Level.Initial,
        name: 'Study to delete',
        simplified: true,
        organizationVersionId: cutAdminAccount.account.organizationVersionId as string,
        sites: {
          createMany: {
            data: faker.helpers
              .arrayElements(cutAdminSites, { min: 1, max: Math.max(1, cutAdminSites.length) })
              .map((site) => ({
                siteId: site.id,
                etp: faker.helpers.maybe(() => faker.number.int({ min: 1, max: 100 })) || site.etp,
                ca:
                  faker.helpers.maybe(
                    () => Math.round(faker.number.float({ min: 100_000, max: 1_000_000_000 })) / 100,
                  ) || site.ca,
              })),
          },
        },
        allowedUsers: {
          createMany: {
            data: [{ role: StudyRole.Validator, accountId: cutAdminAccount.account.id }],
          },
        },
      },
    }),
  )

  await createRealStudy(prisma, defaultUserWithAccount.accounts[0].account)
  await createCountGoldenStudy(prisma)
}

const SEED_LOCK_KEY = 4_242_424

const main = async () => {
  // Cypress (and parallel local runs) can call db:test:seed concurrently against count_test.
  // Serialize the wipe+seed so we never hit unique constraint races on users.email.
  await prisma.$executeRaw`SELECT pg_advisory_lock(${SEED_LOCK_KEY})`
  try {
    await users()
  } finally {
    await prisma.$executeRaw`SELECT pg_advisory_unlock(${SEED_LOCK_KEY})`
  }
}

program.name('seed database').description('Clear and seed the database').version('1.0.0').parse(process.argv)

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  main()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
}
