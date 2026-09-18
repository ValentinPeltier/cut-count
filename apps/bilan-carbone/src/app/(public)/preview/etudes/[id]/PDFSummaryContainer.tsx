'use client'
import type { FullStudy } from '@/db/study'
import PDFSummaryCut from '@/environments/cut/study/PDF/PDFSummary'
import { getMessages } from '@/i18n/utils'
import { Environment } from '@abc-transitionbascarbone/db-common/enums'
import { LocaleType } from '@abc-transitionbascarbone/i18n/config'
import { NextIntlClientProvider } from 'next-intl'
import { useEffect, useState } from 'react'

interface Props {
  study: FullStudy
  environment: Environment
  locale: LocaleType
}

const PDFSummaryContainer = ({ study, environment, locale }: Props) => {
  const [messages, setMessages] = useState<{ locale: LocaleType; messages: object } | null>(null)

  useEffect(() => {
    const setMessagesLocaleEnvironment = async () => {
      const messages = await getMessages(locale, environment)
      setMessages(messages)
    }
    setMessagesLocaleEnvironment()
  }, [environment, locale])

  if (!messages) {
    return null
  }

  return (
    <NextIntlClientProvider locale={messages.locale} messages={messages.messages}>
      <PDFSummaryCut study={study} />
    </NextIntlClientProvider>
  )
}

export default PDFSummaryContainer
