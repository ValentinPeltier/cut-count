import { getStudyById } from '@/db/study'
import NotFound from '@/lib/components/pages/NotFound'
import { canReadStudyDetail } from '@/services/permissions/study'
import React from 'react'
import { UserSessionProps } from './withAuth'
import { StudyProps } from './withStudy'

interface Props {
  params: Promise<{
    id: string
  }>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WithStudyDetails = (WrappedComponent: React.ComponentType<any & UserSessionProps & StudyProps>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = async (props: any & Props & UserSessionProps) => {
    const params = await props.params
    const id = params.id
    if (!id) {
      return <NotFound />
    }

    const study = await getStudyById(id, props.user.organizationVersionId)
    if (!study) {
      return <NotFound />
    }

    if (!(await canReadStudyDetail(props.user, study))) {
      return <NotFound />
    }

    return <WrappedComponent {...props} study={study} />
  }

  Component.displayName = 'WithStudyDetails'
  return Component
}

export default WithStudyDetails
