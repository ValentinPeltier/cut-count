export const getEnvResetLink = (path: string, token: string) => {
  return `${process.env.NEXTAUTH_URL}/${path}/${token}`
}
