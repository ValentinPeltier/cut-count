import { findAccountSelect } from '@/db/common.select'
import type { Prisma } from '@/generated/prisma/client'
import { Role, UserStatus } from '@/generated/prisma/enums'
import { CutRoles } from '@/services/roles'
import { UserSession } from 'next-auth'

export const isAdmin = (userRole: Role): boolean => userRole === Role.ADMIN

export const findUserInfo = (user: UserSession) =>
  ({
    select: findAccountSelect(),
    where: canEditMemberRole(user)
      ? { organizationVersionId: user.organizationVersionId }
      : { status: UserStatus.ACTIVE, organizationVersionId: user.organizationVersionId },
  }) satisfies Prisma.AccountFindManyArgs

export const getTeamRoles = () => CutRoles

export const getRoleToSetForUntrained = (role: Role) => role

export const canEditMemberRole = (account: UserSession) => isAdmin(account.role)
