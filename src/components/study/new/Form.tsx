'use client'

import { FormDatePicker } from '@/components/form/DatePicker'
import { HelpIcon } from '@/lib/components'
import Form from '@/lib/components/base/Form'
import IconLabel from '@/lib/components/base/IconLabel'
import LoadingButton from '@/lib/components/base/LoadingButton'
import { FormTextField } from '@/lib/components/form/TextField'
import { useServerFunction } from '@/lib/components/hooks/useServerFunction'
import GlossaryModal from '@/lib/components/modals/GlossaryModal'
import { customRich } from '@/lib/utils/customRich'
import { createStudyCommand } from '@/services/serverFunctions/study'
import { CreateStudyCommand } from '@/services/serverFunctions/study.command'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import styles from './Form.module.css'

interface Props {
  form: UseFormReturn<CreateStudyCommand>
  children?: React.ReactNode
  glossary?: string
  setGlossary?: (glossary: string) => void
  t: (key: string) => string
  beforeSubmit?: (createStudyCommand: CreateStudyCommand) => CreateStudyCommand
  customRouteAfterCreation?: string
  showStudyDates?: boolean
}

const NewStudyForm = ({
  form,
  children,
  glossary,
  setGlossary,
  t,
  beforeSubmit,
  customRouteAfterCreation = '',
  showStudyDates = true,
}: Props) => {
  const router = useRouter()
  const tLabel = useTranslations('common.label')
  const tError = useTranslations('study.new.error')
  const tGlossary = useTranslations('study.new.glossary')
  const tStudyNewSuggestion = useTranslations('study.new.suggestion')
  const tDocumentation = useTranslations('documentationUrl')
  const { callServerFunction } = useServerFunction()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (command: CreateStudyCommand) => {
    setLoading(true)
    if (beforeSubmit) {
      command = beforeSubmit(command)
    }

    await callServerFunction(() => createStudyCommand(command), {
      onSuccess: (data) => {
        router.push(`/etudes/${data.id}${customRouteAfterCreation}`)
      },
      getErrorMessage: (error) => tError(error),
      onError: () => setLoading(false),
    })
  }

  const Help = (name: string) => (
    <HelpIcon className="ml-4" onClick={() => setGlossary && setGlossary(name)} label={tGlossary('title')} />
  )

  const studyNamePlaceHolder = useMemo(
    () =>
      `${
        customRich(tStudyNewSuggestion, 'name', {
          studyStartDate: new Date().getFullYear(),
          orga: form.getValues('sites')[0]?.name || tStudyNewSuggestion('yourOrga'),
        }) || ''
      }`,
    [form, tStudyNewSuggestion],
  )

  return (
    <>
      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <FormTextField
          data-testid="new-study-name"
          control={form.control}
          name="name"
          label={t('name')}
          placeholder={studyNamePlaceHolder}
        />
        {showStudyDates && (
          <div>
            <IconLabel icon={Help('studyDates')} iconPosition="after" className="mb-2">
              <span className="inputLabel bold">{t('studyDates')}</span>
            </IconLabel>
            <div className={styles.dates}>
              <FormDatePicker control={form.control} name="startDate" label={tLabel('start')} />
              <FormDatePicker
                control={form.control}
                name="endDate"
                label={tLabel('end')}
                data-testid="new-study-endDate"
              />
            </div>
          </div>
        )}
        {children}
        <LoadingButton type="submit" loading={loading} data-testid="new-study-create-button">
          {t('create')}
        </LoadingButton>
      </Form>
      {glossary && (
        <GlossaryModal
          glossary={glossary}
          onClose={() => setGlossary && setGlossary('')}
          label="emission-source"
          t={tGlossary}
        >
          <p className="mb-2">
            {customRich(tGlossary, `${glossary}Description`, {
              link: (children) => (
                <Link href={tDocumentation('maturity')} target="_blank" rel="noreferrer noopener">
                  {children}
                </Link>
              ),
            })}
          </p>
        </GlossaryModal>
      )}
    </>
  )
}

export default NewStudyForm
