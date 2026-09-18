import { Locale } from '@abc-transitionbascarbone/i18n/config'
import { getRequestConfig } from 'next-intl/server'
import { getMessages } from './utils'

export default getRequestConfig(async () => getMessages(Locale.FR))
