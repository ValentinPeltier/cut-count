'use client'

import { Environment } from '@/db-common/enums'
import type { FullStudy } from '@/db/study'
import Block from '@/lib/components/base/Block'
import { getAccountRoleOnStudy } from '@/utils/study'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { UserSession } from 'next-auth'
import { useFormatter } from 'next-intl'
import styles from './StudyDetailsHeader.module.css'
import StudyManagementActions from './StudyManagementActions'
import SelectStudySite from './site/SelectStudySite'

interface Props {
  study: FullStudy
  organizationVersionId: string | null
  canDeleteStudy?: boolean
  canDuplicateStudy?: boolean
  duplicableEnvironments: Environment[]
  studySite: string
  user: UserSession
  setSite: (site: string) => void
}

const StudyDetailsHeader = ({
  study,
  organizationVersionId,
  canDeleteStudy,
  canDuplicateStudy,
  duplicableEnvironments,
  studySite,
  user,
  setSite,
}: Props) => {
  const format = useFormatter()
  const userRole = getAccountRoleOnStudy(user, study)

  if (!userRole) {
    return null
  }

  return (
    <StudyManagementActions
      study={study}
      organizationVersionId={organizationVersionId}
      canDeleteStudy={canDeleteStudy}
      canDuplicateStudy={canDuplicateStudy}
      duplicableEnvironments={duplicableEnvironments}
      userRole={userRole}
      siteId={studySite}
    >
      {(actions) => (
        <Block
          title={study.name}
          as="h2"
          icon={study.isPublic ? <LockOpenIcon /> : <LockIcon />}
          actions={actions}
          description={
            <div className={styles.studyInfo}>
              <p>
                {format.dateTime(study.startDate, { year: 'numeric', day: 'numeric', month: 'long' })} -{' '}
                {format.dateTime(study.endDate, { year: 'numeric', day: 'numeric', month: 'long' })}
              </p>
            </div>
          }
          rightComponent={<SelectStudySite sites={study.sites} defaultValue={studySite} setSite={setSite} />}
        />
      )}
    </StudyManagementActions>
  )
}

export default StudyDetailsHeader
