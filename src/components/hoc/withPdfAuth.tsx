import { FullStudy, getStudyById } from '@/db/study'
import NotFound from '@/lib/components/pages/NotFound'
import { LocaleType } from '@/lib/i18n/config'
import { hasReadAccessOnStudy } from '@/services/permissions/study'
import { dbActualizedAuth } from '@/services/auth'
import { getLocale } from 'next-intl/server'
import React from 'react'

export type PdfAuthProps = {
  study: FullStudy
  locale: LocaleType
}

interface Props {
  params: Promise<{
    id: string
  }>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withPdfAuth = (WrappedComponent: React.ComponentType<any & PdfAuthProps>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = async (props: any & Props) => {
    const params = await props.params
    const studyId = params.id

    if (!studyId) {
      console.error('studyId not found')
      return <NotFound />
    }

    const session = await dbActualizedAuth()
    if (!session?.user) {
      return <NotFound />
    }

    const hasAccess = await hasReadAccessOnStudy(studyId)
    if (!hasAccess) {
      return <NotFound />
    }

    const study = await getStudyById(studyId, session.user.organizationVersionId)
    if (!study) {
      return <NotFound />
    }

    const locale = (await getLocale()) as LocaleType
    return <WrappedComponent {...props} study={study} locale={locale} />
  }

  Component.displayName = 'WithPdfAuth'
  return Component
}

export default withPdfAuth
