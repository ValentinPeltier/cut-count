'use client'
import type { FullStudy } from '@/db/study'
import SimplifiedStudyPostsPage from '@/environments/simplified/study/SimplifiedStudyPostsPage'
import Block from '@abc-transitionbascarbone/components/src/base/Block'
import GlossaryModal from '@abc-transitionbascarbone/components/src/modals/GlossaryModal'
import { Environment, StudyRole, SubPost } from '@abc-transitionbascarbone/db-common/enums'
import { Post } from '@abc-transitionbascarbone/utils/charts'
import { customRich } from '@abc-transitionbascarbone/utils/customRich'
import { CircularProgress } from '@mui/material'
import { UserSession } from 'next-auth'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import Breadcrumbs from '../breadcrumbs/Breadcrumbs'
import StudyPostsCard from '../study/card/StudyPostsCard'
import useStudySite from '../study/site/useStudySite'
import styles from './StudyPostsPage.module.css'

interface Props {
  post: Post
  currentSubPost: SubPost | undefined
  study: FullStudy
  userRole: StudyRole
  user: UserSession
}

const StudyPostsPageContainer = ({ post, currentSubPost, study }: Props) => {
  const tNav = useTranslations('nav')
  const tPost = useTranslations('emissionFactors.post')
  const { siteId, studySiteId, setSite } = useStudySite(study)
  const [glossary, setGlossary] = useState('')

  const glossaryDescription = useMemo(() => {
    if (!glossary) {
      return ''
    }

    const textForGlossary = tPost.has(`glossaryDescription.${glossary}`)
      ? `glossaryDescription.${glossary}`
      : `glossaryDescription.${glossary}`

    return customRich(tPost, textForGlossary, {
      link: (children) => (
        <Link className={styles.link} href={tPost(`${textForGlossary}Link`)} target="_blank" rel="noreferrer noopener">
          {children}
        </Link>
      ),
    })
  }, [glossary, tPost])

  if (!siteId) {
    return <CircularProgress />
  }

  return (
    <>
      <Breadcrumbs
        current={tPost(post)}
        links={[
          { label: tNav('home'), link: '/' },
          study.organizationVersion.isCR
            ? {
                label: study.organizationVersion.organization.name,
                link: `/organisations/${study.organizationVersion.id}`,
              }
            : undefined,
          { label: study.name, link: `/etudes/${study.id}` },
        ].filter((link) => link !== undefined)}
      />
      <Block>
        <StudyPostsCard
          study={study}
          post={post}
          studySite={siteId}
          setSite={setSite}
          environment={Environment.CUT}
          setGlossary={setGlossary}
          simplified
        />
      </Block>
      <SimplifiedStudyPostsPage
        environment={Environment.CUT}
        currentSubPost={currentSubPost}
        post={post}
        study={study}
        studySiteId={studySiteId}
      />
      {glossary && (
        <GlossaryModal glossary={glossary} label="post-glossary" t={tPost} onClose={() => setGlossary('')}>
          <p>{glossaryDescription}</p>
        </GlossaryModal>
      )}
    </>
  )
}

export default StudyPostsPageContainer
