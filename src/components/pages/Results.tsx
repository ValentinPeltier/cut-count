import type { FullStudy } from '@/db/study'
import AllResultsPublicodes from '@/environments/simplified/study/results/AllResultsPublicodes'
import { useTranslations } from 'next-intl'
import Breadcrumbs from '../breadcrumbs/Breadcrumbs'

interface Props {
  study: FullStudy
}

const ResultsPage = ({ study }: Props) => {
  const tNav = useTranslations('nav')
  const tStudyNav = useTranslations('study.navigation')

  return (
    <>
      <Breadcrumbs
        current={tStudyNav('results')}
        links={[
          { label: tNav('home'), link: '/' },
          study.organizationVersion?.isCR
            ? {
                label: study.organizationVersion.organization.name,
                link: `/organisations/${study.organizationVersion.id}`,
              }
            : undefined,
          { label: study.name, link: `/etudes/${study.id}` },
        ].filter((link) => link !== undefined)}
      />
      <AllResultsPublicodes study={study} />
    </>
  )
}

export default ResultsPage
