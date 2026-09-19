'use server'

import { Organization, User } from '@/generated/prisma/client'
import { DeactivatableFeature, Role, UserStatus } from '@/generated/prisma/enums'
import {
  addAccount,
  changeAccountRole,
  getAccountByEmail,
  getAccountByEmailAndOrganizationVersionId,
  getAccountById,
  getAccountFromUserOrganization,
  getAccountsFromUser,
} from '@/db/account'
import { findCncByCncCode } from '@/db/cnc'
import {
  createOrganizationWithVersion,
  getOrganizationVersionByOrganizationId,
  getOrganizationVersionForRightsCheck,
  getOrgNameByOrgVersionId,
  getRawOrganizationBySiret,
  getRawOrganizationBySiteCNC,
} from '@/db/organization'
import { addSite } from '@/db/site'
import type { FullStudy } from '@/db/study'
import {
  addUser,
  changeStatus,
  deleteUserFromOrga,
  getUserApplicationSettings,
  getUserByEmail,
  getUsers,
  getUserSourceById,
  handleAddingUser,
  organizationVersionActiveAccountsCount,
  updateAccount,
  updateUser,
  updateUserApplicationSettings,
  updateUserResetTokenForEmail,
  UserWithAccounts,
  validateUser,
} from '@/db/user'
import {
  sendActivationEmail,
  sendActivationRequest,
  sendAddedActiveUserEmail,
  sendAddedUsersByFile,
  sendContributorInvitationEmail,
  sendNewContributorInvitationEmail,
  sendNewUserEmail,
  sendNewUserOnStudyInvitationEmail,
  sendResetPassword,
  sendUserOnStudyInvitationEmail,
} from '@/lib/services/email/email'
import { EMAIL_SENT, MORE_THAN_ONE, NOT_AUTHORIZED } from '@/lib/services/permissions/check'
import { updateUserResetToken } from '@/lib/services/serverFunctions/user'
import { AddMemberCommand } from '@/lib/services/serverFunctions/user.command'
import { DAY, HOUR, TIME_IN_MS } from '@/lib/utils/time'
import { AccountWithUser } from '@/types/account.types'
import { withServerResponse } from '@/utils/serverResponse'
import { getRoleToSetForUntrained } from '@/utils/user'
import { accountWithUserToUserSession, userSessionToDbUser } from '@/utils/userAccounts'
import jwt from 'jsonwebtoken'
import { UserSession } from 'next-auth'
import { getCompanyName } from '../associationApi'
import { auth, dbActualizedAuth } from '../auth'
import { REQUEST_SENT, UNKNOWN_SIRET_OR_CNC } from '../permissions/check'
import { canAddMember, canChangeRole, canDeleteMember, canEditSelfRole } from '../permissions/user'
import { getDeactivableFeatureRestrictions } from './deactivableFeatures'
import { EditProfileCommand, EditSettingsCommand } from './user.command'

export const sendEmailToAddedUser = async (email: string, user: User, newUserName: string, orgaVersionId: string) =>
  withServerResponse('sendEmailToAddedUser', async () => {
    const addedMember = await getUserByEmail(email)
    const activeAccounts = addedMember?.accounts.filter((account) => account.status === UserStatus.ACTIVE)
    const name = await getOrgNameByOrgVersionId(orgaVersionId)

    if (activeAccounts?.length && activeAccounts.length > 0) {
      return sendAddedActiveUserEmail(email, `${user.firstName} ${user.lastName}`, newUserName, name || '')
    }

    const token = await updateUserResetToken(email, 1 * DAY)
    return sendNewUserEmail(email, token, `${user.firstName} ${user.lastName}`, newUserName)
  })

export const sendInvitation = async (
  email: string,
  study: FullStudy,
  organization: Organization,
  creator: UserSession,
  roleOnStudy: string,
  existingAccount?: AccountWithUser,
) =>
  withServerResponse('sendInvitation', async () => {
    if (existingAccount && existingAccount.status === UserStatus.ACTIVE) {
      return roleOnStudy
        ? sendUserOnStudyInvitationEmail(
            email,
            study.name,
            study.id,
            organization.name,
            `${creator.firstName} ${creator.lastName}`,
            existingAccount.user.firstName,
            roleOnStudy,
          )
        : sendContributorInvitationEmail(
            email,
            study.name,
            study.id,
            organization.name,
            `${creator.firstName} ${creator.lastName}`,
            existingAccount.user.firstName,
          )
    }

    const token = await updateUserResetToken(email, 1 * DAY)

    return roleOnStudy
      ? sendNewUserOnStudyInvitationEmail(
          email,
          token,
          study.name,
          study.id,
          organization.name,
          `${creator.firstName} ${creator.lastName}`,
          roleOnStudy,
        )
      : sendNewContributorInvitationEmail(
          email,
          token,
          study.name,
          study.id,
          organization.name,
          `${creator.firstName} ${creator.lastName}`,
        )
  })

