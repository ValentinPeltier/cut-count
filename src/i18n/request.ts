import { getRequestConfig } from 'next-intl/server'
import { getLocale } from './locale'
import { getMessages } from './utils'

export default getRequestConfig(async () => {
  const locale = await getLocale()
  return getMessages(locale)
})
