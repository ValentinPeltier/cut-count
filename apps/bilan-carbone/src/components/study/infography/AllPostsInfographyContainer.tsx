import type { FullStudy } from '@/db/study'
import AllPostsInfographySimplified from '@/environments/simplified/study/infography/AllPostsInfography'
import { PublicodesSituationProvider } from '@/lib/publicodes/context'
import { Environment } from '@abc-transitionbascarbone/db-common/enums'

interface Props {
  study: FullStudy
  studySiteId: string
  siteId: string
}

const AllPostsInfographyContainer = ({ study, studySiteId }: Props) => (
  <PublicodesSituationProvider environment={Environment.CUT} studyId={study.id} studySiteId={studySiteId}>
    <AllPostsInfographySimplified study={study} />
  </PublicodesSituationProvider>
)

export default AllPostsInfographyContainer
