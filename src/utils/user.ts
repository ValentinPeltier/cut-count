import type { Prisma } from '@/db-common'
import { Role, UserStatus } from '@/db-common/enums'
import { findAccountSelect } from '@/db/common.select'
import { CutRoles } from '@/services/roles'
import { UserSession } from 'next-auth'

export const isAdmin = (userRole: Role) => userRole === Role.ADMIN || userRole === Role.SUPER_ADMIN

export const findUserInfo = (user: UserSession) =>
  ({
    select: findAccountSelect(),
    where: canEditMemberRole(user)
      ? { organizationVersionId: user.organizationVersionId }
      : { status: UserStatus.ACTIVE, organizationVersionId: user.organizationVersionId },
  }) satisfies Prisma.AccountFindManyArgs

export const getTeamRoles = () => CutRoles

export const getRoleToSetForUntrained = (role: Exclude<Role, 'SUPER_ADMIN'>) => role

export const canEditMemberRole = (account: UserSession) => isAdmin(account.role) || account.role === Role.GESTIONNAIRE
