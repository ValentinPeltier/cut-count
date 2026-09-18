import {
  POST_TO_RULENAME as POST_TO_RULENAME_CUT,
  SUBPOST_TO_FORM_LAYOUTS as SUBPOST_TO_FORM_LAYOUTS_CUT,
} from '@/environments/cut/publicodes/subPostMapping'
import { SimplifiedPost } from '@/services/posts'
import { Environment, SubPost } from '@abc-transitionbascarbone/db-common/enums'

export const SUBPOSTS_PUBLICODE_FROM_ENV: Partial<Record<Environment, SubPost[]>> = {
  [Environment.CUT]: Object.keys(SUBPOST_TO_FORM_LAYOUTS_CUT) as SubPost[],
}

export const POSTS_PUBLICODE_FROM_ENV: Partial<Record<Environment, SimplifiedPost[]>> = {
  [Environment.CUT]: Object.keys(POST_TO_RULENAME_CUT) as SimplifiedPost[],
}
