'use server'

import {
  addAccount,
  getAccountByEmail,
  getAccountByEmailAndOrganizationVersionId,
  getAccountsFromOrganization,
} from '@/db/account'
import { findCncByCncCode, updateNumberOfProgrammedFilms } from '@/db/cnc'
import {
  getOrganizationVersionById,
  getOrganizationWithSitesById,
  getOrgSitesWithCNCByOrgVersionId,
  OrganizationVersionWithOrganization,
} from '@/db/organization'
import { updateSituationFields } from '@/db/situation'
import {
  countOrganizationStudiesFromOtherUsers,
  createStudy,
  createUserOnStudy,
  deleteAccountOnStudy,
  deleteStudy,
  FullStudy,
  getStudiesSitesFromIds,
  getStudyById,
  getStudyNameById,
  getStudySites,
  updateStudy,
  updateStudyOpeningHours,
  updateStudySiteData,
  updateStudySites,
  updateUserOnStudy,
} from '@/db/study'
import {
  addUser,
  getUserApplicationSettings,
  getUserByEmail,
  getUserSourceById,
  updateAccount,
  UserWithAccounts,
} from '@/db/user'
import type { Prisma } from '@/generated/prisma/client'
import { Role, StudyResultUnit, StudyRole, UserStatus } from '@/generated/prisma/enums'
import { NOT_AUTHORIZED } from '@/lib/services/permissions/check'
import { StudySiteFields, studySiteToSituation } from '@/services/studySiteToSituation'
import { AccountWithUser } from '@/types/account.types'
import { mapCncToStudySite } from '@/utils/cnc'
import { calculateDistanceFromParis } from '@/utils/distance'
import { CA_UNIT_VALUES, defaultCAUnit } from '@/utils/number'
import { withServerResponse } from '@/utils/serverResponse'
import {
  getAccountRoleOnStudy,
  getAllowedRolesFromDefaultRole,
  getUserRoleOnPublicStudy,
  hasEditionRights,
  hasSufficientLevel,
} from '@/utils/study'
import { isAdmin } from '@/utils/user'
import { accountWithUserToUserSession } from '@/utils/userAccounts'
import { UserSession } from 'next-auth'
import { getTranslations } from 'next-intl/server'
import { dbActualizedAuth } from '../auth'
import { ALREADY_IN_STUDY } from '../permissions/check'
import { isInOrgaOrParentFromId } from '../permissions/organization'
import {
  canAddRightOnStudy,
  canChangeDates,
  canChangeLevel,
  canChangeName,
  canChangeOpeningHours,
  canChangePublicStatus,
  canChangeResultsUnit,
  canChangeSites,
  canCreateSpecificStudy,
  canDeleteStudy,
} from '../permissions/study'
import { isAdminOnStudyOrga } from '../permissions/study.utils'
import { saveSituation as saveSituationInDB } from './situation'
import {
  ChangeStudyCinemaCommand,
  ChangeStudyDatesCommand,
  ChangeStudyLevelCommand,
  ChangeStudyNameCommand,
  ChangeStudyPublicStatusCommand,
  ChangeStudyResultsUnitCommand,
  ChangeStudySitesCommand,
  CreateStudyCommand,
  DeleteCommand,
  NewStudyRightCommand,
} from './study.command'
import { sendInvitation } from './user'

const hasAccessToStudy = (user: UserSession, study: { allowedUsers: { accountId: string }[] }) => {
  return study.allowedUsers.some((allowedUser) => allowedUser.accountId === user.accountId) || getAccountRoleOnStudy
}

export const getStudy = async (studyId: string) =>
  withServerResponse('getStudy', async () => {
    const session = await dbActualizedAuth()
    if (!studyId || !session || !session.user) {
      return null
    }
    const study = await getStudyById(studyId, session.user.organizationVersionId)
    if (!study || !getAccountRoleOnStudy(session.user, study)) {
      return null
    }

    return study
  })

export const getStudySite = async (studySiteId: string) =>
  withServerResponse('getStudySite', async () => {
    const session = await dbActualizedAuth()
    if (!studySiteId || !session || !session.user) {
      return null
    }

    const studySites = await getStudiesSitesFromIds([studySiteId])

    if (!studySites || studySites.length === 0) {
      throw new Error(NOT_AUTHORIZED)
    }

    const study = await getStudyById(studySites[0].studyId, session.user.organizationVersionId)
    if (!study || !getAccountRoleOnStudy(session.user, study)) {
      return null
    }

    return study.sites.find((site) => site.id === studySiteId)
  })

