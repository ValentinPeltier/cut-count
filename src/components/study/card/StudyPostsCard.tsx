
import type { FullStudy } from '@/db/study'
import { Post } from '@/lib/utils/charts'
import { withInfobulle } from '@/utils/post'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import PostIcon from '../infography/icons/PostIcon'
import SelectStudySite from '../site/SelectStudySite'
import styles from './StudyPostsCard.module.css'
import { StyledPostContainer } from './StudyPostsCard.styles'

interface Props {
  study: FullStudy
  post: Post
  studySite: string
  setSite: (site: string) => void
  setGlossary: (glossary: string) => void
    simplified?: boolean
}

const StudyPostsCard = ({ study, post, studySite, setSite, setGlossary }: Props) => {
  const tPost = useTranslations('emissionFactors.post')

  return (
    <div className={classNames(styles.card, 'flex-col px1')}>
      <div className="justify-end align-center">
        <SelectStudySite
          sites={study.sites}
          defaultValue={studySite}
          setSite={setSite}
          withLabel={false}
          showAllOption={false}
        />
      </div>
      <div className={classNames(styles.postContainer, 'grow flex-col gapped')}>
        <div className="grow justify-center">
          <StyledPostContainer post={post}>
            <div className={classNames(styles.header, 'flex-col align-center grow')}>
              <div className={classNames(styles.content, 'flex-cc text-center w100')}>
                <PostIcon className={styles.icon} post={post} />
                {tPost(post)}
                {withInfobulle(post) && (
                  <HelpOutlineIcon
                    className={classNames(styles.icon, 'pointer ml-2')}
                    onClick={() => setGlossary(post)}
                    aria-label={tPost('glossary')}
                    titleAccess={tPost('glossary')}
                  />
                )}
              </div>
            </div>
          </StyledPostContainer>
        </div>
      </div>
    </div>
  )
}

export default StudyPostsCard
