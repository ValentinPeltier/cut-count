import { Environment } from '@abc-transitionbascarbone/db-common/enums'

export const getEnvRoute = (path: string, env?: Environment) => {
  let base = ''
  switch (env) {
    case Environment.CUT:
      base = '/count'
      break
    default:
      break
  }

  return `${base}/${path}`
}

export const getEnvResetLink = (path: string, token: string, env?: Environment) => {
  const route = getEnvRoute(path, env)

  return `${process.env.NEXTAUTH_URL}${route}/${token}`
}