export const createStudyCommand = async (
  { organizationVersionId, validator, sites, ...command }: CreateStudyCommand,
  resultsUnit?: StudyResultUnit,
  tx?: Prisma.TransactionClient,
) =>
  withServerResponse('createStudyCommand', async () => {
    const session = await dbActualizedAuth()

    if (!session || !session.user) {
      throw new Error(NOT_AUTHORIZED)
    }

    const rights: Prisma.UserOnStudyCreateManyStudyInput[] = []
    if (validator === session.user.email) {
      rights.push({
        role: StudyRole.Validator,
        accountId: session.user.accountId,
      })
    } else {
      const accountValidator = await getAccountByEmailAndOrganizationVersionId(
        validator,
        session.user.organizationVersionId,
      )
      if (!accountValidator) {
        throw new Error(NOT_AUTHORIZED)
      }

      if (!hasSufficientLevel(accountValidator.user.level, command.level)) {
        throw new Error(NOT_AUTHORIZED)
      }

      rights.push({
        role: isAdmin(session.user.role) ? StudyRole.Validator : StudyRole.Editor,
        accountId: session.user.accountId,
      })
      rights.push({
        role: StudyRole.Validator,
        accountId: accountValidator.id,
      })
    }

    const studySites = sites.filter((site) => site.selected)
    const organizationSites = await getOrgSitesWithCNCByOrgVersionId(organizationVersionId)
    if (!organizationSites) {
      throw new Error(NOT_AUTHORIZED)
    }

    if (studySites.some((site) => organizationSites.every((organizationSite) => organizationSite.id !== site.id))) {
      throw new Error(NOT_AUTHORIZED)
    }

    const userCAUnit = (await getUserApplicationSettings(session.user.accountId))?.caUnit
    const caUnit = CA_UNIT_VALUES[userCAUnit || defaultCAUnit]

    const { exports: _exports, isPublic, ...studyCommand } = command

    const study = {
      ...studyCommand,
      createdBy: { connect: { id: session.user.accountId } },
      organizationVersion: { connect: { id: organizationVersionId } },
      isPublic: isPublic === 'true',
      resultsUnit: resultsUnit || StudyResultUnit.T,
      allowedUsers: {
        createMany: { data: rights },
      },
      sites: {
        createMany: {
          data: studySites
            .map((site) => {
              const organizationSite = organizationSites.find((organizationSite) => organizationSite.id === site.id)
              if (!organizationSite) {
                return undefined
              }

              const cncData = organizationSite.cnc
              const studySiteData: Prisma.StudySiteCreateManyStudyInput = {
                siteId: site.id,
                etp: site.etp || organizationSite.etp,
                ca: site.ca ? site.ca * caUnit : organizationSite.ca,
              }

              if (cncData) {
                Object.assign(studySiteData, mapCncToStudySite(cncData))
                studySiteData.cncVersionId = cncData.cncVersionId
              }

              return studySiteData
            })
            .filter((site) => site !== undefined),
        },
      },
    } satisfies Prisma.StudyCreateInput

    if (!(await canCreateSpecificStudy(session.user, study, organizationVersionId))) {
      throw new Error(NOT_AUTHORIZED)
    }

    try {
      const createdStudy = await createStudy(study, true, tx)

      if (createdStudy.simplified) {
        await Promise.all(
          createdStudy.sites.map(async (site) => {
            await saveSituationInDB(createdStudy.id, site.id, {}, {}, '')
            await updateSituationWithStudySiteData(site.id, site, createdStudy.simplified)
          }),
        )
      }
      return { id: createdStudy.id }
    } catch (e) {
      console.error(e)
      throw new Error('default')
    }
  })

const getStudyRightsInformations = async (studyId: string) => {
  const session = await dbActualizedAuth()
  if (!session || !session.user) {
    return null
  }

  const studyWithRights = await getStudyById(studyId, session.user.organizationVersionId)

  if (!studyWithRights) {
    return null
  }
  return { user: session.user, studyWithRights }
}

export const changeStudyPublicStatus = async ({ studyId, ...command }: ChangeStudyPublicStatusCommand) =>
  withServerResponse('changeStudyPublicStatus', async () => {
    const informations = await getStudyRightsInformations(studyId)
    if (informations === null) {
      throw new Error(NOT_AUTHORIZED)
    }

    if (!(await canChangePublicStatus(informations.user, informations.studyWithRights))) {
      throw new Error(NOT_AUTHORIZED)
    }

    await updateStudy(studyId, { isPublic: command.isPublic === 'true' })
  })

