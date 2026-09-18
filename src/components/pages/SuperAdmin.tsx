'use server'

import Block from '@/lib/components/base/Block'
import { getDeactivableFeaturesRestrictionValues } from '@/services/serverFunctions/deactivableFeatures'
import { getTranslations } from 'next-intl/server'
import DeactivableFeatures from '../admin/DeactivableFeatures'
import SuperAdminImport from '../admin/SuperAdminImport'

const SuperAdminPage = async () => {
  const t = await getTranslations('admin')
  const deactivatedFeaturesRestrictions = await getDeactivableFeaturesRestrictionValues()

  return (
    <>
      <Block title={t('title')} as="h1">
        <SuperAdminImport />
        {deactivatedFeaturesRestrictions.success && (
          <DeactivableFeatures restrictions={deactivatedFeaturesRestrictions.data} />
        )}
      </Block>
    </>
  )
}

export default SuperAdminPage
