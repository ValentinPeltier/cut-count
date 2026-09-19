'use client'

import GlobalNewStudyForm from '@/components/study/new/Form'
import { Level } from '@/generated/prisma/enums'
import Block from '@/lib/components/base/Block'
import { CreateStudyCommand } from '@/services/serverFunctions/study.command'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

interface Props {
  form: UseFormReturn<CreateStudyCommand>
}

const NewStudyForm = ({ form }: Props) => {
  const t = useTranslations('study.new')
  const [glossary, setGlossary] = useState('')

  useEffect(() => {
    form.setValue('level', Level.Initial)
    form.setValue('exports', [])
  }, [form])

  return (
    <Block title={t('title')} as="h1">
      <GlobalNewStudyForm form={form} t={t} glossary={glossary} setGlossary={setGlossary} />
    </Block>
  )
}

export default NewStudyForm
