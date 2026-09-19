import { getMockSireneEtablissement } from '@/services/inseeSireneMock'
import axios from 'axios'

const fetchSireneEtablissement = async (trimmedSiret: string) => {
  if (process.env.APP_ENV === 'test') {
    return getMockSireneEtablissement(trimmedSiret)
  }

  const result = await axios.get(`${process.env.INSEE_SIRENE_API_URL}/${trimmedSiret}`, {
    headers: {
      'X-INSEE-Api-Key-Integration': process.env.INSEE_SIRENE_API_SECRET,
    },
  })

  return result?.data?.etablissement
}

export const getValidAssociationNameBySiret = async (siret: string): Promise<string | null> => {
  const trimmedSiret = siret.trim()
  if (!trimmedSiret || trimmedSiret.length !== 14) {
    return null
  }

  try {
    const etablissement = await fetchSireneEtablissement(trimmedSiret)
    if (!etablissement) {
      return null
    }

    // Vérifier que le SIRET correspond bien à l'établissement
    if (etablissement.siret !== trimmedSiret) {
      return null
    }

    // Codes juridiques des associations :
    // 9210 : Association non déclarée
    // 9220 : Association déclarée
    // 9221 : Association déclarée d'insertion par l'économique
    // 9222 : Association intermédiaire
    // 9223 : Groupement d'employeurs
    // 9224 : Association d'avocats à responsabilité professionnelle individuelle
    // 9230 : Association déclarée, reconnue d'utilité publique
    // 9240 : Congrégation
    // 9260 : Association de droit local (Bas-Rhin, Haut-Rhin et Moselle)
    const associationCategories = ['9210', '9220', '9221', '9222', '9223', '9224', '9230', '9240', '9260']
    const categorieJuridique = etablissement.uniteLegale?.categorieJuridiqueUniteLegale
    const isAssociation = associationCategories.includes(categorieJuridique)

    if (!isAssociation) {
      return null
    }

    // Retourner le nom de l'association
    return (etablissement.uniteLegale?.denominationUniteLegale as string) || null
  } catch (error) {
    console.error('Error getting valid association name by SIRET:', error)
    return null
  }
}

export const getCompanyName = async (siret: string) => {
  const trimmedSiret = siret.trim()
  if (!trimmedSiret || trimmedSiret.length !== 14) {
    return null
  }

  const etablissement = await fetchSireneEtablissement(trimmedSiret)

  return etablissement?.uniteLegale?.denominationUniteLegale as string
}
