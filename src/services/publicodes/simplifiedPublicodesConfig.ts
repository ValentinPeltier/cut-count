import { PUBLICODES_COUNT_VERSION } from '@/constants/versions'
import { SubPost } from '@/generated/prisma/enums'
import { getCutEngine } from '@/environments/cut/publicodes/cut-engine'
import {
  getFormLayoutsForSubPostCUT,
  getPostRuleNameCut,
  getSubPostRuleNameCut,
} from '@/environments/cut/publicodes/subPostMapping'
import { FormLayout } from '@/publicodes/form/layouts'
import Engine from 'publicodes'
import { CutPost, SimplifiedPost, subPostsByPostCUT } from '../posts'

export interface SimplifiedPublicodesConfig<TPost extends SimplifiedPost = SimplifiedPost> {
  posts: TPost[]
  subPostsByPost: Record<TPost, SubPost[]>
  getFormLayout: (subPost: SubPost) => FormLayout<string>[]
  getPostRuleName: (post: TPost) => string
  getSubPostRuleName: (subPost: SubPost) => string | undefined
  getEngine: () => Engine
  modelVersion: string
}

const CUT_CONFIG: SimplifiedPublicodesConfig<CutPost> = {
  posts: Object.values(CutPost),
  subPostsByPost: subPostsByPostCUT,
  getFormLayout: getFormLayoutsForSubPostCUT,
  getPostRuleName: (post) => getPostRuleNameCut(post),
  getSubPostRuleName: getSubPostRuleNameCut,
  getEngine: getCutEngine,
  modelVersion: PUBLICODES_COUNT_VERSION,
}

export const getSimplifiedPublicodesConfig = (
  _subPostsConfigVersion: string | null | undefined,
): SimplifiedPublicodesConfig => {
  return CUT_CONFIG as SimplifiedPublicodesConfig
}
