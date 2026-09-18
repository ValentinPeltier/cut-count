type ClientEnvKey = 'SUPPORT_EMAIL' | 'FAQ_LINK' | 'ABC_SITE'

export const getClientEnvVar = (key: ClientEnvKey) => {
  const possibleKeys = [`NEXT_PUBLIC_CUT_${key}`, `CUT_${key}`, `NEXT_PUBLIC_${key}`, key] as const

  for (const envKey of possibleKeys) {
    const value = process.env[envKey]
    if (value) {
      return value
    }
  }

  return ''
}
