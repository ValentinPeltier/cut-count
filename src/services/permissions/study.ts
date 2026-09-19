import { getAccountById } from '@/db/account'
import { getOrganizationVersionForRightsCheck } from '@/db/organization'
import { FullStudy, getStudyById } from '@/db/study'
import { getAccountByIdWithAllowedStudies, UserWithAllowedStudies } from '@/db/user'
import type { Prisma, Study, User } from '@/generated/prisma/client'
import { Level, StudyRole } from '@/generated/prisma/enums'
import { hasActiveLicence, isInOrgaOrParent } from '@/utils/organization'
import { getAccountRoleOnStudy, hasEditionRights, hasSufficientLevel, StudyWithRoleFields } from '@/utils/study'
import { UserSession } from 'next-auth'
import { dbActualizedAuth } from '../auth'
import { isInOrgaOrParentFromId } from './organization'
import { isAdminOnStudyOrga } from './study.utils'

export const canReadStudy = async (user: UserSession | UserWithAllowedStudies, studyId: string) => {
  if (!user) {
    return false
  }

  const study = await getStudyById(studyId, user.organizationVersionId)

  if (!study) {
    return false
  }

  if (
    isAdminOnStudyOrga(user as UserSession, study.organizationVersion) ||
    (study.isPublic && isInOrgaOrParent(user.organizationVersionId, study.organizationVersion))
  ) {
    return true
  }

  let allowedStudiesId: string[]
  if ('allowedStudies' in user) {
    allowedStudiesId = [...user.allowedStudies.map((allowedStudy) => allowedStudy.studyId)]
  } else {
    const accountWithAllowedStudies = await getAccountByIdWithAllowedStudies(user.accountId)
    if (!accountWithAllowedStudies) {
      return false
    }
    allowedStudiesId = [...accountWithAllowedStudies.allowedStudies.map((allowedStudy) => allowedStudy.studyId)]
  }

  if (allowedStudiesId.some((allowedStudiesId) => allowedStudiesId === study.id)) {
    return true
  }

  return false
}

export const filterAllowedStudies = async (user: UserSession, studies: Study[]) => {
  const userWithAllowedStudies = await getAccountByIdWithAllowedStudies(user.accountId)

  const allowedStudies = await Promise.all(
    studies.map(async (study) => ((await canReadStudy(userWithAllowedStudies, study.id)) ? study : null)),
  )
  return allowedStudies.filter((study) => study !== null)
}

export const canCreateAStudy = async (user: UserSession, _simplified: boolean = false) => {
  return !!user.organizationVersionId
}

const canCreateSpecificStudyCommon = async (accountId: string, organizationVersionId: string) => {
  const dbAccount = await getAccountById(accountId)

  if (!dbAccount) {
    return { allowed: false }
  }

  if (!(await isInOrgaOrParentFromId(dbAccount.organizationVersionId, organizationVersionId))) {
    return { allowed: false }
  }

  const organizationVersion = await getOrganizationVersionForRightsCheck(organizationVersionId)
  if (!organizationVersion || !hasActiveLicence(organizationVersion)) {
    return { allowed: false }
  }

  return { allowed: true, account: dbAccount }
}

const canCreateSpecificStudySimplified = async (accountId: string, organizationVersionId: string) => {
  const { allowed } = await canCreateSpecificStudyCommon(accountId, organizationVersionId)
  return allowed
}

export const canCreateSpecificStudy = async (
  user: UserSession,
  _study: Prisma.StudyCreateInput,
  organizationVersionId: string,
) => {
  return canCreateSpecificStudySimplified(user.accountId, organizationVersionId)
}

const canEditStudy = async (user: UserSession, study: FullStudy) => {
  const organizationVersion = await getOrganizationVersionForRightsCheck(
    study.organizationVersion.parentId ? study.organizationVersion.parentId : study.organizationVersionId,
  )
  if (!organizationVersion) {
    return false
  }

  if (!hasActiveLicence(organizationVersion)) {
    return false
  }

  if (isAdminOnStudyOrga(user, study.organizationVersion)) {
    return true
  }

  const userRightsOnStudy = getAccountRoleOnStudy(user, study)
  if (!userRightsOnStudy || !hasEditionRights(userRightsOnStudy)) {
    return false
  }

  return true
}

export const canChangePublicStatus = async (user: UserSession, study: FullStudy) => {
  return canEditStudy(user, study)
}

export const canUpgradeSourceVersion = async (user: UserSession, study: FullStudy) => {
  return canEditStudy(user, study)
}

