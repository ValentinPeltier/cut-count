import type { AdminExportExtractorId } from '@/constants/adminStudiesExport'
import { studySiteToCutSituation } from '@/environments/cut/publicodes/studySiteToSituation'
import { StudyResultUnit, SubPost } from '@/generated/prisma/enums'
import { safeEvaluate } from '@/publicodes/utils'
import type { BaseResultsByPost } from '@/services/posts'
import { formatEmissionValueForExport } from '@/utils/study'
import type Engine from 'publicodes'
import { Situation } from 'publicodes'
import type { AdminExportStudySite } from './types'

export type AdminExportCell = string | number | ''

type SituationRecord = Record<string, unknown>

type ListEntry = { id: string; situation: SituationRecord }

const TEAM_LIST = 'fonctionnement . équipe . collaborateurs'
const TEAM_DISTANCE = 'fonctionnement . équipe . collaborateur type . transport . distance'
const TEAM_MODE = 'fonctionnement . équipe . collaborateur type . transport . moyen de transport'

const PRO_LIST = 'fonctionnement . déplacements pro . déplacements'
const PRO_DISTANCE = 'fonctionnement . déplacements pro . déplacement type . transport . distance'
const PRO_MODE = 'fonctionnement . déplacements pro . déplacement type . transport . moyen de transport'

const ROOM_LIST = 'salles et cabines . matériel technique . salles'
const PROJECTOR_TYPE = 'salles et cabines . matériel technique . salle . projecteur . type'
const SCREEN_TYPE = 'salles et cabines . matériel technique . salle . écran . type'
const SCREEN_SURFACE = 'salles et cabines . matériel technique . salle . écran . surface écran'
const SEAT_COUNT = 'salles et cabines . matériel technique . salle . fauteuils . nombre'

const WEEKS_PER_YEAR = 52
const MONTHS_PER_YEAR = 12
const DEFAULT_WASTE_DENSITY_KG_PER_L = 0.3
const GLASS_DENSITY_KG_PER_L = 0.04

const SPECTATOR_DISTANCES: Array<[string, string]> = [
  ['RER et transilien', 'mobilité spectateurs . résultat précis . empreinte . RER et transilien . distance'],
  ['métro ou tram', 'mobilité spectateurs . résultat précis . empreinte . métro ou tram . distance'],
  ['bus', 'mobilité spectateurs . résultat précis . empreinte . bus . distance'],
  ['vélo électrique', 'mobilité spectateurs . résultat précis . empreinte . vélo électrique . distance'],
  ['vélo classique', 'mobilité spectateurs . résultat précis . empreinte . vélo classique . distance'],
  ['marche', 'mobilité spectateurs . résultat précis . empreinte . marche . distance'],
  ['voiture diesel', 'mobilité spectateurs . résultat précis . empreinte . voiture diesel . distance'],
  ['voiture essence', 'mobilité spectateurs . résultat précis . empreinte . voiture essence . distance'],
  ['voiture hybride', 'mobilité spectateurs . résultat précis . empreinte . voiture hybride . distance'],
  ['voiture électrique', 'mobilité spectateurs . résultat précis . empreinte . voiture électrique . distance'],
  ['moto', 'mobilité spectateurs . résultat précis . empreinte . moto . distance'],
  ['scooter', 'mobilité spectateurs . résultat précis . empreinte . scooter . distance'],
  ['trottinette électrique', 'mobilité spectateurs . résultat précis . empreinte . trottinette électrique . distance'],
]

export type AdminExportContext = {
  site: AdminExportStudySite
  situation: Situation<string>
  engine: Engine
  results: BaseResultsByPost[]
}

export const cinemaDisplayName = (site: AdminExportStudySite): string => {
  const name = site.site.name.trim()
  if (name) {
    return name
  }
  return site.site.cnc?.nom?.trim() || site.id
}

export const mergedSituation = (site: AdminExportStudySite): Situation<string> => {
  const stored = isRecord(site.situation?.situation) ? (site.situation.situation as Situation<string>) : {}
  return {
    ...studySiteToCutSituation(site),
    ...stored,
  }
}

const isRecord = (value: unknown): value is SituationRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const unquote = (value: unknown): string => {
  if (typeof value !== 'string') {
    return ''
  }
  return value.replace(/^'(.*)'$/, '$1')
}

const readNumber = (source: SituationRecord, key: string): number | '' => {
  const value = source[key]
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(unquote(value)))) {
    return Number(unquote(value))
  }
  return ''
}

const readText = (source: SituationRecord, key: string): string => unquote(source[key])

const yesNo = (value: unknown, style: 'oui-non' | 'o-n'): string => {
  const raw = unquote(value).toLowerCase()
  const isYes = raw === 'oui' || raw === 'o' || value === true
  const isNo = raw === 'non' || raw === 'n' || value === false
  if (!isYes && !isNo) {
    return ''
  }
  if (style === 'o-n') {
    return isYes ? 'o' : 'n'
  }
  return isYes ? 'oui' : 'non'
}

