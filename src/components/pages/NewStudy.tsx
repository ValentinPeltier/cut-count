'use client'
import SelectOrganization from '@/components/study/organization/Select'
import { OrganizationWithSites } from '@/db/account'
import { getOrganizationVersionAccounts } from '@/db/organization'
import NewStudyFormCut from '@/environments/cut/study/new/Form'
import { SiteCAUnit } from '@/generated/prisma/enums'
import { CreateStudyCommand, CreateStudyCommandValidation } from '@/services/serverFunctions/study.command'
import { CA_UNIT_VALUES, displayCA } from '@/utils/number'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { UserSession } from 'next-auth'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Breadcrumbs from '../breadcrumbs/Breadcrumbs'

interface Props {
  user: UserSession
  organizationVersions: OrganizationWithSites[]
  accounts: Awaited<ReturnType<typeof getOrganizationVersionAccounts>>
  defaultOrganizationVersion?: OrganizationWithSites
  caUnit: SiteCAUnit
}

const NewStudyPage = ({ organizationVersions, user, defaultOrganizationVersion, caUnit }: Props) => {
  const [organizationVersion, setOrganizationVersion] = useState<OrganizationWithSites>()
  const tNav = useTranslations('nav')
  const tStudy = useTranslations('study')

  const form = useForm<CreateStudyCommand>({
    resolver: zodResolver(CreateStudyCommandValidation),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      validator: user.email,
      isPublic: 'true',
      startDate: dayjs().toISOString(),
      realizationStartDate: dayjs().toISOString(),
      organizationVersionId: (defaultOrganizationVersion ?? organizationVersions[0])?.id || '',
      sites:
        (defaultOrganizationVersion ?? organizationVersions[0])?.organization.sites.map((site) => ({
          ...site,
          ca: site.ca ? displayCA(site.ca, CA_UNIT_VALUES[caUnit]) : 0,
          selected: false,
          postalCode: site.postalCode ?? '',
          city: site.city ?? '',
          cncId: site.cncId ?? '',
          cncCode: site.cnc?.cncCode || '',
        })) || [],
      exports: [],
    },
  })

  return (
    <>
      <Breadcrumbs
        current={tNav('newStudy')}
        links={[
          { label: tNav('home'), link: '/' },
          defaultOrganizationVersion
            ? {
                label: defaultOrganizationVersion.organization.name,
                link: `/organisations/${defaultOrganizationVersion.id}`,
              }
            : undefined,
        ].filter((link) => link !== undefined)}
      />
      {organizationVersion ? (
        <NewStudyFormCut form={form} />
      ) : (
        <SelectOrganization
          organizationVersions={organizationVersions}
          selectOrganizationVersion={setOrganizationVersion}
          form={form}
          caUnit={caUnit}
        />
      )}
    </>
  )
}

export default NewStudyPage
