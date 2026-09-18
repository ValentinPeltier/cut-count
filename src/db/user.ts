import type { Prisma } from '@/db-common'
import { DeactivatableFeature, Role, UserStatus } from '@/db-common/enums'
import { NOT_AUTHORIZED } from '@/lib/services/permissions/check'
import { AddMemberCommand } from '@/lib/services/serverFunctions/user.command'
import { signPassword } from '@/lib/utils/auth'
import { getDeactivableFeatureRestrictions } from '@/services/serverFunctions/deactivableFeatures'
import { sendEmailToAddedUser } from '@/services/serverFunctions/user'
import { AuthorizedInOrgaUserStatus } from '@/services/users'
import { getRoleToSetForUntrained } from '@/utils/user'
import { userSessionToDbUser } from '@/utils/userAccounts'
import { UserSession } from 'next-auth'
import { addAccount, getAccountByEmail, getAccountByEmailAndOrganizationVersionId } from './account'
import { prismaClient } from './client.server'

export const getUserByEmailWithSensibleInformations = (email: string) =>
  prismaClient.user.findUnique({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      level: true,
      password: true,
      resetToken: true,
      accounts: true,
    },
    where: { email },
  })

export const getUserSourceById = (id: string) =>
  prismaClient.user.findUnique({ where: { id }, select: { source: true } })

export const getUserById = (id: string) =>
  prismaClient.user.findUnique({ where: { id }, select: { firstName: true, lastName: true, email: true } })