const listSituations = (site: AdminExportStudySite, targetRule: string, sampleKey: string): SituationRecord[] => {
  const lists = site.situation?.listLayoutSituations
  if (isRecord(lists)) {
    const entries = lists[targetRule]
    if (Array.isArray(entries)) {
      const situations = entries
        .filter((entry): entry is ListEntry => isRecord(entry) && isRecord(entry.situation))
        .map((entry) => entry.situation)
      if (situations.length > 0) {
        return situations
      }
    }
  }

  const situation = mergedSituation(site) as SituationRecord
  if (situation[sampleKey] != null && situation[sampleKey] !== '') {
    return [situation]
  }
  return []
}

const formatDistanceAndMode = (entries: SituationRecord[], distanceKey: string, modeKey: string): string =>
  entries
    .map((entry) => {
      const distance = readNumber(entry, distanceKey)
      const mode = readText(entry, modeKey)
      return [distance === '' ? '' : String(distance), mode].filter(Boolean).join(' ')
    })
    .filter(Boolean)
    .join(' ; ')

const rooms = (site: AdminExportStudySite): SituationRecord[] => listSituations(site, ROOM_LIST, PROJECTOR_TYPE)

const countMatching = (entries: SituationRecord[], key: string, expected: string): number | '' => {
  if (entries.length === 0) {
    return ''
  }
  return entries.filter((entry) => readText(entry, key) === expected).length
}

const sumNumbers = (entries: SituationRecord[], key: string): number | '' => {
  if (entries.length === 0) {
    return ''
  }
  return entries.reduce((total, entry) => {
    const value = readNumber(entry, key)
    return total + (value === '' ? 0 : value)
  }, 0)
}

const definedNumber = (source: SituationRecord, key: string): number | '' => {
  if (source[key] == null || source[key] === '') {
    return ''
  }
  return readNumber(source, key)
}

/**
 * Ordinary waste mass in tonnes: bins × capacity × density × pickups/week × 52 × 0.001.
 * Matches the Publicodes product minus the emission factor.
 */
const wasteTonnes = (situation: SituationRecord, prefix: string, densityKgPerLitre: number): number | '' => {
  const bins = definedNumber(situation, `${prefix} . nombre bennes`)
  const size = definedNumber(situation, `${prefix} . taille benne`)
  const frequency = definedNumber(situation, `${prefix} . fréquence ramassage`)
  if (bins === '' || size === '' || frequency === '') {
    return ''
  }
  const tonnes = bins * size * densityKgPerLitre * frequency * WEEKS_PER_YEAR * 0.001
  return Math.round(tonnes * 1000) / 1000
}

const cinemaMaterialKg = (situation: SituationRecord): number | '' => {
  const items = [
    { key: 'billetterie et communication . matériel cinéma . production . programme . nombre', weightKg: 0.005 },
    { key: 'billetterie et communication . matériel cinéma . production . affiches . nombre', weightKg: 0.027 },
    { key: 'billetterie et communication . matériel cinéma . production . flyers . nombre', weightKg: 0.0042 },
  ]
  const defined = items
    .map((item) => ({ ...item, quantity: definedNumber(situation, item.key) }))
    .filter((item) => item.quantity !== '')
  if (defined.length === 0) {
    return ''
  }
  const kilograms = defined.reduce(
    (total, item) => total + (item.quantity as number) * item.weightKg * MONTHS_PER_YEAR,
    0,
  )
  return Math.round(kilograms * 1000) / 1000
}

const newslettersSent = (situation: SituationRecord): number | '' => {
  const count = definedNumber(situation, 'billetterie et communication . communication digitale . newsletters . nombre')
  const recipients = definedNumber(
    situation,
    'billetterie et communication . communication digitale . newsletters . destinataires',
  )
  if (count === '' || recipients === '') {
    return ''
  }
  return count * recipients
}

const impactValue = (results: BaseResultsByPost[], post: string, subPost?: SubPost): number => {
  const postRow = results.find((result) => result.post === post)
  const value = subPost ? postRow?.children.find((child) => child.post === subPost)?.value : postRow?.value
  return formatEmissionValueForExport(value ?? 0, StudyResultUnit.T)
}

