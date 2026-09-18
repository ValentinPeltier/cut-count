import { StudyCardItem } from '@/db/study'
import Box from '@/lib/components/base/Box'
import { Button } from '@/lib/ui'
import { hasRoleOnStudy } from '@/services/permissions/environment'
import { getDisplayedRoleOnStudy } from '@/utils/study'
import classNames from 'classnames'
import { UserSession } from 'next-auth'
import { getTranslations } from 'next-intl/server'
import styles from './StudyCard.module.css'
import StudyName from './StudyName'

interface Props {
  study: StudyCardItem
  user: UserSession
  simplified?: boolean
}

const StudyCard = async ({ study, user, simplified }: Props) => {
  const t = await getTranslations('study')
  const { id, name } = study

  const showRoleInChip = hasRoleOnStudy(user.environment)
  const accountRoleOnStudy = getDisplayedRoleOnStudy(user, study)

  if (!accountRoleOnStudy) {
    return null
  }

  return (
    <li data-testid="study" className="flex">
      <Box className={classNames(styles.card, 'flex-col grow w100')}>
        <div className="justify-center">
          <StudyName studyId={id} name={name} role={showRoleInChip ? accountRoleOnStudy : null} clickable />
        </div>
        <div className="justify-end">
          <Button href={`/etudes/${id}`} data-testid="study-link">
            {t(simplified ? 'seeSimplified' : 'see')}
          </Button>
        </div>
      </Box>
    </li>
  )
}

export default StudyCard