export const getUserWithAccountsAndOrganizationsById = async (id: string) => {
  const user = await prismaClient.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      accounts: {
        select: {
          id: true,
          status: true,
          organizationVersion: {
            select: {
              id: true,
              organization: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  })

  if (!user) {
    throw new Error(`User with id ${id} not found`)
  }

  const userWithOnlyActiveAccounts = { ...user, accounts: user.accounts.filter((a) => a.status === UserStatus.ACTIVE) }

  return userWithOnlyActiveAccounts
}

export const getAccountByIdWithAllowedStudies = (id: string) =>
  prismaClient.account.findUnique({ where: { id }, include: { allowedStudies: true } })

export type UserWithAllowedStudies = AsyncReturnType<typeof getAccountByIdWithAllowedStudies>

export const updateUserPasswordForEmail = async (email: string, password: string) => {
  const signedPassword = await signPassword(password)
  const user = await prismaClient.user.update({
    where: { email },
    data: { resetToken: null, password: signedPassword },
  })

  if (!user) {
    throw new Error(`User with email ${email} not found`)
  }

  const account = await prismaClient.account.findFirst({
    where: {
      userId: user.id,
      status: { in: AuthorizedInOrgaUserStatus },
    },
  })

  if (!account) {
    throw new Error(`Account with email ${email} not found or has a wrong status`)
  }

  const accounts = await prismaClient.account.findMany({
    where: {
      userId: user.id,
      status: { in: AuthorizedInOrgaUserStatus },
    },
  })

  if (accounts.length > 0) {
    await prismaClient.account.update({
      where: { userId: user.id },
      data: { status: UserStatus.ACTIVE },
    })
  }

  return user
}

export const deleteUserFromOrga = async (email: string, organizationVersionId: string | null) => {
  const account = await getAccountByEmailAndOrganizationVersionId(email, organizationVersionId)
  if (!account) {
    return null
  }

  await prismaClient.account.update({
    where: { id: account.id },
    data: { organizationVersionId: null, status: UserStatus.IMPORTED },
  })
}

export const validateUser = (accountId: string) =>
  prismaClient.account.update({
    where: { id: accountId },
    data: { status: UserStatus.VALIDATED },
  })

export const hasAccountToValidateInOrganization = async (organizationVersionId: string | null) =>
  organizationVersionId
    ? prismaClient.account.count({
        where: { organizationVersionId, status: UserStatus.PENDING_REQUEST },
      })
    : 0

export const organizationVersionActiveAccountsCount = async (organizationVersionId: string) =>
  prismaClient.account.count({
    where: { organizationVersionId, status: UserStatus.ACTIVE },
  })

export const changeStatus = (accountId: string, newStatus: UserStatus) =>
  prismaClient.account.update({ where: { id: accountId }, data: { status: newStatus } })

export const getUserApplicationSettings = (accountId: string) =>
  prismaClient.userApplicationSettings.upsert({ where: { accountId }, update: {}, create: { accountId } })

export const getUsers = () => prismaClient.user.findMany({ select: { id: true, email: true } })

export const updateUserApplicationSettings = (accountId: string, data: Prisma.UserApplicationSettingsUpdateInput) =>
  prismaClient.userApplicationSettings.update({
    where: { accountId },
    data,
  })

export const getUserByIdWithAccounts = (id: string) =>
  prismaClient.user.findUnique({ where: { id }, include: { accounts: true } })

export type UserWithAccounts = AsyncReturnType<typeof getUserByIdWithAccounts>

export const getUserByEmail = (email: string) =>
  prismaClient.user.findUnique({ where: { email }, include: { accounts: true } })

export const updateUser = (userId: string, data: Partial<Prisma.UserCreateInput>) =>
  prismaClient.user.update({
    where: { id: userId },
    data,
  })

const isCreationBlockedForSource = (
  restrictions: Awaited<ReturnType<typeof getDeactivableFeatureRestrictions>>,
  source?: Prisma.UserCreateManyInput['source'],
) =>
  !!restrictions?.active && !!source && restrictions.deactivatedSources.includes(source)

export const createUsersWithAccount = async (
  users: (Prisma.UserCreateManyInput & { account: Prisma.AccountCreateInput })[],
) => {
  const deactivatedFeaturesRestrictions = await getDeactivableFeatureRestrictions(DeactivatableFeature.Creation)
  let filteredUsers = users

  if (deactivatedFeaturesRestrictions?.active) {
    const notAllowedSources = users.some(({ source }) =>
      isCreationBlockedForSource(deactivatedFeaturesRestrictions, source),
    )
    filteredUsers = users.filter(
      ({ source }) => !isCreationBlockedForSource(deactivatedFeaturesRestrictions, source),
    )
    if (notAllowedSources) {
      console.log(
        'Creation of users from these sources is not allowed: ',
        deactivatedFeaturesRestrictions.deactivatedSources,
      )
    }
  }

  const newUsers = await prismaClient.user.createMany({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: filteredUsers.map(({ account, ...user }) => user),
    skipDuplicates: true,
  })

  const emails = filteredUsers.map(({ email }) => email)

  const createdUsers = await prismaClient.user.findMany({
    where: { email: { in: emails } },
  })

  let newAccountCount = 0
  for (const user of createdUsers) {
    const originalUsers = filteredUsers.filter((u) => u.email === user.email)
    if (!originalUsers.length) {
      throw new Error(`No account info for user ${user.email}`)
    }

    for (const originalUser of originalUsers) {
      const accoutAlreadyExists = await getAccountByEmail(user.email)
      if (accoutAlreadyExists) {
        continue
      }
      await prismaClient.account.create({
        data: {
          ...originalUser.account,
          user: {
            connect: { id: user.id },
          },
        },
      })
      newAccountCount++
    }
  }

  return { newUsers, newAccounts: { count: newAccountCount } }
}

export const updateAccount = (
  accountId: string,
  data: Partial<Prisma.AccountUpdateInput & { role: Exclude<Role, 'SUPER_ADMIN'> | undefined }>,
  userData?: Partial<Prisma.UserUpdateInput>,
) =>
  prismaClient.account.update({
    where: { id: accountId },
    data: {
      ...data,
      user: { update: { ...userData } },
    },
  })

export const resetUserFeedbackDate = async () => prismaClient.account.updateMany({ data: { feedbackDate: null } })

export const getUserFeedbackDate = async (accountId: string) =>
  prismaClient.account.findUnique({ select: { feedbackDate: true }, where: { id: accountId } })

export const updateUserFeedbackDate = async (accountId: string, feedbackDate: Date) =>
  prismaClient.account.update({ where: { id: accountId }, data: { feedbackDate } })

export const addUser = async (
  newMember: Omit<Prisma.UserCreateInput, 'accounts'> & {
    accounts: { create: Omit<Prisma.AccountCreateInput, 'user'> }
    role?: Exclude<Role, 'SUPER_ADMIN'>
  },
) => {
  const deactivatedFeaturesRestrictions = await getDeactivableFeatureRestrictions(DeactivatableFeature.Creation)
  if (isCreationBlockedForSource(deactivatedFeaturesRestrictions, newMember.source)) {
    throw new Error(NOT_AUTHORIZED)
  }
  return prismaClient.user.create({
    data: newMember,
    select: {
      id: true,
      accounts: {
        select: {
          id: true,
        },
      },
    },
  })
}

export const handleAddingUser = async (creator: UserSession, newUser: AddMemberCommand) => {
  const organizationVersionId = creator.organizationVersionId
  const memberExists = await getUserByEmail(newUser.email.toLowerCase())

  const isMemberActiveInSomeEnv = memberExists?.accounts.some((a) => a.status === UserStatus.ACTIVE)
  const memberAccountForOrganization = memberExists?.accounts.find(
    (a) => a.organizationVersionId === organizationVersionId,
  )

  if (memberAccountForOrganization?.role === Role.SUPER_ADMIN || newUser.role === Role.SUPER_ADMIN) {
    throw new Error(NOT_AUTHORIZED)
  }

  const userFromDb = await getUserByEmail(creator.email)
  if (!userFromDb || !organizationVersionId) {
    throw new Error(NOT_AUTHORIZED)
  }

  if (!memberExists) {
    const newMember = {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email.toLowerCase(),
      level: null,
      source: userFromDb.source,
      accounts: {
        create: {
          role: getRoleToSetForUntrained(newUser.role),
          status: UserStatus.VALIDATED,
          organizationVersionId,
        },
      },
    }

    await addUser(newMember)
  } else if (!memberAccountForOrganization) {
    await addAccount({
      status: isMemberActiveInSomeEnv ? UserStatus.ACTIVE : UserStatus.VALIDATED,
      role: memberExists.level ? newUser.role : getRoleToSetForUntrained(newUser.role),
      user: { connect: { id: memberExists.id } },
      organizationVersion: { connect: { id: organizationVersionId } },
    })
  } else {
    if (memberAccountForOrganization.status === UserStatus.ACTIVE && memberAccountForOrganization.organizationVersionId) {
      throw new Error(NOT_AUTHORIZED)
    }

    const updateMember = {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    }

    const updateMemberAccount = {
      status: isMemberActiveInSomeEnv ? UserStatus.ACTIVE : UserStatus.VALIDATED,
      role: memberExists.level
        ? memberAccountForOrganization.role
        : getRoleToSetForUntrained(memberAccountForOrganization.role),
      organizationVersion: { connect: { id: organizationVersionId } },
    }
    await updateAccount(memberAccountForOrganization.id, updateMemberAccount, updateMember)
  }

  await sendEmailToAddedUser(
    newUser.email.toLowerCase(),
    userSessionToDbUser(creator),
    newUser.firstName,
    organizationVersionId,
  )
}

export const updateUserResetTokenForEmail = async (email: string, resetToken: string) =>
  prismaClient.user.update({
    where: { email: email.toLowerCase() },
    data: { resetToken },
  })
