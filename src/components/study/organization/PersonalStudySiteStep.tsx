'use client'

import DynamicSites from '@/environments/cut/organization/Sites'
import { SiteCAUnit } from '@/generated/prisma/enums'
import Block from '@/lib/components/base/Block'
import { CreateStudyCommand, SitesCommand } from '@/services/serverFunctions/study.command'
import { Button, FormHelperText } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { UseFormReturn, useWatch } from 'react-hook-form'

interface Props {
  form: UseFormReturn<CreateStudyCommand>
  caUnit: SiteCAUnit
  onContinue: () => void
}

const PersonalStudySiteStep = ({ form, caUnit, onContinue }: Props) => {
  const t = useTranslations('study.organization')
  const tOrganizationSites = useTranslations('organization.sites')
  const tCommon = useTranslations('common')
  const [error, setError] = useState('')
  const sites = useWatch({ control: form.control, name: 'sites' })

  const handleContinue = () => {
    const currentSites = form.getValues('sites').map((site) => ({ ...site, selected: true }))
    form.setValue('sites', currentSites)

    if (!currentSites.some((site) => site.name.trim())) {
      setError(t('validation.sites'))
      return
    }

    if (
      currentSites.some(
        (site) =>
          Number.isNaN(site.etp) ||
          (site?.etp && site?.etp <= 0) ||
          Number.isNaN(site.ca) ||
          (site?.ca && site?.ca <= 0),
      )
    ) {
      setError(t('validation.etpCa'))
      return
    }

    setError('')
    onContinue()
  }

  return (
    <Block>
      <p data-testid="new-study-organization-title" className="title-h2">
        {tOrganizationSites('title')}
      </p>
      <DynamicSites
        sites={sites}
        form={form as unknown as UseFormReturn<SitesCommand>}
        caUnit={caUnit}
        withSelection={false}
        disabled={false}
      />
      <div className="mt2 flex justify-end">
        <Button variant="contained" data-testid="new-study-organization-button" onClick={handleContinue}>
          {tCommon('next')}
        </Button>
      </div>
      {error && <FormHelperText error>{error}</FormHelperText>}
    </Block>
  )
}

export default PersonalStudySiteStep
