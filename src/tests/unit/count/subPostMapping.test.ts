import {
  getFormLayoutsForSubPostCUT,
  getPostRuleNameCut,
  getSubPostRuleNameCut,
  hasPublicodesMapping,
  POST_TO_RULENAME,
} from '@/environments/cut/publicodes/subPostMapping'
import { CutPost, subPostsByPostCUT } from '@/services/posts'
import { SubPost } from '@/generated/prisma/enums'

describe('CUT subPostMapping', () => {
  it('maps each CutPost enum value to a Publicodes post rule', () => {
    for (const post of Object.values(CutPost)) {
      expect(getPostRuleNameCut(post)).toBe(POST_TO_RULENAME[post])
    }
  })

  it('provides form layouts for every CUT sub-post', () => {
    for (const subPosts of Object.values(subPostsByPostCUT)) {
      for (const subPost of subPosts) {
        expect(hasPublicodesMapping(subPost)).toBe(true)
        expect(getSubPostRuleNameCut(subPost)).toBeTruthy()
        expect(getFormLayoutsForSubPostCUT(subPost).length).toBeGreaterThan(0)
      }
    }
  })

  it('does not map unknown sub-posts', () => {
    expect(hasPublicodesMapping('UnknownSubPost' as SubPost)).toBe(false)
    expect(getSubPostRuleNameCut('UnknownSubPost' as SubPost)).toBeUndefined()
  })
})
