'use client'

import { FullStudy } from '@/db/study'
import { deleteStudyCommand } from '@/services/serverFunctions/study'
import { DeleteCommand, DeleteCommandValidation } from '@/services/serverFunctions/study.command'
import { Props as BlockProps } from '@abc-transitionbascarbone/components/src/base/Block'
import { useServerFunction } from '@abc-transitionbascarbone/components/src/hooks/useServerFunction'
import { StudyRole } from '@abc-transitionbascarbone/db-common/enums'
import { zodResolver } from '@hookform/resolvers/zod'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import DeletionModal from '../modals/DeletionModal'

interface Props {
  study: FullStudy
  organizationVersionId?: string | null
  canDeleteStudy?: boolean
  canDuplicateStudy?: boolean
  duplicableEnvironments?: unknown
  userRole?: StudyRole
  siteId?: string
  children: (actions: BlockProps['actions']) => ReactNode
}

const StudyManagementActions = ({ study, canDeleteStudy, children }: Props) => {
  const [deleting, setDeleting] = useState(false)
  const { callServerFunction } = useServerFunction()
  const t = useTranslations('study')
  const tStudyDelete = useTranslations('study.delete')
  const tCommon = useTranslations('common')
  const router = useRouter()

  const form = useForm<DeleteCommand>({
    resolver: zodResolver(DeleteCommandValidation),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      id: study.id,
      name: '',
    },
  })

  const onDelete = async () => {
    await callServerFunction(() => deleteStudyCommand(form.getValues()), {
      getErrorMessage: (error) => (tStudyDelete.has(error) ? tStudyDelete(error) : tCommon('error')),
      onSuccess: () => {
        router.push('/')
      },
    })
  }

  const deleteAction: BlockProps['actions'] = canDeleteStudy
    ? [
        {
          actionType: 'button',
          'data-testid': 'delete-study',
          onClick: () => setDeleting(true),
          children: <DeleteIcon />,
          title: t('deleteStudy'),
          variant: 'contained',
          color: 'error',
        },
      ]
    : []

  return (
    <>
      {children(deleteAction)}
      {deleting && (
        <DeletionModal
          form={form}
          type="study"
          onDelete={onDelete}
          onClose={() => setDeleting(false)}
          t={tStudyDelete}
        />
      )}
    </>
  )
}

export default StudyManagementActions
