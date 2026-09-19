'use client'
import PersonalStudySiteStep from '@/components/study/organization/PersonalStudySiteStep'
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
  isPersonalStudy?: boolean
}

const NewStudyPage = ({
  organizationVersions,
  user,
  defaultOrganizationVersion,
  caUnit,
  isPersonalStudy = false,
}: Props) => {
  const [organizationVersion, setOrganizationVersion] = useState<OrganizationWithSites>()
  const [personalStudyReady, setPersonalStudyReady] = useState(false)
  const tNav = useTranslations('nav')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tStudy = useTranslations('study')

  const form = useForm<CreateStudyCommand>({
    resolver: zodResolver(CreateStudyCommandValidation),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      validator: user.email,
      isPublic: isPersonalStudy ? 'false' : 'true',
      startDate: dayjs().toISOString(),
      realizationStartDate: dayjs().toISOString(),
      organizationVersionId: isPersonalStudy
        ? undefined
        : (defaultOrganizationVersion ?? organizationVersions[0])?.id || '',
      sites: isPersonalStudy
        ? [
            {
              id: crypto.randomUUID(),
              name: '',
              etp: 0,
              ca: 0,
              selected: true,
              postalCode: '',
              city: '',
              cncId: '',
              cncCode: '',
            },
          ]
        : (defaultOrganizationVersion ?? organizationVersions[0])?.organization.sites.map((site) => ({
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
      {isPersonalStudy ? (
        personalStudyReady ? (
          <NewStudyFormCut form={form} />
        ) : (
          <PersonalStudySiteStep form={form} caUnit={caUnit} onContinue={() => setPersonalStudyReady(true)} />
        )
      ) : organizationVersion ? (
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
