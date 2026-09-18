import { Environment } from '@abc-transitionbascarbone/db-common/enums'
import { signIn, signOut, SignOutParams } from 'next-auth/react'

export async function accountHandler(accountId: string) {
  return await signIn('credentials', {
    redirect: false,
    accountId,
  })
}

export const signOutEnv = async <P extends boolean = true>(
  _env: Environment = Environment.CUT,
  options?: SignOutParams<P>,
): Promise<P extends true ? void : { url: string }> => {
  const result = (await signOut({
    callbackUrl: '/login',
    ...options,
  })) as P extends true ? void : { url: string }

  return result
}
