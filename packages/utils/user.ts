import { Environment, Role } from '@abc-transitionbascarbone/db-common/enums'
import { isSimplified } from './environments'

export const canBeUntrainedRole = (role: Role, environment: Environment) => {
  if (isSimplified(environment)) {
    return true
  }

  const untrainedRoles = [Role.GESTIONNAIRE, Role.DEFAULT] as Role[]

  return untrainedRoles.includes(role)
}
