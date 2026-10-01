import { StudyResultUnit } from '@/generated/prisma/enums'
import { loadCountSituation } from '@/tests/fixtures/count/loadFixtures'
import { buildAdminStudiesExportSheet } from './buildAdminStudiesExportSheet'
import type { AdminExportStudySite } from './types'

const tPost = (key: string) => key

const goldenSite = (overrides: Partial<AdminExportStudySite> = {}): AdminExportStudySite => ({
  id: 'golden-site',
  numberOfSessions: 1200,
  numberOfTickets: 50000,
  numberOfOpenDays: 365,
  distanceToParis: 200,
  situation: {
    situation: loadCountSituation('rich'),
    listLayoutSituations: {},
  },
  site: {
    name: 'Count golden cinema',
    cnc: {
      nom: null,
      dep: '75',
      ecrans: 3,
      fauteuils: 400,
      numberOfProgrammedFilms: 80,
    },
  },
  study: {
    name: 'Count golden study',
    resultsUnit: StudyResultUnit.T,
    createdBy: { user: { email: 'author@yopmail.com' } },
  },
  ...overrides,
})

const cell = (data: (string | number)[][], label: string, column = 1) => {
  const row = data.find((candidate) => candidate[0] === label)
  return row?.[column]
}

describe('buildAdminStudiesExportSheet', () => {
  it('builds one column per cinema and keeps the template labels', () => {
    const { data } = buildAdminStudiesExportSheet([goldenSite()], tPost)

    expect(data[0]).toEqual(['', 'Count golden cinema'])
    expect(data.map((row) => row[0])).toEqual(
      expect.arrayContaining(['Données générales', "Données d'entrée", 'Adresse mail', "Données d'impact (en tCO2)"]),
    )
    expect(data.some((row) => row[0] === 'Par ensemble (en tCO2)')).toBe(false)
    expect(data.some((row) => row.includes('CHEMIN') || row.includes('DONNEES SOUHAITEES'))).toBe(false)
  })

  it('reads inscription, general data and a post total from the golden situation', () => {
    const { data } = buildAdminStudiesExportSheet([goldenSite()], tPost)

    expect(cell(data, 'Adresse mail')).toBe('author@yopmail.com')
    expect(cell(data, "Nom de l'étude")).toBe('Count golden study')
    expect(cell(data, 'Nom du cinéma')).toBe('Count golden cinema')
    expect(cell(data, "Nombre d'entrées")).toBe(50000)
    expect(cell(data, 'Nombre de séances')).toBe(1200)
    expect(cell(data, "Nombre de jours d'ouverture")).toBe(365)
    expect(cell(data, 'Département')).toBe('75')
    expect(cell(data, "Nombre d'écrans")).toBe(3)
    expect(cell(data, 'Nombre de films programmés')).toBe(80)
    expect(cell(data, 'Nombre de fauteuils')).toBe(400)
    expect(cell(data, 'Conso électrique (kWh)')).toBe(120000)
    expect(cell(data, 'Présence de la clim (oui/non)')).toBe('oui')
    expect(cell(data, 'Réalisation enquête mobilité (oui/non)')).toBe('oui')
    expect(cell(data, 'Distance / moyen de transport (km)')).toBe('10 voiture hybride')
    expect(cell(data, 'Fonctionnement')).toBe(25)
    expect(cell(data, "Données d'impact (en tCO2)")).toBe(25)
  })

  it('sorts cinema columns by display name', () => {
    const later = goldenSite({ id: 'b', site: { ...goldenSite().site, name: 'Zénith' } })
    const earlier = goldenSite({ id: 'a', site: { ...goldenSite().site, name: 'Alpha' } })
    const { data } = buildAdminStudiesExportSheet([later, earlier], tPost)

    expect(data[0]).toEqual(['', 'Alpha', 'Zénith'])
    expect(cell(data, 'Nom du cinéma', 2)).toBe('Zénith')
  })

  it('exports one column per cinema when a study has several sites', () => {
    const firstSite = goldenSite({
      id: 'site-a',
      site: { ...goldenSite().site, name: 'Alpha' },
    })
    const secondSite = goldenSite({
      id: 'site-b',
      site: { ...goldenSite().site, name: 'Zénith' },
    })

    const { data } = buildAdminStudiesExportSheet([secondSite, firstSite], tPost)

    expect(data[0]).toEqual(['', 'Alpha', 'Zénith'])
    expect(cell(data, 'Nom du cinéma', 1)).toBe('Alpha')
    expect(cell(data, 'Nom du cinéma', 2)).toBe('Zénith')
  })
})
