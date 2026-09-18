import { CutRoles } from '@/services/roles'
import type { Prisma } from '@abc-transitionbascarbone/db-common'
import { findAccountSelect } from '@abc-transitionbascarbone/db-common/db/common.select'
import { Environment, Role, UserStatus } from '@abc-transitionbascarbone/db-common/enums'
import { UserSession } from 'next-auth'

export const isAdmin = (userRole: Role) => userRole === Role.ADMIN || userRole === Role.SUPER_ADMIN

export const findUserInfo = (user: UserSession) =>
  ({
    select: findAccountSelect(),
    where: canEditMemberRole(user)
      ? { organizationVersionId: user.organizationVersionId }
      : { status: UserStatus.ACTIVE, organizationVersionId: user.organizationVersionId },
  }) satisfies Prisma.AccountFindManyArgs

export const getEnvironmentRoles = (_environment?: Environment) => CutRoles

export const getRoleToSetForUntrained = (role: Exclude<Role, 'SUPER_ADMIN'>, _environment?: Environment) => role

export const canEditMemberRole = (account: UserSession) => isAdmin(account.role) || account.role === Role.GESTIONNAIRE
