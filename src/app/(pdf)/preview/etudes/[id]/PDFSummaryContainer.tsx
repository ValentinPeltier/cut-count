'use client'

import type { FullStudy } from '@/db/study'
import PDFSummaryCut from '@/environments/cut/study/PDF/PDFSummary'
import { getMessages } from '@/i18n/utils'
import { LocaleType } from '@/lib/i18n/config'
import { NextIntlClientProvider } from 'next-intl'
import { useEffect, useState } from 'react'

interface Props {
  study: FullStudy
  locale: LocaleType
}

const PDFSummaryContainer = ({ study, locale }: Props) => {
  const [messages, setMessages] = useState<{ locale: LocaleType; messages: object } | null>(null)

  useEffect(() => {
    const setMessagesLocale = async () => {
      const messages = await getMessages(locale)
      setMessages(messages)
    }
    setMessagesLocale()
  }, [locale])

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
