import { Role } from '@/generated/prisma/enums'

/** Organization roles that can be selected in the team UI or via member APIs. */
export const ASSIGNABLE_ORGANIZATION_ROLES = [Role.ADMIN, Role.DEFAULT] as const

export type AssignableOrganizationRole = (typeof ASSIGNABLE_ORGANIZATION_ROLES)[number]

export const isAssignableOrganizationRole = (role: Role): role is AssignableOrganizationRole =>
  (ASSIGNABLE_ORGANIZATION_ROLES as readonly Role[]).includes(role)

export const CutRoles = {
  ADMIN: Role.ADMIN,
  DEFAULT: Role.DEFAULT,
} as const satisfies Record<string, AssignableOrganizationRole>
