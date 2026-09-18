'use client'

import type { FullStudy } from '@/db/study'
import StudyRights from '@/environments/base/study/StudyRights'
import StudyRightsCut from '@/environments/cut/study/StudyRightsCut'
import type { EmissionFactorImportVersion } from '@abc-transitionbascarbone/db-common'
import { Environment, SiteCAUnit, StudyRole } from '@abc-transitionbascarbone/db-common/enums'
import { UserSession } from 'next-auth'
import DynamicComponent from '../utils/DynamicComponent'

interface Props {
  user: UserSession
  study: FullStudy
  editionDisabled: boolean
  userRoleOnStudy: StudyRole
  emissionFactorSources: EmissionFactorImportVersion[]
  caUnit: SiteCAUnit
}

const DynamicStudyRights = ({ user, study, editionDisabled, userRoleOnStudy, emissionFactorSources }: Props) => {
  return (
    <DynamicComponent
      defaultComponent={
        <StudyRights
          user={user}
          study={study}
          editionDisabled={editionDisabled}
          userRoleOnStudy={userRoleOnStudy}
          emissionFactorSources={emissionFactorSources}
        />
      }
      environmentComponents={{
        [Environment.CUT]: <StudyRightsCut study={study} />,
      }}
    />
  )
}

export default DynamicStudyRights
