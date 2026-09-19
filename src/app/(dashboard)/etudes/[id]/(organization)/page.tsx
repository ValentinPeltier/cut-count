import withAuth from '@/components/hoc/withAuth'
import { StudyProps } from '@/components/hoc/withStudy'
import withStudyDetails from '@/components/hoc/withStudyDetails'
import { getStudyDefaultLandingPath } from '@/utils/study'
import { redirect } from 'next/navigation'

const StudyView = async ({ study }: StudyProps) => {
  redirect(await getStudyDefaultLandingPath(study.id))
}

export default withAuth(withStudyDetails(StudyView))
