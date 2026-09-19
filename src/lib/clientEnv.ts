type ClientEnvKey = 'SUPPORT_EMAIL' | 'FAQ_LINK' | 'ABC_SITE'

const firstDefined = (...values: (string | undefined)[]): string => {
  for (const value of values) {
    if (value) {
      return value
    }
  }

  return ''
}

// Static process.env access so Next.js can inline NEXT_PUBLIC_* in client bundles.
const CLIENT_ENV_VARS: Record<ClientEnvKey, string> = {
  SUPPORT_EMAIL: firstDefined(
    process.env.NEXT_PUBLIC_CUT_SUPPORT_EMAIL,
    process.env.CUT_SUPPORT_EMAIL,
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
    process.env.SUPPORT_EMAIL,
  ),
  FAQ_LINK: firstDefined(
    process.env.NEXT_PUBLIC_CUT_FAQ_LINK,
    process.env.CUT_FAQ_LINK,
    process.env.NEXT_PUBLIC_FAQ_LINK,
    process.env.FAQ_LINK,
  ),
  ABC_SITE: firstDefined(
    process.env.NEXT_PUBLIC_CUT_ABC_SITE,
    process.env.CUT_ABC_SITE,
    process.env.NEXT_PUBLIC_ABC_SITE,
    process.env.ABC_SITE,
  ),
}

export const getClientEnvVar = (key: ClientEnvKey) => CLIENT_ENV_VARS[key]
