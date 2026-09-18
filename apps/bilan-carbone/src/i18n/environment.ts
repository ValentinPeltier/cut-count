'use server'

import { Environment } from '@abc-transitionbascarbone/db-common/enums'
import { cookies as getCookies } from 'next/headers'

const COOKIE_NAME = 'ENVIRONMENT'

export const getEnvironment = async (): Promise<Environment> => {
  const cookies = await getCookies()
  return (cookies.get(COOKIE_NAME)?.value as Environment) || Environment.CUT
}

export const switchEnvironment = async (value: Environment = Environment.CUT) => {
  const cookies = await getCookies()
  cookies.set(COOKIE_NAME, value)
}
