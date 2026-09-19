import withAuth from '@/components/hoc/withAuth'
import { StudyProps } from '@/components/hoc/withStudy'
import withStudyDetails from '@/components/hoc/withStudyDetails'
import ResultsPage from '@/components/pages/Results'

const ResultatsPages = async ({ study }: StudyProps) => {
  return <ResultsPage study={study} />
}

export default withAuth(withStudyDetails(ResultatsPages))
