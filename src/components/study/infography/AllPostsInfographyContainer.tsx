
import type { FullStudy } from '@/db/study'
import AllPostsInfographySimplified from '@/environments/simplified/study/infography/AllPostsInfography'
import { PublicodesSituationProvider } from '@/lib/publicodes/context'

interface Props {
  study: FullStudy
  studySiteId: string
  siteId: string
}

const AllPostsInfographyContainer = ({ study, studySiteId }: Props) => (
  <PublicodesSituationProvider studyId={study.id} studySiteId={studySiteId}>
    <AllPostsInfographySimplified study={study} />
  </PublicodesSituationProvider>
)

export default AllPostsInfographyContainer