export const extractField = (extractor: AdminExportExtractorId, context: AdminExportContext): AdminExportCell => {
  const { site, situation, engine } = context
  const record = situation as SituationRecord

  switch (extractor) {
    case 'authorEmail':
      return site.study.createdBy.user.email
    case 'studyName':
      return site.study.name
    case 'cinemaName':
      return cinemaDisplayName(site)
    case 'surface':
      return readNumber(record, 'fonctionnement . bâtiment . construction . surface')
    case 'department':
      return site.site.cnc?.dep ?? ''
    case 'screens':
      return readNumber(record, 'général . nombre écrans') || site.site.cnc?.ecrans || ''
    case 'sessions':
      return readNumber(record, 'général . nombre séances')
    case 'tickets':
      return readNumber(record, 'général . nombre entrées')
    case 'openDays':
      return readNumber(record, 'général . nombre de jours ouverture')
    case 'programmedFilms':
      return readNumber(record, 'général . nombre de films programmés') || site.site.cnc?.numberOfProgrammedFilms || ''
    case 'seats': {
      const fromRooms = sumNumbers(rooms(site), SEAT_COUNT)
      if (fromRooms !== '' && fromRooms !== 0) {
        return fromRooms
      }
      return site.site.cnc?.fauteuils ?? ''
    }
    case 'constructionYear':
      return readText(record, 'fonctionnement . bâtiment . construction . année de construction')
    case 'teamTransport':
      return formatDistanceAndMode(listSituations(site, TEAM_LIST, TEAM_DISTANCE), TEAM_DISTANCE, TEAM_MODE)
    case 'proTravelTransport':
      return formatDistanceAndMode(listSituations(site, PRO_LIST, PRO_DISTANCE), PRO_DISTANCE, PRO_MODE)
    case 'electricity':
      return readNumber(record, 'fonctionnement . énergie . électricité . consommation')
    case 'gas':
      return readNumber(record, 'fonctionnement . énergie . gaz . consommation')
    case 'fuel':
      return readNumber(record, 'fonctionnement . énergie . fioul . consommation')
    case 'districtHeat':
      return readNumber(record, 'fonctionnement . énergie . réseau de chaleur . consommation')
    case 'airConditioning':
      return yesNo(record['fonctionnement . énergie . est équipé climatisation'], 'oui-non')
    case 'mobilitySurvey': {
      const precision = readText(record, 'mobilité spectateurs . précision')
      if (precision === 'résultat précis') {
        return 'oui'
      }
      if (precision === 'estimation' || precision === 'besoin') {
        return 'non'
      }
      return ''
    }
    case 'spectatorMobility':
      return SPECTATOR_DISTANCES.map(([label, key]) => {
        const distance = readNumber(record, key)
        return distance === '' || distance === 0 ? '' : `${distance} ${label}`
      })
        .filter(Boolean)
        .join(' ; ')
    case 'previewTeams':
      return readNumber(record, 'tournées avant premières . équipes reçues . nombre équipes')
    case 'xenonProjectors':
      return countMatching(rooms(site), PROJECTOR_TYPE, 'xénon')
    case 'laserProjectors':
      return countMatching(rooms(site), PROJECTOR_TYPE, 'laser')
    case 'screens2d':
      return countMatching(rooms(site), SCREEN_TYPE, 'écran 2D')
    case 'screens3d':
      return countMatching(rooms(site), SCREEN_TYPE, 'écran 3D')
    case 'screenSurface':
      return sumNumbers(rooms(site), SCREEN_SURFACE)
    case 'confectionerySale':
      return yesNo(record['confiseries et boissons . achats . vente sur place'], 'o-n')
    case 'confectioneryMass': {
      if (yesNo(record['confiseries et boissons . achats . vente sur place'], 'oui-non') !== 'oui') {
        return ''
      }
      const kilogramsPerEntry = safeEvaluate(engine, 'confiseries et boissons . achats . poids unitaire')
      return kilogramsPerEntry ? Math.round(kilogramsPerEntry * 1000) : ''
    }
    case 'wasteHousehold':
      return wasteTonnes(record, 'déchets . ordinaires . ordures ménagères', DEFAULT_WASTE_DENSITY_KG_PER_L)
    case 'wastePackaging':
      return wasteTonnes(record, 'déchets . ordinaires . emballages et papier', DEFAULT_WASTE_DENSITY_KG_PER_L)
    case 'wasteBio':
      return wasteTonnes(record, 'déchets . ordinaires . biodéchets', DEFAULT_WASTE_DENSITY_KG_PER_L)
    case 'wasteGlass':
      return wasteTonnes(record, 'déchets . ordinaires . verre', GLASS_DENSITY_KG_PER_L)
    case 'xenonLamps':
      return readNumber(record, 'déchets . exceptionnels . lampe xenon . nombre')
    case 'posters40':
      return readNumber(
        record,
        'billetterie et communication . matériel distributeurs . affiches . affiches 40x60 . nombre',
      )
    case 'posters120':
      return readNumber(
        record,
        'billetterie et communication . matériel distributeurs . affiches . affiches 120x160 . nombre',
      )
    case 'plvCounter':
      return readNumber(record, 'billetterie et communication . matériel distributeurs . PLV . PLV comptoir . nombre')
    case 'plvLarge':
      return readNumber(
        record,
        'billetterie et communication . matériel distributeurs . PLV . PLV grand format . nombre',
      )
    case 'cinemaMaterialMass':
      return cinemaMaterialKg(record)
    case 'newsletters':
      return newslettersSent(record)
    case 'dynamicDisplay':
      return readNumber(record, 'billetterie et communication . communication digitale . affichage dynamique . nombre')
    case 'outdoorDisplay':
      return readNumber(record, 'billetterie et communication . communication digitale . affichage extérieur . surface')
    case 'selfServiceTills':
      return readNumber(record, 'billetterie et communication . caisses et bornes . caisses libre service . nombre')
    case 'classicTills':
      return readNumber(record, 'billetterie et communication . caisses et bornes . caisse classique . nombre')
    default:
      return ''
  }
}

export const extractImpact = (results: BaseResultsByPost[], post: string, subPost?: SubPost): number =>
  impactValue(results, post, subPost)
