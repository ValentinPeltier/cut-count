import { BCPost, CutPost, subPostsByPost } from '@/services/posts'
import type { ResultType } from '@/types/study.types'
import { Environment, SubPost } from '@abc-transitionbascarbone/db-common/enums'
import { Translations } from '@abc-transitionbascarbone/lib'
import { Post } from '@abc-transitionbascarbone/utils/charts'

export const getPost = (subPost?: SubPost) =>
  subPost
    ? (Object.keys(subPostsByPost).find((post: string) => subPostsByPost[post as Post].includes(subPost)) as Post)
    : undefined

export const getPostsFromSubPosts = (subPosts: SubPost[]): Post[] =>
  [...new Set(subPosts.map(getPost).filter(Boolean))] as Post[]

export const flattenSubposts = (subPosts: Record<Post, SubPost[]>) =>
  Object.keys(subPosts)
    .map((post) => (subPosts?.[post as Post] || []).flat())
    .flat()

const withInfobulleList: (Post | SubPost)[] = [
  Post.DechetsDirects,
  Post.IntrantsBiensEtMatieres,
  Post.Immobilisations,
  Post.FinDeVie,
  SubPost.DeplacementsDomicileTravail,
  SubPost.DeplacementsProfessionnels,
  SubPost.DeplacementsVisiteurs,
  SubPost.CombustiblesFossiles,
  SubPost.CombustiblesOrganiques,
  SubPost.ReseauxDeChaleurEtDeVapeur,
  SubPost.ReseauxDeFroid,
  SubPost.Electricite,
  SubPost.Agriculture,
  SubPost.EmissionsLieesAuChangementDAffectationDesSolsCas,
  SubPost.EmissionsLieesALaProductionDeFroid,
  SubPost.EmissionsLieesAuxProcedesIndustriels,
  SubPost.FretInterne,
  SubPost.ServicesEnApprocheMonetaire,
  SubPost.MatiereDestineeAuxEmballages,
  SubPost.BiensEtMatieresEnApprocheMonetaire,
  SubPost.UtilisationEnResponsabilite,
  SubPost.UtilisationEnDependance,
  Post.IntrantsBiensEtMatieresTilt,
  Post.Alimentation,
  Post.IntrantsServices,
  Post.EquipementsEtImmobilisations,
  Post.ConstructionDesLocaux,
  Post.Energies,
  Post.FroidEtClim,
  Post.Utilisation,
  Post.Teletravail,
  Post.TransportDeMarchandises,
  SubPost.DeplacementsFabricationDesVehicules,
  SubPost.DeplacementsDomicileTravailSalaries,
  SubPost.DeplacementsDomicileTravailBenevoles,
  SubPost.DeplacementsDansLeCadreDUneMissionAssociativeSalaries,
  SubPost.DeplacementsDansLeCadreDUneMissionAssociativeBenevoles,
  SubPost.DeplacementsDesBeneficiaires,
  SubPost.TransportFabricationDesVehicules,
  SubPost.ActivitesIndustrielles,
  Post.DeplacementsDePersonneSimplified,
  Post.AlimentationSimplified,
  Post.ServiceEtNumeriqueSimplified,
  Post.EquipementsEtImmobilisationsSimplified,
  Post.TeletravailSimplified,
]

export const withInfobulle = (post: Post | SubPost) => withInfobulleList.includes(post)

export const getPostValues = (environment: Environment | undefined, _type?: ResultType) => {
  if (!environment) {
    return BCPost
  }

  switch (environment) {
    case Environment.CUT:
      return CutPost
    case Environment.BC:
    default:
      return BCPost
  }
}

export const getSortedPosts = (posts: Post[], t: Translations, _environment?: Environment) => {
  return posts.sort((a, b) => t(a).localeCompare(t(b)))
}
