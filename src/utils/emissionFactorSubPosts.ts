import { Prisma } from '@/generated/prisma/client'
import { SubPost } from '@/generated/prisma/enums'

export const emissionFactorSubPostsSelect = {
  select: { subPost: true },
} satisfies Prisma.EmissionFactorSubPostFindManyArgs

export const mapEmissionFactorSubPosts = (rows: { subPost: SubPost }[]): SubPost[] => rows.map((row) => row.subPost)

export const emissionFactorSubPostsCreateInput = (
  subPosts: SubPost[],
): Prisma.EmissionFactorCreateInput['subPosts'] => ({
  create: subPosts.map((subPost) => ({ subPost })),
})

export const emissionFactorSubPostsUpdateInput = (subPosts: SubPost[]) => ({
  deleteMany: {},
  create: subPosts.map((subPost) => ({ subPost })),
})
