import { Environment } from '@/db-common/enums'
import { BCEnvironment } from '@/types/environment'
import { appendForm } from '@/utils/form'
import { useEffect } from 'react'

const typeformId = process.env.NEXT_PUBLIC_FEEDBACK_TYPEFORM_ID
const cutTypeformId = process.env.NEXT_PUBLIC_CUT_FEEDBACK_TYPEFORM_ID

interface Props {
  environment: BCEnvironment
}
const formPerEnvironmentTab: Record<BCEnvironment, string | undefined> = {
  [Environment.CUT]: cutTypeformId || typeformId,
}

const FeedbackForm = ({ environment }: Props) => {
  'use memo'

  const formId = formPerEnvironmentTab[environment] || typeformId

  useEffect(() => {
    appendForm()
  }, [])

  return formId ? <div className="typeform" data-tf-live={formId} /> : <></>
}

export default FeedbackForm
