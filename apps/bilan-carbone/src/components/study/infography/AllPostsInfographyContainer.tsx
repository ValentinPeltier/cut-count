import type { FullStudy } from '@/db/study'
import DynamicComponent from '@/environments/core/utils/DynamicComponent'
import { PublicodesSituationProvider } from '@/lib/publicodes/context'
import { CutPost } from '@/services/posts'
import { computeResultsByPostFromEmissionSources } from '@/services/results/consolidated'
import { getUserSettings } from '@/services/serverFunctions/user'
import { Environment } from '@abc-transitionbascarbone/db-common/enums'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import AllPostsInfography from './AllPostsInfography'

const AllPostsInfographySimplified = dynamic(
  () => import('@/environments/simplified/study/infography/AllPostsInfography'),
)

interface Props {
  study: FullStudy
  studySiteId: string
  siteId: string
}

const AllPostsInfographyContainer = ({ study, studySiteId, siteId }: Props) => {
  const tPost = useTranslations('emissionFactors.post')
  const [validatedOnly, setValidatedOnly] = useState(true)

  useEffect(() => {
    applyUserSettings()
  }, [])

  const applyUserSettings = async () => {
    const userSettings = await getUserSettings()
    const validatedOnlySetting = userSettings.success ? userSettings.data?.validatedEmissionSourcesOnly : undefined
    if (validatedOnlySetting !== undefined) {
      setValidatedOnly(validatedOnlySetting)
    }
  }

  const environment = useMemo(() => study.organizationVersion.environment, [study])

  const data = useMemo(
    () =>
      computeResultsByPostFromEmissionSources(
        study,
        tPost,
        siteId,
        true,
        validatedOnly,
        environment === Environment.CUT ? CutPost : undefined,
        environment,
      ),
    [study, tPost, siteId, validatedOnly, environment],
  )

  return (
    <DynamicComponent
      defaultComponent={<AllPostsInfography study={study} data={data} />}
      environmentComponents={{
        [Environment.CUT]: (
          <PublicodesSituationProvider environment={Environment.CUT} studyId={study.id} studySiteId={studySiteId}>
            <AllPostsInfographySimplified study={study} />
          </PublicodesSituationProvider>
        ),
      }}
    />
  )
}

export default AllPostsInfographyContainer
