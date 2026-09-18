export const getEnvRoute = (path: string) => `/${path}`

export const getEnvResetLink = (path: string, token: string) => {
  const route = getEnvRoute(path)

  return `${process.env.NEXTAUTH_URL}${route}/${token}`
}
