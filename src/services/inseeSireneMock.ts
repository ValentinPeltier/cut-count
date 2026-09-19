import sireneFixture from '@/fixtures/insee/sirene-utt-net-group.json'

type SireneApiResponse = typeof sireneFixture
type SireneEtablissement = NonNullable<SireneApiResponse['etablissement']>

const withSiret = (fixture: SireneApiResponse, siret: string): SireneApiResponse => {
  const etablissement = fixture.etablissement
  if (!etablissement) {
    return fixture
  }

  const nic = siret.slice(9, 14)

  return {
    ...fixture,
    etablissement: {
      ...etablissement,
      siret,
      siren: siret.slice(0, 9),
      nic,
      uniteLegale: etablissement.uniteLegale
        ? {
            ...etablissement.uniteLegale,
            nicSiegeUniteLegale: nic,
          }
        : etablissement.uniteLegale,
    },
  }
}

export const getMockSireneEtablissement = (siret: string): SireneEtablissement | null => {
  if (siret.length !== 14) {
    return null
  }

  const response = withSiret(sireneFixture, siret)
  return response.etablissement ?? null
}
