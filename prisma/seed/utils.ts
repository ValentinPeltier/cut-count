import { Role } from '@/generated/prisma/enums'

export const getRolesFromEnvironment = (role: Role) => getCutRoleFromBase(role)

/** Count account roles: ADMIN, SUPER_ADMIN, or DEFAULT (legacy BC roles map to DEFAULT). */
export const getCutRoleFromBase = (role: Role): Role => {
  switch (role) {
    case Role.ADMIN:
      return Role.ADMIN
    case Role.SUPER_ADMIN:
      return Role.SUPER_ADMIN
    default:
      return Role.DEFAULT
  }
}