export const changeStudyLevel = async ({ studyId, ...command }: ChangeStudyLevelCommand) =>
  withServerResponse('changeStudyLevel', async () => {
    const informations = await getStudyRightsInformations(studyId)
    if (informations === null) {
      throw new Error(NOT_AUTHORIZED)
    }

    if (!(await canChangeLevel(informations.user, informations.studyWithRights, command.level))) {
      throw new Error(NOT_AUTHORIZED)
    }

    await updateStudy(studyId, { level: command.level })
  })

export const changeStudyResultsUnit = async ({ studyId, ...command }: ChangeStudyResultsUnitCommand) =>
  withServerResponse('changeStudyResultsUnit', async () => {
    const informations = await getStudyRightsInformations(studyId)
    if (informations === null) {
      throw new Error(NOT_AUTHORIZED)
    }

    if (!(await canChangeResultsUnit(informations.user, informations.studyWithRights))) {
      throw new Error(NOT_AUTHORIZED)
    }

    await updateStudy(studyId, { resultsUnit: command.resultsUnit })
  })

export const changeStudyDates = async ({ studyId, ...command }: ChangeStudyDatesCommand) =>
  withServerResponse('changeStudyDates', async () => {
    const informations = await getStudyRightsInformations(studyId)
    if (informations === null) {
      throw new Error(NOT_AUTHORIZED)
    }

    if (!(await canChangeDates(informations.user, informations.studyWithRights))) {
      throw new Error(NOT_AUTHORIZED)
    }

    await updateStudy(studyId, command)
  })

export const changeStudyName = async ({ studyId, ...command }: ChangeStudyNameCommand) =>
  withServerResponse('changeStudyName', async () => {
    const informations = await getStudyRightsInformations(studyId)
    if (informations === null) {
      throw new Error(NOT_AUTHORIZED)
    }

    if (!canChangeName(informations.user, informations.studyWithRights)) {
      throw new Error(NOT_AUTHORIZED)
    }

    await updateStudy(studyId, { name: command.name })
  })

export const changeStudyCinema = async (studySiteId: string, cncId: string, data: ChangeStudyCinemaCommand) =>
  withServerResponse('changeStudyCinema', async () => {
    const studySites = await getStudiesSitesFromIds([studySiteId])

    if (!studySites || studySites.length === 0) {
      throw new Error(NOT_AUTHORIZED)
    }

    const study = studySites[0].study

    if (!study) {
      throw new Error(NOT_AUTHORIZED)
    }

    const informations = await getStudyRightsInformations(study.id)

    if (informations === null) {
      throw new Error(NOT_AUTHORIZED)
    }
    const { openingHours, openingHoursHoliday, numberOfProgrammedFilms, ...updateData } = data

    if (!canChangeOpeningHours(informations.user, informations.studyWithRights)) {
      throw new Error(NOT_AUTHORIZED)
    }

    const currentSite = studySites[0]
    let calculatedDistanceToParis: number | undefined

    const cncData = currentSite.site.cnc
    if (cncData?.latitude && cncData?.longitude) {
      calculatedDistanceToParis = calculateDistanceFromParis({
        latitude: cncData.latitude,
        longitude: cncData.longitude,
      })
    }

    const enhancedUpdateData: Record<string, number | null | undefined> = { ...updateData }

    if (cncData) {
      if (calculatedDistanceToParis !== undefined && currentSite.distanceToParis == null) {
        enhancedUpdateData.distanceToParis = calculatedDistanceToParis
      }

      Object.assign(enhancedUpdateData, mapCncToStudySite(cncData, currentSite))
    }

    const finalUpdateData = enhancedUpdateData

    await updateNumberOfProgrammedFilms({ cncId, numberOfProgrammedFilms })
    await updateStudyOpeningHours(studySiteId, openingHours, openingHoursHoliday)
    await updateStudySiteData(studySiteId, finalUpdateData)
    await updateSituationWithStudySiteData(studySiteId, finalUpdateData, true)
  })

async function updateSituationWithStudySiteData(
  studySiteId: string,
  siteDependentFields: StudySiteFields,
  studyIsSimplified: boolean,
) {
  if (studyIsSimplified) {
    const situationUpdates = studySiteToSituation(siteDependentFields)

    if (Object.keys(situationUpdates).length > 0) {
      await updateSituationFields(studySiteId, situationUpdates)
    }
  }
}

