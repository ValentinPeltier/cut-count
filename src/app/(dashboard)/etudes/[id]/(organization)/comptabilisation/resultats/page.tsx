import withAuth, { UserSessionProps } from '@/components/hoc/withAuth'
import { StudyProps } from '@/components/hoc/withStudy'
import withStudyDetails from '@/components/hoc/withStudyDetails'
import ResultsPage from '@/components/pages/Results'

const ResultatsPages = async ({ study, user }: StudyProps & UserSessionProps) => {
  return <ResultsPage study={study} user={user} />
}

export default withAuth(withStudyDetails(ResultatsPages))
