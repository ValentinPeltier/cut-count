'use client'

import type { FullStudy } from '@/db/study'
import StudyResultsContainerSummaryPublicodes from '@/environments/simplified/study/results/StudyResultsContainerSummaryPublicodes'
import Block from '@abc-transitionbascarbone/components/src/base/Block'
import { Environment } from '@abc-transitionbascarbone/db-common/enums'
import { UserSession } from 'next-auth'
import useStudySite from './site/useStudySite'
import StudyDetailsHeader from './StudyDetailsHeader'

interface Props {
  user: UserSession
  canDeleteStudy?: boolean
  canDuplicateStudy?: boolean
  duplicableEnvironments: Environment[]
  study: FullStudy
  validatedOnly: boolean
  organizationVersionId: string | null
}

const StudyDetails = ({
  user,
  canDeleteStudy,
  canDuplicateStudy,
  duplicableEnvironments,
  study,
  organizationVersionId,
}: Props) => {
  const { siteId, setSite } = useStudySite(study, true)

  return (
    <>
      <StudyDetailsHeader
        study={study}
        organizationVersionId={organizationVersionId}
        canDeleteStudy={canDeleteStudy}
        canDuplicateStudy={canDuplicateStudy}
        duplicableEnvironments={duplicableEnvironments}
        studySite={siteId}
        setSite={setSite}
        user={user}
      />
      <Block>
        <StudyResultsContainerSummaryPublicodes study={study} />
      </Block>
    </>
  )
}

export default StudyDetails