export const hasActivityData = async (
  studyId: string,
  deletedSites: ChangeStudySitesCommand['sites'],
  organizationVersionId: string,
) =>
  withServerResponse('hasActivityData', async () => {
    const study = await getStudyById(studyId, organizationVersionId)
    if (!study) {
      return false
    }
    return study.sites.some((site) =>
      deletedSites.some((deletedSite) => deletedSite.id === site.site.id && deletedSite.selected === false),
    )
  })

export const changeStudySites = async (studyId: string, { organizationId, ...command }: ChangeStudySitesCommand) =>
  withServerResponse('changeStudySites', async () => {
    const [organization, session, study] = await Promise.all([
      getOrganizationWithSitesById(organizationId),
      dbActualizedAuth(),
      getStudyById(studyId, organizationId),
    ])

    if (!organization || !session || !study) {
      throw new Error(NOT_AUTHORIZED)
    }

    const userCAUnit = (await getUserApplicationSettings(session.user.accountId))?.caUnit
    const caUnit = CA_UNIT_VALUES[userCAUnit || defaultCAUnit]

    const selectedSites = command.sites
      .filter((site) => site.selected)
      .map((site) => {
        const organizationSite = organization.sites.find((organizationSite) => organizationSite.id === site.id)
        if (!organizationSite) {
          return undefined
        }
        return {
          studyId,
          siteId: site.id,
          etp: site.etp || organizationSite.etp,
          ca: (site?.ca || 0) * caUnit || organizationSite.ca,
        }
      })
      .filter((site) => site !== undefined)
    if (
      selectedSites.some((site) => organization.sites.every((organizationSite) => organizationSite.id !== site.siteId))
    ) {
      throw new Error(NOT_AUTHORIZED)
    }

    const informations = await getStudyRightsInformations(studyId)
    if (informations === null) {
      throw new Error(NOT_AUTHORIZED)
    }

    if (!canChangeSites(informations.user, informations.studyWithRights)) {
      throw new Error(NOT_AUTHORIZED)
    }

    const existingSites = await getStudySites(studyId)
    const deletedSiteIds = existingSites
      .filter((existingStudySite) => !selectedSites.find((studySite) => studySite.siteId === existingStudySite.siteId))
      .map((studySite) => studySite.id)
    await updateStudySites(studyId, selectedSites, deletedSiteIds)
  })

const getOrCreateUserAndSendStudyInvite = async (
  email: string,
  study: FullStudy,
  organizationVersion: OrganizationVersionWithOrganization,
  creator: UserSession,
  existingUser: UserWithAccounts | null,
  newRoleOnStudy?: StudyRole,
  skipInviteEmail = false,
  firstName?: string,
  lastName?: string,
) => {
  let accountId = ''
  const t = await getTranslations('study.role')
  const creatorDBUser = await getUserSourceById(creator.id)

  if (!existingUser) {
    const newUser = await addUser({
      email: email,
      firstName: firstName || '',
      lastName: lastName || '',
      source: creatorDBUser?.source,
      accounts: {
        create: {
          status: UserStatus.VALIDATED,
          role: Role.DEFAULT,
        },
      },
    })

    if (!skipInviteEmail) {
      await sendInvitation(
        email,
        study,
        organizationVersion.organization,
        creator,
        newRoleOnStudy ? t(newRoleOnStudy).toLowerCase() : '',
      )
    }

    const newAccountId = newUser.accounts[0]?.id
    if (!newAccountId) {
      throw new Error()
    }

    accountId = newAccountId
  } else {
    let account = (await getAccountByEmail(email)) as AccountWithUser

    if (!account) {
      account = (await addAccount({
        user: { connect: { id: existingUser.id } },
        role: Role.COLLABORATOR,
        status: UserStatus.VALIDATED,
      })) as AccountWithUser
    } else if (account.status === UserStatus.IMPORTED) {
      await updateAccount(account.id, {
        organizationVersion: { disconnect: true },
        status: UserStatus.VALIDATED,
        role: Role.COLLABORATOR,
      })
      account = (await getAccountByEmail(email)) as AccountWithUser
    }

    if (!skipInviteEmail) {
      await sendInvitation(
        email,
        study,
        organizationVersion.organization,
        creator,
        newRoleOnStudy ? t(newRoleOnStudy).toLowerCase() : '',
        account,
      )
    }
    accountId = account.id
  }

  return accountId
}