export const canChangeDates = async (user: UserSession, study: FullStudy) => {
  return canEditStudy(user, study)
}

export const canChangeSites = async (user: UserSession, study: FullStudy) => {
  return canEditStudy(user, study)
}

export const canChangeLevel = async (user: UserSession, study: FullStudy, level: Level) => {
  if (!(await canEditStudy(user, study))) {
    return false
  }

  if (!hasSufficientLevel(user.level, level)) {
    return false
  }

  return true
}

export const canChangeResultsUnit = async (user: UserSession, study: FullStudy) => {
  return canEditStudy(user, study)
}

export const canChangeName = async (user: UserSession, study: FullStudy) => {
  return canEditStudy(user, study)
}

export const canChangeOpeningHours = async (user: UserSession, study: FullStudy) => {
  return canEditStudy(user, study)
}

export const canAddRightOnStudy = (
  user: UserSession,
  study: FullStudy,
  userToAddOnStudy: User | null,
  role: StudyRole,
) => {
  if (userToAddOnStudy && user.accountId === userToAddOnStudy.id) {
    return false
  }

  if (!userToAddOnStudy && role !== StudyRole.Reader) {
    return false
  }

  const userRoleOnStudy = getAccountRoleOnStudy(user, study)

  if (!userRoleOnStudy || userRoleOnStudy === StudyRole.Reader) {
    return false
  }

  if (role === StudyRole.Validator && userRoleOnStudy !== StudyRole.Validator) {
    return false
  }

  return true
}

export const canAddContributorOnStudy = (user: UserSession, study: FullStudy) => {
  if (isAdminOnStudyOrga(user, study.organizationVersion)) {
    return true
  }

  const userRightsOnStudy = getAccountRoleOnStudy(user, study)
  if (!userRightsOnStudy || userRightsOnStudy === StudyRole.Reader) {
    return false
  }

  return true
}

export const canDeleteStudy = async (studyId: string) => {
  const session = await dbActualizedAuth()

  if (!session) {
    return false
  }

  const study = await getStudyById(studyId, session.user.organizationVersionId)

  if (!study) {
    return false
  }

  if (study.createdById === session.user.accountId) {
    return true
  }

  const accountRoleOnStudy = getAccountRoleOnStudy(session.user, study)

  if (accountRoleOnStudy && accountRoleOnStudy === StudyRole.Validator) {
    return true
  }

  return false
}

export const filterStudyEmissionSources = (_user: UserSession, study: FullStudy) => study

export const canReadStudyDetail = async (user: UserSession, study: StudyWithRoleFields) => {
  const studyRight = await canReadStudy(user, study.id)
  if (!studyRight) {
    return false
  }

  if (
    isAdminOnStudyOrga(user, study.organizationVersion) ||
    (study.isPublic && isInOrgaOrParent(user.organizationVersionId, study.organizationVersion))
  ) {
    return true
  }

  const userRightsOnStudy = study.allowedUsers.find((right) => right.account.user.email === user.email)
  if (!userRightsOnStudy) {
    return false
  }

  return true
}

export const canAccessStudyFlows = async (studyId: string) => {
  const session = await dbActualizedAuth()

  if (!session || !session.user) {
    return false
  }

  const study = await getStudyById(studyId, session.user.organizationVersionId)
  if (!study || !getAccountRoleOnStudy(session.user, study)) {
    return false
  }

  return true
}

export const canEditStudyFlows = async (studyId: string) => {
  const session = await dbActualizedAuth()
  if (!session) {
    return false
  }
  const study = await getStudyById(studyId, session.user.organizationVersionId)

  if (!study) {
    return false
  }

  const userRoleOnStudy = getAccountRoleOnStudy(session.user, study)
  if (!userRoleOnStudy || userRoleOnStudy === StudyRole.Reader) {
    return false
  }

  return true
}

export const hasReadAccessOnStudy = async (studyId: string, session?: { user: UserSession }) => {
  const actualSession = session ?? (await dbActualizedAuth())
  if (!actualSession || !actualSession.user) {
    return false
  }

  return canReadStudy(actualSession.user, studyId)
}

export const hasEditAccessOnStudy = async (studyId: string, session?: { user: UserSession }) => {
  const actualSession = session ?? (await dbActualizedAuth())
  if (!actualSession || !actualSession.user) {
    return false
  }

  const study = await getStudyById(studyId, actualSession.user.organizationVersionId)
  if (!study) {
    return false
  }

  return canEditStudy(actualSession.user, study)
}
