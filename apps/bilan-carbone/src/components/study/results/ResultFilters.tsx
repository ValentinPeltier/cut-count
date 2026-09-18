import type { FullStudy } from '@/db/study'
import { environmentSubPostsMapping, subPostsByPost } from '@/services/posts'
import { BCEnvironment } from '@/types/environment'
import type { ResultType } from '@/types/study.types'
import { SubPost } from '@abc-transitionbascarbone/db-common/enums'
import { Post } from '@abc-transitionbascarbone/utils/charts'
import { useEffect, useMemo, useRef, useState } from 'react'
import { PostSubPostFilter } from '../../form/PostSubPostFilter'

interface Props {
  study: Pick<FullStudy, 'organizationVersion'>
  selectedPostIds: string[]
  selectedTagIds: string[]
  onPostFilterChange: (subposts: SubPost[]) => void
  onTagFilterChange: (ids: string[]) => void
  exportType: ResultType
}

const ResultFilters = ({ study, selectedPostIds, onPostFilterChange, exportType }: Props) => {
  const [previousExportType, setPreviousExportType] = useState<string | null>(null)
  const hasInitializedRef = useRef(false)

  const { envPosts, envSubPosts } = useMemo(() => {
    const envSubPostsByPost = environmentSubPostsMapping[study.organizationVersion.environment as BCEnvironment]
    const posts = Object.keys(envSubPostsByPost) as Post[]
    const subPosts = posts.reduce((acc, post) => acc.concat(subPostsByPost[post] || []), [] as SubPost[])

    return {
      envPosts: posts,
      envSubPosts: Array.from(new Set(subPosts)),
    }
  }, [study.organizationVersion.environment])

  useEffect(() => {
    if (envSubPosts.length > 0) {
      const defaultPostItems = envSubPosts

      if (previousExportType !== exportType) {
        setPreviousExportType(exportType)
        hasInitializedRef.current = true
        if (defaultPostItems.length > 0) {
          onPostFilterChange(defaultPostItems)
        }
      } else if (!hasInitializedRef.current && selectedPostIds.length === 0 && defaultPostItems.length > 0) {
        hasInitializedRef.current = true
        onPostFilterChange(defaultPostItems)
      }
    }
  }, [envSubPosts, previousExportType, exportType, onPostFilterChange, selectedPostIds.length])

  const selectedSubPosts = useMemo(
    () => selectedPostIds.filter((id): id is SubPost => Object.values(SubPost).includes(id as SubPost)),
    [selectedPostIds],
  )

  return (
    <div className="flex gapped1">
      <PostSubPostFilter
        envPosts={envPosts}
        envSubPosts={envSubPosts}
        selectedSubPosts={selectedSubPosts}
        onChange={onPostFilterChange}
      />
    </div>
  )
}

export default ResultFilters
