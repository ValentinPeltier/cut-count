'use client'

/* eslint-disable react-compiler/react-compiler */

import type { Cnc } from '@/generated/prisma/client'

import Form from '@/lib/components/base/Form'
import LoadingButton from '@/lib/components/base/LoadingButton'
import { FormTextField } from '@/lib/components/form/TextField'
import { useServerFunction } from '@/lib/components/hooks/useServerFunction'
import { getEnvRoute } from '@/lib/services/email/utils'
import { customRich } from '@/lib/utils/customRich'
import { getAllCNCs } from '@/services/serverFunctions/cnc'
import { signUpWithSiretOrCNC } from '@/services/serverFunctions/user'
import { SignUpCommand, SignUpCommandValidation } from '@/services/serverFunctions/user.command'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormControl } from '@mui/material'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormAutocomplete } from '../form/Autocomplete'
import authStyles from './Auth.module.css'

const SignUpFormCut = () => {
  const contactMail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL
  const faq = process.env.NEXT_PUBLIC_FAQ_LINK

  const t = useTranslations('signup')
  const tForm = useTranslations('login.form')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [cncs, setCNCs] = useState<Cnc[]>([])
  const [siretOrCNC, setSiretOrCNC] = useState('')
  const { callServerFunction } = useServerFunction()

  const searchParams = useSearchParams()

  const { control, getValues, setValue, handleSubmit } = useForm<SignUpCommand>({
    resolver: zodResolver(SignUpCommandValidation),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      email: searchParams.get('email') ?? '',
      siretOrCNC: '',
    },
  })

  useEffect(() => {
    const fetchCNCs = async () => {
      const response = await callServerFunction(async () => {
        const data = await getAllCNCs()
        return { success: true, data }
      })

      if (response.success) {
        setCNCs(response.data)
      }
    }

    fetchCNCs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCNCs])

  useEffect(() => {
    const email = searchParams.get('email')
    if (email) {
      setValue('email', email)
    }
  }, [searchParams, setValue])

  const onSubmit = async () => {
    setMessage('')
    setSubmitting(true)

    const activation = await signUpWithSiretOrCNC(getValues().email, getValues().siretOrCNC ?? siretOrCNC)
    setSubmitting(false)

    if (activation.success) {
      setSuccess(true)
      setMessage(activation.data)
    } else {
      setSuccess(false)
      setMessage(activation.errorMessage)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="grow justify-center">
      <FormControl className={authStyles.form}>
        <FormTextField
          control={control}
          name="email"
          className={authStyles.input}
          label={
            <>
              {t('email')}{' '}
              <span className={authStyles.requiredMark} aria-hidden="true">
                *
              </span>
            </>
          }
          placeholder={t('emailPlaceholder')}
          data-testid="activation-email"
        />
        <FormAutocomplete
          data-testid="activation-siretOrCNC"
          control={control}
          translation={t}
          options={cncs
            .filter((cnc) => cnc.cncCode)
            .map((cnc) => ({
              label: `${cnc.nom} (Dep : ${cnc.dep} | Numéro CNC : ${cnc.cncCode})`,
              value: cnc.cncCode!,
            }))}
          name="siretOrCNC"
          label={t('siretOrCNC')}
          freeSolo
          onInputChange={(_, value) => {
            setSiretOrCNC(value)
            setValue('siretOrCNC', value)
          }}
        />
        <LoadingButton data-testid="activation-button" type="submit" loading={submitting} variant="contained" fullWidth>
          {t('validate')}
        </LoadingButton>
        {message && (
          <p
            className={classNames(success ? authStyles.successMessage : 'error')}
            data-testid="activation-form-message"
          >
            {customRich(t, message, {
              support: (children) => <Link href={`mailto:${contactMail}`}>{children}</Link>,
              link: (children) => (
                <Link href={faq ?? ''} target="_blank" rel="noreferrer noopener">
                  {children}
                </Link>
              ),
            })}
          </p>
        )}
        <div className={authStyles.bottomLink}>
          {tForm('alreadyRegistered')}
          <Link className="ml-2" href={getEnvRoute('login')} prefetch={false}>
            {tForm('login')}
          </Link>
        </div>
      </FormControl>
    </Form>
  )
}

export default SignUpFormCut
