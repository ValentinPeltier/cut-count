'use client'

import { EmissionFactorWithParts } from '@/db/emissionFactors'
import type { FullStudy } from '@/db/study'
import DynamicComponent from '@/environments/core/utils/DynamicComponent'
import type { ExportRule } from '@abc-transitionbascarbone/db-common'
import { Environment, SiteCAUnit } from '@abc-transitionbascarbone/db-common/enums'
import { UserSession } from 'next-auth'
import dynamic from 'next/dynamic'

const AllResults = dynamic(() => import('@/components/study/results/AllResults'))
const AllResultsPublicodes = dynamic(() => import('@/environments/simplified/study/results/AllResultsPublicodes'))

interface Props {
  study: FullStudy
  rules: ExportRule[]
  emissionFactorsWithParts: EmissionFactorWithParts[]
  validatedOnly: boolean
  caUnit?: SiteCAUnit
  user: UserSession
}

const DynamicAllResults = ({ study, rules, emissionFactorsWithParts, validatedOnly, caUnit }: Props) => {
  return (
    <DynamicComponent
      environmentComponents={{
        [Environment.CUT]: <AllResultsPublicodes study={study} />,
      }}
      defaultComponent={
        <AllResults
          study={study}
          rules={rules}
          emissionFactorsWithParts={emissionFactorsWithParts}
          validatedOnly={validatedOnly}
          caUnit={caUnit}
        />
      }
    />
  )
}

export default DynamicAllResults