export const newStudyRight = async (right: NewStudyRightCommand) =>
  withServerResponse('newStudyRight', async () => {
    const session = await dbActualizedAuth()
    if (!session || !session.user) {
      throw new Error(NOT_AUTHORIZED)
    }

    const lowerCasedEmail = right.email.toLowerCase()

    const [studyWithRights, existingAccount, existingUser] = await Promise.all([
      getStudyById(right.studyId, session.user.organizationVersionId),
      getAccountByEmailAndOrganizationVersionId(lowerCasedEmail, session.user.organizationVersionId),
      getUserByEmail(lowerCasedEmail),
    ])

    if (!studyWithRights) {
      throw new Error(NOT_AUTHORIZED)
    }

    if (!existingUser || !hasSufficientLevel(existingUser.level, studyWithRights.level)) {
      right.role = StudyRole.Reader
    }

    if (!canAddRightOnStudy(session.user, studyWithRights, existingUser, right.role)) {
      throw new Error(NOT_AUTHORIZED)
    }

    const organizationVersion = await getOrganizationVersionById(studyWithRights.organizationVersionId)
    if (!organizationVersion) {
      throw new Error(NOT_AUTHORIZED)
    }

    if (studyWithRights.allowedUsers.some((allowedUser) => allowedUser.accountId === existingAccount?.id)) {
      throw new Error(ALREADY_IN_STUDY)
    }

    if (
      existingAccount &&
      isAdminOnStudyOrga(
        accountWithUserToUserSession(existingAccount as AccountWithUser),
        studyWithRights.organizationVersion,
      ) &&
      hasSufficientLevel(existingAccount.user.level, studyWithRights.level)
    ) {
      right.role = StudyRole.Validator
    }

    if (
      existingAccount &&
      existingUser &&
      studyWithRights.isPublic &&
      (await isInOrgaOrParentFromId(existingAccount.organizationVersionId, studyWithRights.organizationVersionId))
    ) {
      const defaultRole = getUserRoleOnPublicStudy(
        { role: existingAccount.role, level: existingUser?.level },
        studyWithRights.level,
      )
      if (!getAllowedRolesFromDefaultRole(defaultRole).includes(right.role)) {
        right.role = defaultRole
      }
    }

    const accountId = await getOrCreateUserAndSendStudyInvite(
      lowerCasedEmail,
      studyWithRights,
      organizationVersion as OrganizationVersionWithOrganization,
      session.user,
      existingUser,
      right.role,
    )

    await createUserOnStudy({
      account: { connect: { id: accountId } },
      study: { connect: { id: studyWithRights.id } },
      role: right.role,
    })
  })

export const changeStudyRole = async (studyId: string, email: string, studyRole: StudyRole) =>
  withServerResponse('changeStudyRole', async () => {
    const session = await dbActualizedAuth()
    if (!session || !session.user || !session.user.organizationVersionId) {
      throw new Error(NOT_AUTHORIZED)
    }

    const [studyWithRights, existingAccount, existingUser] = await Promise.all([
      getStudyById(studyId, session.user.organizationVersionId),
      getAccountByEmailAndOrganizationVersionId(email, session.user.organizationVersionId),
      getUserByEmail(email),
    ])

    if (!studyWithRights || !existingAccount) {
      throw new Error(NOT_AUTHORIZED)
    }

    if (!canAddRightOnStudy(session.user, studyWithRights, existingUser, studyRole)) {
      throw new Error(NOT_AUTHORIZED)
    }

    if (
      existingAccount &&
      isAdminOnStudyOrga(
        accountWithUserToUserSession(existingAccount as AccountWithUser),
        studyWithRights.organizationVersion,
      ) &&
      studyRole !== StudyRole.Validator
    ) {
      throw new Error(NOT_AUTHORIZED)
    }

    if (
      existingAccount &&
      !hasSufficientLevel(existingAccount.user.level, studyWithRights.level) &&
      studyRole !== StudyRole.Reader
    ) {
      throw new Error(NOT_AUTHORIZED)
    }

    if (
      existingAccount &&
      existingUser &&
      studyWithRights.isPublic &&
      (await isInOrgaOrParentFromId(existingAccount.organizationVersionId, studyWithRights.organizationVersionId))
    ) {
      const defaultRole = getUserRoleOnPublicStudy(
        { role: existingAccount.role, level: existingUser?.level },
        studyWithRights.level,
      )
      if (!getAllowedRolesFromDefaultRole(defaultRole).includes(studyRole)) {
        throw new Error(NOT_AUTHORIZED)
      }
    }

    await updateUserOnStudy(existingAccount.id, studyWithRights.id, studyRole)
  })

