'use server'

export const getEnvVar = async (key: string) => {
  const possibleKeys = [`NEXT_PUBLIC_CUT_${key}`, `CUT_${key}`, `NEXT_PUBLIC_${key}`, key]

  for (const envKey of possibleKeys) {
    const value = process.env[envKey]
    if (value) {
      return value
    }
  }

  return ''
}
