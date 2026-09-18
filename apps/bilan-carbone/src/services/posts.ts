import { Environment, SubPost } from '@abc-transitionbascarbone/db-common/enums'
import { CutPost } from '@abc-transitionbascarbone/services/results/posts.enums'
import { Post } from '@abc-transitionbascarbone/utils/charts'

export { CutPost }

export type SimplifiedPost = CutPost

export type BaseResultsByPost = {
  post: Post | SubPost | 'total'
  label: string
  value: number
  children: BaseResultsByPost[]
}

export const subPostsByPostCUT: Record<CutPost, SubPost[]> = {
  [CutPost.Fonctionnement]: [
    SubPost.Batiment,
    SubPost.Equipe,
    SubPost.DeplacementsProfessionnels,
    SubPost.Energie,
    SubPost.ActivitesDeBureau,
  ],
  [CutPost.MobiliteSpectateurs]: [SubPost.MobiliteSpectateurs],
  [CutPost.TourneesAvantPremieres]: [SubPost.EquipesRecues],
  [CutPost.SallesEtCabines]: [SubPost.MaterielTechnique, SubPost.AutreMateriel],
  [CutPost.ConfiseriesEtBoissons]: [SubPost.Achats, SubPost.Fret, SubPost.Electromenager],
  [CutPost.Dechets]: [SubPost.DechetsOrdinaires, SubPost.DechetsExceptionnels],
  [CutPost.BilletterieEtCommunication]: [
    SubPost.MaterielDistributeurs,
    SubPost.MaterielCinema,
    SubPost.CommunicationDigitale,
    SubPost.CaissesEtBornes,
  ],
}

export const environmentPostMapping = {
  [Environment.CUT]: CutPost,
}

export const subPostsByPost: Record<Post, SubPost[]> = {
  ...subPostsByPostCUT,
}

export const environmentSubPostsMapping = {
  [Environment.CUT]: subPostsByPostCUT,
}

export const getEnvPosts = (_environment?: Environment | null): Post[] => Object.values(CutPost)

export const getEnvSubPosts = (_environment?: Environment | null): SubPost[] => Object.values(subPostsByPostCUT).flat()

export const convertSimplifiedEnvToBilanCarbone = (results: BaseResultsByPost[]): Record<string, number> =>
  Object.fromEntries(results.filter((result) => result.post !== 'total').map((result) => [result.label, result.value]))