const sendActivation = async (email: string, fromReset: boolean) => {
  const token = await updateUserResetToken(email, 1 * HOUR)
  return sendActivationEmail(email, token, fromReset)
}

export const addMember = async (member: AddMemberCommand) =>
  withServerResponse('addMember', async () => {
    const session = await dbActualizedAuth()
    if (!session || !session.user || !session.user.organizationVersionId || member.role === Role.SUPER_ADMIN) {
      throw new Error(NOT_AUTHORIZED)
    }

    if (!canAddMember(session.user, member, session.user.organizationVersionId)) {
      throw new Error(NOT_AUTHORIZED)
    }

    await handleAddingUser(session.user, member)
  })

export const validateMember = async (email: string, role: Role) =>
  withServerResponse('validateMember', async () => {
    const session = await dbActualizedAuth()
    if (!session || !session.user || !session.user.organizationVersionId) {
      throw new Error(NOT_AUTHORIZED)
    }

    const member = await getAccountByEmailAndOrganizationVersionId(email, session.user.organizationVersionId)
    if (!member || !canAddMember(session.user, member, member.organizationVersionId)) {
      throw new Error(NOT_AUTHORIZED)
    }

    const changeRoleResult = await changeRole(email, role)
    if (!changeRoleResult.success) {
      throw new Error(changeRoleResult.errorMessage)
    }

    await validateUser(member.id)

    await sendEmailToAddedUser(
      member.user.email.toLowerCase(),
      userSessionToDbUser(session.user),
      member.user.firstName,
      session.user.organizationVersionId,
    )
  })

export const resendInvitation = async (email: string) =>
  withServerResponse('resendInvitation', async () => {
    const session = await dbActualizedAuth()
    if (!session || !session.user || !session.user.organizationVersionId) {
      throw new Error(NOT_AUTHORIZED)
    }

    const member = await getAccountByEmailAndOrganizationVersionId(email, session.user.organizationVersionId)
    if (!member || !canAddMember(session.user, member, member.organizationVersionId)) {
      throw new Error(NOT_AUTHORIZED)
    }

    await sendEmailToAddedUser(
      member.user.email,
      userSessionToDbUser(session.user),
      member.user.firstName,
      session.user.organizationVersionId,
    )
  })

export const deleteMember = async (email: string) =>
  withServerResponse('deleteMember', async () => {
    const session = await dbActualizedAuth()
    if (!session || !session.user) {
      throw new Error(NOT_AUTHORIZED)
    }

    const accountToRemove = await getAccountByEmailAndOrganizationVersionId(email, session.user.organizationVersionId)
    if (!canDeleteMember(session.user, accountToRemove as AccountWithUser)) {
      throw new Error(NOT_AUTHORIZED)
    }
    await deleteUserFromOrga(email, session.user.organizationVersionId)
  })

export const changeRole = async (email: string, role: Role) =>
  withServerResponse('changeRole', async () => {
    const session = await dbActualizedAuth()
    if (!session || !session.user || !session.user.organizationVersionId) {
      throw new Error(NOT_AUTHORIZED)
    }

    const accountToChange = await getAccountByEmailAndOrganizationVersionId(email, session.user.organizationVersionId)

    if (!accountToChange) {
      throw new Error(NOT_AUTHORIZED)
    }

    if (!canChangeRole(session.user, accountToChange as AccountWithUser, role)) {
      throw new Error(NOT_AUTHORIZED)
    }

    const team = await getAccountFromUserOrganization(session.user)
    const selfEditRolesCount = team.filter((member) => canEditSelfRole(member.role)).length
    if (
      accountToChange &&
      selfEditRolesCount === 1 &&
      canEditSelfRole(accountToChange.role) &&
      !canEditSelfRole(role)
    ) {
      return MORE_THAN_ONE
    }

    const targetAccount = await getAccountById(accountToChange.id)
    if (!targetAccount || targetAccount.organizationVersionId !== session.user.organizationVersionId) {
      throw new Error(NOT_AUTHORIZED)
    }

    await changeAccountRole(accountToChange.id, role)
  })

export const updateUserProfile = async (command: EditProfileCommand) =>
  withServerResponse('updateUserProfile', async () => {
    const session = await auth()
    if (!session || !session.user) {
      throw new Error(NOT_AUTHORIZED)
    }

    await updateUser(session.user.userId, command)
  })

