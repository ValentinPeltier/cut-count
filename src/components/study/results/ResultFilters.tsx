import { SubPost } from '@/db-common/enums'
import type { FullStudy } from '@/db/study'
import { Post } from '@/lib/utils/charts'
import { environmentSubPostsMapping, subPostsByPost } from '@/services/posts'
import type { ResultType } from '@/types/study.types'
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
    const envSubPostsByPost = environmentSubPostsMapping
    const posts = Object.keys(envSubPostsByPost) as Post[]
    const subPosts = posts.reduce((acc, post) => acc.concat(subPostsByPost[post] || []), [] as SubPost[])

    return {
      envPosts: posts,
      envSubPosts: Array.from(new Set(subPosts)),
    }
  }, [])

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
