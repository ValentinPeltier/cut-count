import { BCPost, CutPost, subPostsByPost } from '@/services/posts'
import { AdditionalResultTypes } from '@/types/study.types'
import { Environment, SubPost } from '@abc-transitionbascarbone/db-common/enums'
import { Post } from '@abc-transitionbascarbone/utils/charts'
import { expect } from '@jest/globals'
import { getPost, getPostValues } from './post'

// TODO : remove these mocks. Should not be mocked but tests fail if not
jest.mock('../services/file', () => ({ download: jest.fn() }))
jest.mock('../services/auth', () => ({ auth: jest.fn() }))
jest.mock('uuid', () => ({ v4: jest.fn() }))

jest.mock('../services/permissions/study', () => ({ canReadStudy: jest.fn() }))
jest.mock('./study', () => ({ getAccountRoleOnStudy: jest.fn() }))
jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(() => (key: string) => key),
}))

describe('PostUtils functions', () => {
  describe('getPostValues', () => {
    test('should return BCPost for undefined environment', () => {
      expect(getPostValues(undefined)).toBe(BCPost)
    })

    test('should return BCPost for Environment.BC', () => {
      expect(getPostValues(Environment.BC)).toBe(BCPost)
      expect(getPostValues(Environment.BC, AdditionalResultTypes.ENV_SPECIFIC_EXPORT)).toBe(BCPost)
      expect(getPostValues(Environment.BC, AdditionalResultTypes.CONSOLIDATED)).toBe(BCPost)
    })

    test('should return CutPost for Environment.CUT', () => {
      expect(getPostValues(Environment.CUT)).toBe(CutPost)
      expect(getPostValues(Environment.CUT, AdditionalResultTypes.ENV_SPECIFIC_EXPORT)).toBe(CutPost)
      expect(getPostValues(Environment.CUT, AdditionalResultTypes.CONSOLIDATED)).toBe(CutPost)
    })
  })

  describe('getPost', () => {
    test('should return undefined if subPost is not defined', () => {
      expect(getPost(undefined)).toBe(undefined)
    })

    test('should return Energies for Electricite subpost', () => {
      expect(getPost(SubPost.Electricite)).toBe(Post.Energies)
    })

    test('should return Fonctionnement for Energie subpost', () => {
      expect(getPost(SubPost.Energie)).toBe(CutPost.Fonctionnement)
    })

    test('should return a post that includes the subPost', () => {
      const clicksonOnlySubPosts = new Set<SubPost>([
        SubPost.Combustibles,
        SubPost.AutresGaz,
        SubPost.TypesDeRepasServis,
        SubPost.DistributeursAutomatiques,
        SubPost.TransportDesEleves,
        SubPost.TransportDuPersonnel,
        SubPost.VoyagesScolaires,
        SubPost.Fournitures,
        SubPost.ProduitsChimiques,
        SubPost.EquipementsDeSport,
        SubPost.DechetsRecyclables,
        SubPost.OrduresMenageresResiduelles,
        SubPost.Construction,
        SubPost.Renovation,
        SubPost.EquipementsInformatiqueAudiovisuel,
        SubPost.EquipementsDivers,
      ])
      const tiltOnlySubPosts = new Set<SubPost>([
        SubPost.FroidEtClim,
        SubPost.ActivitesAgricoles,
        SubPost.ActivitesIndustrielles,
        SubPost.DeplacementsDomicileTravailSalaries,
        SubPost.DeplacementsDomicileTravailBenevoles,
        SubPost.DeplacementsDansLeCadreDUneMissionAssociativeSalaries,
        SubPost.DeplacementsDansLeCadreDUneMissionAssociativeBenevoles,
        SubPost.DeplacementsDesBeneficiaires,
        SubPost.DeplacementsFabricationDesVehicules,
        SubPost.Entrant,
        SubPost.Interne,
        SubPost.Sortant,
        SubPost.TransportFabricationDesVehicules,
        SubPost.RepasPrisParLesSalaries,
        SubPost.RepasPrisParLesBenevoles,
        SubPost.RepasPrisParLesBeneficiaires,
        SubPost.EquipementsDesSalaries,
        SubPost.ParcInformatiqueDesSalaries,
        SubPost.EquipementsDesBenevoles,
        SubPost.ParcInformatiqueDesBenevoles,
        SubPost.UtilisationEnResponsabiliteConsommationDeBiens,
        SubPost.UtilisationEnResponsabiliteConsommationNumerique,
        SubPost.UtilisationEnResponsabiliteConsommationDEnergie,
        SubPost.UtilisationEnResponsabiliteFuitesEtAutresConsommations,
        SubPost.UtilisationEnDependanceConsommationDeBiens,
        SubPost.UtilisationEnDependanceConsommationNumerique,
        SubPost.UtilisationEnDependanceConsommationDEnergie,
        SubPost.UtilisationEnDependanceFuitesEtAutresConsommations,
        SubPost.TeletravailSalaries,
        SubPost.TeletravailBenevoles,
        SubPost.EnergieSimplified,
        SubPost.DechetsEmisParLOrganisation,
        SubPost.DeplacementsBenevoles,
        SubPost.BienMatieres,
        SubPost.ConsommationsEnergieUtilisationProduits,
        SubPost.FinDeVieProduitsVendusFournisBeneficiaires,
        SubPost.TeletravailSalariesBenevoles,
        SubPost.Evenement,
      ])

      Object.values(SubPost).forEach((subPost: SubPost) => {
        if (clicksonOnlySubPosts.has(subPost) || tiltOnlySubPosts.has(subPost)) {
          return
        }
        const res = getPost(subPost)
        if (!res) {
          throw new Error(`getPost returned undefined for subPost: ${subPost}`)
        }
        if (!subPostsByPost[res]) {
          throw new Error(`subPostsByPost[${res}] is undefined for subPost: ${subPost}`)
        }
        expect(subPostsByPost[res]).toContain(subPost)
      })
    })
  })
})