export const resetPassword = async (email: string) =>
  withServerResponse('resetPassword', async () => {
    const user = await getUserByEmail(email)

    if (!user || user.accounts.every((a) => a.status !== UserStatus.ACTIVE)) {
      const activation = await activateEmail(email, true)
      if (activation.success) {
        return activation.data
      } else {
        throw new Error(activation.errorMessage)
      }
    } else {
      if (user) {
        const resetToken = Math.random().toString(36)
        const payload = {
          email,
          resetToken,
          exp: Math.round(Date.now() / TIME_IN_MS) + HOUR, // 1 hour expiration
        }

        const token = jwt.sign(payload, process.env.NEXTAUTH_SECRET as string)
        await updateUserResetTokenForEmail(email, resetToken)
        await sendResetPassword(email, token)
      }
    }
  })

export const activateEmail = async (email: string, fromReset: boolean = false) =>
  withServerResponse('activateEmail', async () => {
    const user = await getUserByEmail(email.toLowerCase())
    const account = (await getAccountById(user?.accounts[0]?.id || '')) as AccountWithUser

    if (!user || !account || !account.organizationVersionId || account.status === UserStatus.ACTIVE) {
      throw new Error(NOT_AUTHORIZED)
    }

    const accountOrgaVersion = await getOrganizationVersionForRightsCheck(account.organizationVersionId)
    if (!accountOrgaVersion) {
      throw new Error(NOT_AUTHORIZED)
    }

    if (
      (await organizationVersionActiveAccountsCount(account.organizationVersionId)) &&
      account.status !== UserStatus.VALIDATED
    ) {
      const accounts = await getAccountFromUserOrganization(accountWithUserToUserSession(account))
      await sendActivationRequest(
        accounts
          .filter((a) => (a.role === Role.GESTIONNAIRE || a.role === Role.ADMIN) && a.status == UserStatus.ACTIVE)
          .map((a) => a.user.email),
        email.toLowerCase(),
        `${user.firstName} ${user.lastName}`,
      )

      await changeStatus(account.id, UserStatus.PENDING_REQUEST)

      return REQUEST_SENT
    } else {
      await validateUser(account.id)
      await sendActivation(email, fromReset)

      return EMAIL_SENT
    }
  })

export const getUserSettings = async () =>
  withServerResponse('getUserSettings', async () => {
    const session = await auth()
    if (!session || !session.user) {
      return null
    }
    return getUserApplicationSettings(session.user.accountId)
  })

export const getUserSource = async () =>
  withServerResponse('getUserSource', async () => {
    const session = await auth()
    if (!session || !session.user) {
      return null
    }

    return (await getUserSourceById(session.user.userId))?.source
  })

export const updateUserSettings = async (command: EditSettingsCommand) =>
  withServerResponse('updateUserSettings', async () => {
    const session = await auth()
    if (!session || !session.user) {
      throw new Error(NOT_AUTHORIZED)
    }
    await updateUserApplicationSettings(session.user.accountId, command)
  })

export const getUserCheckedItems = async () => withServerResponse('getUserCheckedItems', async () => [])

export const addUserChecklistItem = async (_step: string) =>
  withServerResponse('addUserChecklistItem', async () => undefined)

export const sendAddedUsersAndProccess = async (results: Record<string, string>[]) =>
  withServerResponse('sendAddedUsersAndProccess', async () => {
    sendAddedUsersByFile(results)
  })

export const verifyPasswordAndProcessUsers = async (uuid: string) =>
  withServerResponse('verifyPasswordAndProcessUsers', async () => uuid === process.env.ADMIN_PASSWORD)

export const changeUserRoleOnOnboarding = async () =>
  withServerResponse('changeUserRoleOnOnboarding', async () => {
    const session = await auth()
    if (!session || !session.user) {
      return
    }

    const newRole = session.user.level ? Role.ADMIN : getRoleToSetForUntrained(Role.ADMIN)
    await changeAccountRole(session.user.accountId, newRole)
  })

export const lowercaseUsersEmails = async () => {
  const users = await getUsers()

  const duplicated = users.filter(
    (user) => users.filter((u) => u.email.toLowerCase() === user.email.toLowerCase()).length > 1,
  )
  if (duplicated.length > 1) {
    const emails = duplicated.map((user) => user.email)
    console.log(`Migration impossible, il existe ${emails.length} adresses mail dupliquées : `)
    emails.sort((a, b) => a.localeCompare(b)).forEach((email) => console.log(`- ${email}`))
    console.log('Veuillez régler ces conflicts en premier lieu')
  } else {
    const capitalizedUsers = users.filter((user) => user.email !== user.email.toLowerCase())
    await Promise.all(capitalizedUsers.map((user) => updateUser(user.id, { email: user.email.toLowerCase() })))
    console.log(`Fait : ${capitalizedUsers.length} utilisateurs mis à jour`)
  }
}

