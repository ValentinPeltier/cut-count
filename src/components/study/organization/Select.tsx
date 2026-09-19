'use client'

import { SiteCAUnit } from '@/generated/prisma/enums'
import { OrganizationWithSites } from '@/db/account'
import DynamicSites from '@/environments/cut/organization/Sites'
import Block from '@/lib/components/base/Block'
import { FormSelect } from '@/lib/components/form/Select'
import { useServerFunction } from '@/lib/components/hooks/useServerFunction'
import { updateOrganizationCommand } from '@/services/serverFunctions/organization'
import { CreateStudyCommand, SitesCommand } from '@/services/serverFunctions/study.command'
import { CA_UNIT_VALUES, displayCA } from '@/utils/number'
import { Button, FormHelperText, MenuItem } from '@mui/material'
import { useTranslations } from 'next-intl'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { Control, UseFormReturn, useWatch } from 'react-hook-form'

interface Props {
  organizationVersions: OrganizationWithSites[]
  selectOrganizationVersion: Dispatch<SetStateAction<OrganizationWithSites | undefined>>
  form: UseFormReturn<CreateStudyCommand>
  caUnit: SiteCAUnit
  targetOrganizationVersionId?: string | null
}

interface NextButtonProps {
  control: Control<CreateStudyCommand>
  onClick: () => void
  error: string
  hasNoSites?: boolean
}

const NextButton = ({ control, onClick, error, hasNoSites }: NextButtonProps) => {
  const tCommon = useTranslations('common')
  const sites = useWatch({ control, name: 'sites' })
  const hasNoSelectedSites = !sites.some((site) => site.selected || (hasNoSites && site.name))

  return (
    <div className="mt2">
      <div className="flex justify-end">
        <Button
          variant="contained"
          disabled={hasNoSelectedSites}
          data-testid="new-study-organization-button"
          onClick={onClick}
        >
          {tCommon('next')}
        </Button>
      </div>
      {error && <FormHelperText error>{error}</FormHelperText>}
    </div>
  )
}

const SelectOrganization = ({
  organizationVersions,
  selectOrganizationVersion,
  form,
  caUnit,
}: Props) => {
  const t = useTranslations('study.organization')
  const tOrganizationSites = useTranslations('organization.sites')
  const [error, setError] = useState('')
  const { callServerFunction } = useServerFunction()

  const sites = form.watch('sites')
  const organizationVersionId = form.watch('organizationVersionId')

  const organizationVersion = useMemo(
    () => organizationVersions.find((organizationVersion) => organizationVersion.id === organizationVersionId),
    [organizationVersionId, organizationVersions],
  )
  const hasNoSites = organizationVersion && organizationVersion.organization.sites.length === 0

  useEffect(() => {
    if (!organizationVersion) {
      form.setValue('sites', [])
    } else {
      const newSites = organizationVersion.organization.sites.map((site) => site.id)
      if (JSON.stringify(form.getValues('sites').map((site) => site.id)) !== JSON.stringify(newSites)) {
        form.setValue(
          'sites',
          organizationVersion.organization.sites.map((site) => ({
            ...site,
            ca: site.ca ? displayCA(site.ca, CA_UNIT_VALUES[caUnit]) : 0,
            selected: false,
            postalCode: site.postalCode ?? '',
            city: site.city ?? '',
            cncId: site.cncId ?? '',
            cncCode: site.cnc?.cncCode || '',
          })),
        )
      }
    }
  }, [organizationVersion, caUnit, form])

  const next = async () => {
    const currentSites = form.getValues('sites').map((site) => (hasNoSites ? { ...site, selected: true } : site))

    if (hasNoSites) {
      form.setValue('sites', currentSites)
      await callServerFunction(
        () =>
          updateOrganizationCommand({
            organizationVersionId: organizationVersionId!,
            name: organizationVersion?.organization.name || '',
            sites: currentSites,
          }),
        {
          onSuccess: () => {
            selectOrganizationVersion({
              ...organizationVersion,
              organization: {
                ...organizationVersion!.organization,
                currentSites,
              },
            } as OrganizationWithSites)
          },
        },
      )
    } else if (!currentSites.some((site) => site.selected)) {
      setError(t('validation.sites'))
      return
    }

    if (
      currentSites
        .filter((site) => site.selected)
        .some(
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

    selectOrganizationVersion(organizationVersion)
  }

  return (
    <Block>
      {organizationVersions.length === 1 ? (
        <p data-testid="new-study-organization-title" className="title-h2">
          {tOrganizationSites('title')}
        </p>
      ) : (
        <>
          <p data-testid="new-study-organization-title" className="title-h1">
            {t('title')}
          </p>
          <FormSelect
            data-testid="new-study-organization-select"
            name="organizationVersionId"
            control={form.control}
            translation={t}
            label={t('select')}
          >
            {organizationVersions.map((organizationVersion) => (
              <MenuItem key={organizationVersion.id} value={organizationVersion.id}>
                {organizationVersion.organization.name}
              </MenuItem>
            ))}
          </FormSelect>
        </>
      )}
      <DynamicSites
        sites={sites}
        form={form as unknown as UseFormReturn<SitesCommand>}
        caUnit={caUnit}
        withSelection={!hasNoSites}
        disabled={false}
      />
      <NextButton control={form.control} onClick={next} error={error} hasNoSites={hasNoSites} />
    </Block>
  )
}

export default SelectOrganization
