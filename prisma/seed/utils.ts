import { Role } from '@/db-common/enums'

export const getRolesFromEnvironment = (_role: Role) => getCutRoleFromBase(_role)

export const getCutRoleFromBase = (role: Role): Role => {
  switch (role) {
    case Role.ADMIN:
    case Role.GESTIONNAIRE:
    case Role.SUPER_ADMIN:
      return Role.ADMIN
    default:
      return Role.DEFAULT
  }
}
