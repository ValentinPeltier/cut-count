import type { FullStudy } from '@/db/study'
import { Level, StudyResultUnit, StudyRole } from '@/generated/prisma/enums'
import { Post, STUDY_UNIT_VALUES } from '@/lib/utils/charts'
import { formatNumber } from '@/lib/utils/number'
import { isAdminOnStudyOrga } from '@/services/permissions/study.utils'
import { isAdmin } from '@/utils/user'
import { UserSession } from 'next-auth'
import { isInOrgaOrParent } from './organization'

export const getUserRoleOnPublicStudy = (user: Pick<UserSession, 'role' | 'level'>, studyLevel: Level) => {
  if (isAdmin(user.role)) {
    return hasSufficientLevel(user.level, studyLevel) ? StudyRole.Validator : StudyRole.Reader
  }

  return StudyRole.Editor
}

export type StudyWithRoleFields = {
  id: string
  level: Level
  isPublic: boolean
  simplified: boolean
  ownerAccountId?: string
  organizationVersion: {
    id: string
    parentId: string | null
  } | null
  allowedUsers: { role: StudyRole; account: { id: string; user: { email: string } } }[]
}

export const getAccountRoleOnStudy = (user: UserSession, study: StudyWithRoleFields) => {
  if (study.organizationVersion && isAdminOnStudyOrga(user, study.organizationVersion)) {
    return hasSufficientLevel(user.level, study.level) ? StudyRole.Validator : StudyRole.Reader
  }

  const right = study.allowedUsers.find((studyRight) => studyRight.account.id === user.accountId)
  if (right) {
    return hasSufficientLevel(user.level, study.level) ? right.role : StudyRole.Reader
  }

  if (
    study.isPublic &&
    study.organizationVersion &&
    isInOrgaOrParent(user.organizationVersionId, study.organizationVersion)
  ) {
    return getUserRoleOnPublicStudy(user, study.level)
  }

  return null
}

export const getDisplayedRoleOnStudy = (user: UserSession, study: StudyWithRoleFields) => {
  return getAccountRoleOnStudy(user, study)
}

export const getAllowedRolesFromDefaultRole = (role: StudyRole) => {
  switch (role) {
    case StudyRole.Reader:
      return [StudyRole.Reader]
    case StudyRole.Editor:
      return [StudyRole.Editor, StudyRole.Validator]
    default:
      return Object.values(StudyRole)
  }
}

export const defaultPostColor = 'blue'

export const postColors: Record<Post, string> = {
  [Post.Fonctionnement]: 'darkBlue',
  [Post.MobiliteSpectateurs]: 'darkBlue',
  [Post.TourneesAvantPremieres]: 'darkBlue',
  [Post.SallesEtCabines]: 'darkBlue',
  [Post.ConfiseriesEtBoissons]: 'orange',
  [Post.Dechets]: 'darkBlue',
  [Post.BilletterieEtCommunication]: 'darkBlue',
}

export const hasEditionRights = (userRoleOnStudy: StudyRole | null) => {
  return userRoleOnStudy && userRoleOnStudy !== StudyRole.Reader
}

export const defaultStudyResultUnit = StudyResultUnit.T

export const convertValue = (value: number, fromUnit: StudyResultUnit, toUnit: StudyResultUnit): number => {
  return (value * STUDY_UNIT_VALUES[fromUnit]) / STUDY_UNIT_VALUES[toUnit]
}

export const getEmissionValueString = (
  value: number | null | undefined,
  resultsUnit: StudyResultUnit,
  unitLabel: string,
  decimals: number = 0,
): string => {
  const safeValue = value ?? 0
  return `${formatNumber(safeValue / STUDY_UNIT_VALUES[resultsUnit], decimals)} ${unitLabel}`
}

export const formatEmissionValueForExport = (value: number, unit: StudyResultUnit): number => {
  return Math.round(value / STUDY_UNIT_VALUES[unit])
}

export const getAllowedLevels = (level: Level | null) => {
  switch (level) {
    case Level.Initial:
      return [Level.Initial]
    case Level.Standard:
      return [Level.Initial, Level.Standard]
    case Level.Advanced:
      return [Level.Initial, Level.Standard, Level.Advanced]
    default:
      return []
  }
}

export const hasSufficientLevel = (userLevel: Level | null, targetLevel: Level) =>
  userLevel ? getAllowedLevels(userLevel).includes(targetLevel) : false

export const getStudyDefaultLandingPath = async (studyId: string) => {
  return `/etudes/${studyId}/cadrage`
}

export const getSiteLabelFromId = (study: FullStudy, siteId: string, tOrga: (key: string) => string): string => {
  if (siteId === 'all') {
    return tOrga('allSites')
  }
  const site = study.sites.find((studySite) => studySite.site.id === siteId)
  return site?.site.name ?? ''
}

export const sanitizeStudyName = (name: string) => {
  return name
    .replace(/[/\\?%*:|"<>]/g, '-')
    .replace(/\s+/g, '_')
    .trim()
}
