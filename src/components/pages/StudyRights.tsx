import type { FullStudy } from '@/db/study'
import StudyRightsCut from '@/environments/cut/study/StudyRightsCut'
import NotFound from '@/lib/components/pages/NotFound'
import { getAccountRoleOnStudy } from '@/utils/study'
import { UserSession } from 'next-auth'
import { getTranslations } from 'next-intl/server'
import Breadcrumbs from '../breadcrumbs/Breadcrumbs'

interface Props {
  study: FullStudy
  user: UserSession
}

const StudyRightsPage = async ({ study, user }: Props) => {
  const tNav = await getTranslations('nav')
  const userRoleOnStudy = getAccountRoleOnStudy(user, study)

  if (!userRoleOnStudy) {
    return <NotFound />
  }

  return (
    <>
      <Breadcrumbs
        current={tNav('studyRights')}
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
      <StudyRightsCut study={study} />
    </>
  )
}

export default StudyRightsPage