export const deleteStudyCommand = async ({ id, name }: DeleteCommand) =>
  withServerResponse('deleteStudyCommand', async () => {
    if (!(await canDeleteStudy(id))) {
      throw new Error(NOT_AUTHORIZED)
    }
    const studyName = await getStudyNameById(id)
    if (!studyName) {
      throw new Error(NOT_AUTHORIZED)
    }

    if (studyName.toLowerCase() !== name.toLowerCase()) {
      throw new Error('wrongName')
    }
    await deleteStudy(id)
  })

export const findStudiesWithSites = async (siteIds: string[]) =>
  withServerResponse('findStudiesWithSites', async () => {
    const [session, studySites] = await Promise.all([dbActualizedAuth(), getStudiesSitesFromIds(siteIds)])

    const user = session?.user
    const authorizedStudySites: AsyncReturnType<typeof getStudiesSitesFromIds> = []
    const unauthorizedStudySites: (Pick<AsyncReturnType<typeof getStudiesSitesFromIds>[0], 'site' | 'study'> & {
      count: number
    })[] = []

    studySites.forEach((studySite) => {
      if (
        user &&
        (studySite.study.allowedUsers.some((allowedUser) => allowedUser.accountId === user.accountId) ||
          getAccountRoleOnStudy(user, {
            ...studySite.study,
            organizationVersion: {
              id: studySite.study.organizationVersion.id,
              parentId: studySite.study.organizationVersion.parentId,
            },
            allowedUsers: studySite.study.allowedUsers.map((allowedUser) => ({
              role: StudyRole.Reader,
              account: { id: allowedUser.accountId, user: { email: '' } },
            })),
          }))
      ) {
        authorizedStudySites.push(studySite)
      } else {
        const targetedSite = unauthorizedStudySites.find(
          (unauthorizedStudySite) =>
            unauthorizedStudySite.site.name === studySite.site.name &&
            unauthorizedStudySite.site.organization.id === studySite.site.organization.id,
        )
        if (!targetedSite) {
          unauthorizedStudySites.push({ site: studySite.site, study: studySite.study, count: 1 })
        } else {
          targetedSite.count++
        }
      }
    })

    return {
      authorizedStudySites,
      unauthorizedStudySites,
    }
  })

export const deleteStudyMember = async (member: FullStudy['allowedUsers'][0], studyId: string) =>
  withServerResponse('deleteStudyMember', async () => {
    const [session, study] = await Promise.all([dbActualizedAuth(), getStudy(studyId)])
    if (
      !session?.user ||
      !study.success ||
      !study.data ||
      !hasEditionRights(getAccountRoleOnStudy(session.user, study.data))
    ) {
      throw new Error(NOT_AUTHORIZED)
    }

    await deleteAccountOnStudy(studyId, member.accountId)
  })

export const getOrganizationStudiesFromOtherUsers = async (organizationVersionId: string, accountId: string) =>
  withServerResponse('getOrganizationStudiesFromOtherUsers', async () => {
    return countOrganizationStudiesFromOtherUsers(organizationVersionId, accountId)
  })

export const getCncByCncCode = async (cncCode: string) =>
  withServerResponse('getCncByCncCode', async () => {
    const session = await dbActualizedAuth()
    if (!session || !session.user) {
      throw new Error(NOT_AUTHORIZED)
    }

    return await findCncByCncCode(cncCode)
  })

export const getStudyOrganizationMembers = async (studyId: string) =>
  withServerResponse('getStudyOrganizationMembers', async () => {
    const session = await dbActualizedAuth()
    if (!session || !session.user) {
      throw new Error(NOT_AUTHORIZED)
    }
    const userOrganizationId = session.user.organizationVersionId
    const study = await getStudyById(studyId, userOrganizationId)
    if (!study) {
      throw new Error(NOT_AUTHORIZED)
    }
    if (
      study.organizationVersion.id !== userOrganizationId &&
      study.organizationVersion.parentId !== userOrganizationId
    ) {
      throw new Error(NOT_AUTHORIZED)
    }
    return getAccountsFromOrganization(study.organizationVersionId)
  })