export const getUserActiveAccounts = async () =>
  withServerResponse('getUserActiveAccounts', async () => {
    const session = await dbActualizedAuth()
    if (!session || !session.user) {
      return []
    }
    const accounts = await getAccountsFromUser(session.user)
    return accounts.filter((account) => account.status === UserStatus.ACTIVE)
  })

export const signUpWithSiretOrCNC = async (email: string, siretOrCNC: string) =>
  withServerResponse('signUpWithSiretOrCNC', async () => {
    const trimmedEmail = email.trim().toLowerCase()
    const deactivatedFeaturesRestrictions = await getDeactivableFeatureRestrictions(DeactivatableFeature.Creation)
    if (deactivatedFeaturesRestrictions?.active) {
      throw new Error(NOT_AUTHORIZED)
    }

    const accountAlreadyCreated = await getAccountByEmail(trimmedEmail)
    if (accountAlreadyCreated && accountAlreadyCreated.organizationVersionId) {
      throw new Error(NOT_AUTHORIZED)
    }

    let user = (await getUserByEmail(trimmedEmail)) as UserWithAccounts
    let organization = null
    let account = null

    if (!user) {
      user = (await addUser({
        email: trimmedEmail,
        firstName: '',
        lastName: '',
        accounts: {
          create: {
            status: UserStatus.PENDING_REQUEST,
            role: Role.DEFAULT,
          },
        },
      })) as UserWithAccounts
      account = user?.accounts[0]
    } else {
      account =
        accountAlreadyCreated ||
        ((await addAccount({
          user: { connect: { id: user.id } },
          role: Role.DEFAULT,
          status: UserStatus.PENDING_REQUEST,
        })) as AccountWithUser)
    }
    if (!user || !account) {
      throw new Error(NOT_AUTHORIZED)
    }

    let organizationVersion = null

    const CNC = await findCncByCncCode(siretOrCNC)
    if (CNC) {
      organization = await getRawOrganizationBySiteCNC(siretOrCNC)
      organizationVersion = organization?.id ? await getOrganizationVersionByOrganizationId(organization.id) : null

      if (!organizationVersion) {
        organizationVersion = await createOrganizationWithVersion({ name: CNC.nom || '' }, {})

        await addSite({
          name: CNC.nom || '',
          postalCode: CNC.codeInsee || '',
          city: CNC.commune || '',
          cnc: {
            connectOrCreate: {
              create: {},
              where: {
                id: CNC.id,
              },
            },
          },
          organization: { connect: { id: organizationVersion.organizationId } },
        })
      }
    }

    if (!organizationVersion && siretOrCNC.length < 9) {
      throw new Error(UNKNOWN_SIRET_OR_CNC)
    }

    if (!organizationVersion) {
      let companyName = ''

      organization = await getRawOrganizationBySiret(siretOrCNC)

      if (!organization?.id) {
        companyName = (await getCompanyName(siretOrCNC)) || ''

        if (companyName === '') {
          console.error('Company name not found for siretOrCNC:', siretOrCNC)
          throw new Error(UNKNOWN_SIRET_OR_CNC)
        }
      }

      organizationVersion = organization?.id
        ? await getOrganizationVersionByOrganizationId(organization.id)
        : await createOrganizationWithVersion({ wordpressId: siretOrCNC, name: companyName }, {})
    }

    if (!organizationVersion) {
      throw new Error(NOT_AUTHORIZED)
    }

    const newOrganizationRole = Role.ADMIN
    await updateAccount(account.id, {
      role: organization?.id ? Role.DEFAULT : newOrganizationRole,
      organizationVersion: { connect: { id: organizationVersion.id } },
    })

    if (organization?.id) {
      const createdAccount = (await getAccountById(account.id || '')) as AccountWithUser
      const accounts = await getAccountFromUserOrganization(accountWithUserToUserSession(createdAccount))

      await sendActivationRequest(
        accounts.filter((a) => a.role === Role.GESTIONNAIRE || a.role === Role.ADMIN).map((a) => a.user.email),
        trimmedEmail,
        `${user.firstName} ${user.lastName}`,
      )

      return REQUEST_SENT
    } else {
      await validateUser(account.id)
      await sendActivation(trimmedEmail, false)
    }
    return EMAIL_SENT
  })

export const signUpWithSchool = async (_email: string, _country: string, _school: unknown) =>
  withServerResponse('signUpWithSchool', async () => {
    throw new Error(NOT_AUTHORIZED)
  })
