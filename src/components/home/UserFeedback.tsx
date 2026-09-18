'use client'

import Modal from '@/lib/components/modals/Modal'
import { DAY, TIME_IN_MS } from '@/lib/utils/time'
import { answerFeeback, delayFeeback } from '@/services/serverFunctions/user'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import FeedbackForm from './FeedbackForm'

const delayDuration = process.env.NEXT_PUBLIC_FEEDBACK_TYPEFORM_DELAY

const UserFeedback = () => {
  const tCommon = useTranslations('common')
  const t = useTranslations('feedback')
  const [open, setOpen] = useState(true)
  const [displayForm, setDisplayForm] = useState(false)

  const onClose = () => {
    answerFeeback()
    setOpen(false)
  }

  const delay = () => {
    delayFeeback()
    setOpen(false)
  }

  const answer = () => {
    answerFeeback()
    setDisplayForm(true)
  }

  return (
    <>
      <Modal
        label="feedback"
        open={open}
        onClose={onClose}
        title={t('title')}
        actions={
          displayForm
            ? [{ actionType: 'button', children: tCommon('action.close'), onClick: onClose }]
            : [
                { actionType: 'button', children: t('reject'), onClick: onClose },
                {
                  actionType: 'button',
                  children: t('delay', { time: Number(delayDuration) / (DAY * TIME_IN_MS) }),
                  onClick: delay,
                },
                { actionType: 'button', children: t('answer'), onClick: answer },
              ]
        }
      >
        {displayForm ? <FeedbackForm /> : <>{t('body')}</>}
      </Modal>
    </>
  )
}

export default UserFeedback
