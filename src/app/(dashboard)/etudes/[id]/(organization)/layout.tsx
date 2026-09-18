import withAuth, { UserSessionProps } from '@/components/hoc/withAuth'
import StudyNavbar from '@/components/studyNavbar/StudyNavbar'
import { getStudyForNavbar } from '@/db/study'
import NotFound from '@/lib/components/pages/NotFound'
import { hasRoleOnStudy } from '@/services/permissions/environment'
import { canReadStudy, canReadStudyDetail } from '@/services/permissions/study'
import { getAccountRoleOnStudy } from '@/utils/study'
import { UUID } from 'crypto'
import styles from './layout.module.css'

interface Props {
  children: React.ReactNode
  params: Promise<{ id: UUID }>
}

const NavLayout = async ({ children, params, user }: Props & UserSessionProps) => {
  const { id } = await params

  const study = await getStudyForNavbar(id)
  if (!study) {
    return <NotFound />
  }

  if (!(await canReadStudyDetail(user, study))) {
    if (!(await canReadStudy(user, id))) {
      return <NotFound />
    }
    return <NotFound />
  }

  const userRole = await getAccountRoleOnStudy(user, study)
  const showRoleInChip = user && hasRoleOnStudy(user.environment)

  return (
    <>
      <div className="flex">
        <StudyNavbar
          studyId={id}
          studyName={study.name}
          studySimplified={study.simplified}
          userRole={showRoleInChip ? userRole : null}
        />
        <div className={styles.children}>{children}</div>
      </div>
    </>
  )
}

export default withAuth(NavLayout)
