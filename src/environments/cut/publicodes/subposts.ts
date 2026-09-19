import { SubPost } from '@/generated/prisma/enums'
import {
  POST_TO_RULENAME as POST_TO_RULENAME_CUT,
  SUBPOST_TO_FORM_LAYOUTS as SUBPOST_TO_FORM_LAYOUTS_CUT,
} from '@/environments/cut/publicodes/subPostMapping'
import { CutPost } from '@/lib/services/results/posts.enums'

export const CUT_PUBLICODES_SUBPOSTS = Object.keys(SUBPOST_TO_FORM_LAYOUTS_CUT) as SubPost[]
export const CUT_PUBLICODES_POSTS = Object.keys(POST_TO_RULENAME_CUT) as CutPost[]
