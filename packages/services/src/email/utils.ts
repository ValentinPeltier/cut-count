import { Environment } from '@abc-transitionbascarbone/db-common/enums'

export const getEnvRoute = (path: string, _env?: Environment) => `/${path}`

export const getEnvResetLink = (path: string, token: string, env?: Environment) => {
  const route = getEnvRoute(path, env)

  return `${process.env.NEXTAUTH_URL}${route}/${token}`
}
