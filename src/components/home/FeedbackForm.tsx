import { appendForm } from '@/utils/form'
import { useEffect } from 'react'

const typeformId = process.env.NEXT_PUBLIC_FEEDBACK_TYPEFORM_ID
const cutTypeformId = process.env.NEXT_PUBLIC_CUT_FEEDBACK_TYPEFORM_ID

const FeedbackForm = () => {
  'use memo'

  const formId = cutTypeformId || typeformId

  useEffect(() => {
    appendForm()
  }, [])

  return formId ? <div className="typeform" data-tf-live={formId} /> : <></>
}

export default FeedbackForm
