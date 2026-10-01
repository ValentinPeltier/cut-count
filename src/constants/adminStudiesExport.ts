import { SubPost } from '@/generated/prisma/enums'
import { CutPost } from '@/services/posts'

/** Column A formatting taken from Export Count.xlsx (bold titles, italic headings, indented sub-posts). */
export type AdminExportTextStyle = 'bold' | 'italic' | 'indent'

/** Identifiers for activity-data cells. The Excel "CHEMIN" column is never exported. */
export type AdminExportExtractorId =
  | 'authorEmail'
  | 'studyName'
  | 'cinemaName'
  | 'surface'
  | 'department'
  | 'screens'
  | 'sessions'
  | 'tickets'
  | 'openDays'
  | 'programmedFilms'
  | 'seats'
  | 'constructionYear'
  | 'teamTransport'
  | 'proTravelTransport'
  | 'electricity'
  | 'gas'
  | 'fuel'
  | 'districtHeat'
  | 'airConditioning'
  | 'mobilitySurvey'
  | 'spectatorMobility'
  | 'previewTeams'
  | 'xenonProjectors'
  | 'laserProjectors'
  | 'screens2d'
  | 'screens3d'
  | 'screenSurface'
  | 'confectionerySale'
  | 'confectioneryMass'
  | 'wasteHousehold'
  | 'wastePackaging'
  | 'wasteBio'
  | 'wasteGlass'
  | 'xenonLamps'
  | 'posters40'
  | 'posters120'
  | 'plvCounter'
  | 'plvLarge'
  | 'cinemaMaterialMass'
  | 'newsletters'
  | 'dynamicDisplay'
  | 'outdoorDisplay'
  | 'selfServiceTills'
  | 'classicTills'

export type AdminStudiesExportRow = (
  | { kind: 'section'; label: string }
  | { kind: 'field'; label: string; extractor: AdminExportExtractorId }
  | { kind: 'impactTotal'; label: string }
  | { kind: 'post'; label: string; post: CutPost }
  | { kind: 'subPost'; label: string; post: CutPost; subPost: SubPost }
) & { textStyle?: AdminExportTextStyle }

const field = (label: string, extractor: AdminExportExtractorId): AdminStudiesExportRow => ({
  kind: 'field',
  label,
  extractor,
})

const section = (label: string, textStyle?: AdminExportTextStyle): AdminStudiesExportRow => ({
  kind: 'section',
  label,
  textStyle,
})

const post = (label: string, postId: CutPost): AdminStudiesExportRow => ({
  kind: 'post',
  label,
  post: postId,
})

const subPost = (label: string, postId: CutPost, subPostId: SubPost): AdminStudiesExportRow => ({
  kind: 'subPost',
  label,
  post: postId,
  subPost: subPostId,
  textStyle: 'indent',
})

/**
 * Row labels match Export Count.xlsx column A.
 * The yellow comment cells and the CHEMIN column are absent.
 * "Données d'impact (en tCO2)" is the sum of the Count posts.
 */
export const ADMIN_STUDIES_EXPORT_ROWS: AdminStudiesExportRow[] = [
  section('Données générales', 'bold'),
  field('Adresse mail', 'authorEmail'),
  field("Nom de l'étude", 'studyName'),
  field('Nom du cinéma', 'cinemaName'),
  field('Surface (m²)', 'surface'),
  field('Département', 'department'),
  field("Nombre d'écrans", 'screens'),
  field('Nombre de séances', 'sessions'),
  field("Nombre d'entrées", 'tickets'),
  field("Nombre de jours d'ouverture", 'openDays'),
  field('Nombre de films programmés', 'programmedFilms'),
  field('Nombre de fauteuils', 'seats'),
  section("Données d'entrée", 'bold'),
  field('Date de construction', 'constructionYear'),
  field('Distance / moyen de transport (km)', 'teamTransport'),
  field('Distance / moyen de transport (km)', 'proTravelTransport'),
  field('Conso électrique (kWh)', 'electricity'),
  field('Conso gaz (m3)', 'gas'),
  field('Conso fuel (l)', 'fuel'),
  field('Conso réseau de chaleur (kWh)', 'districtHeat'),
  field('Présence de la clim (oui/non)', 'airConditioning'),
  field('Réalisation enquête mobilité (oui/non)', 'mobilitySurvey'),
  field('Distance / moyen de transport (km)', 'spectatorMobility'),
  field('Tournées AVP (nb équipes)', 'previewTeams'),
  field('Quantité de projecteurs xénon (u)', 'xenonProjectors'),
  field('Quantité de projecteurs laser (u)', 'laserProjectors'),
  field('Quantité Ecran 2D (u)', 'screens2d'),
  field('Quantité écrans 3D (u)', 'screens3d'),
  field("Surface de l'écran (m²)", 'screenSurface'),
  field('Vente de confiserie (o/n)', 'confectionerySale'),
  field('Masse confiserie vendue (g/spect)', 'confectioneryMass'),
  field("Masse de d'ordures ménagères (t)", 'wasteHousehold'),
  field("Masse d'emballages et papiers (t)", 'wastePackaging'),
  field('Masse de biodéchets (t)', 'wasteBio'),
  field('Masse de verre (t)', 'wasteGlass'),
  field('Lampes xénon jetées (u)', 'xenonLamps'),
  field('Quantité affiches 40x60 (u)', 'posters40'),
  field('Quantité affiches 120x160 (u)', 'posters120'),
  field('Quantité PLV comptoir (u)', 'plvCounter'),
  field('Quantité grandes PLV (u)', 'plvLarge'),
  field('Masse matériel cinéma (kg)', 'cinemaMaterialMass'),
  field('Newsletters envoyées (nb de news * nb de personnes) (u)', 'newsletters'),
  field('Caissons affichage dynamique (u)', 'dynamicDisplay'),
  field('Surface affichage extérieur (m²)', 'outdoorDisplay'),
  field('Caisses libre-service (u)', 'selfServiceTills'),
  field('Caisses classiques (u)', 'classicTills'),
  { kind: 'impactTotal', label: "Données d'impact (en tCO2)", textStyle: 'bold' },
  post('Fonctionnement', CutPost.Fonctionnement),
  subPost('Bâtiment', CutPost.Fonctionnement, SubPost.Batiment),
  subPost('Equipe', CutPost.Fonctionnement, SubPost.Equipe),
  subPost('Déplacements professionnels', CutPost.Fonctionnement, SubPost.DeplacementsProfessionnels),
  subPost('Energie', CutPost.Fonctionnement, SubPost.Energie),
  subPost('Activités de bureau', CutPost.Fonctionnement, SubPost.ActivitesDeBureau),
  post('Mobilité spectateurs', CutPost.MobiliteSpectateurs),
  post('Tournées avant-premières', CutPost.TourneesAvantPremieres),
  post('Salles et cabines', CutPost.SallesEtCabines),
  subPost('Matériel technique', CutPost.SallesEtCabines, SubPost.MaterielTechnique),
  subPost('Autres matériel', CutPost.SallesEtCabines, SubPost.AutreMateriel),
  post('Confiseries et boissons', CutPost.ConfiseriesEtBoissons),
  subPost('Achats', CutPost.ConfiseriesEtBoissons, SubPost.Achats),
  subPost('Fret', CutPost.ConfiseriesEtBoissons, SubPost.Fret),
  subPost('Electroménager', CutPost.ConfiseriesEtBoissons, SubPost.Electromenager),
  post('Déchets', CutPost.Dechets),
  subPost('Déchets ordinaires', CutPost.Dechets, SubPost.DechetsOrdinaires),
  subPost('Déchets exceptionnels', CutPost.Dechets, SubPost.DechetsExceptionnels),
  post('Billetterie et communication', CutPost.BilletterieEtCommunication),
  subPost('Matériel distributeur', CutPost.BilletterieEtCommunication, SubPost.MaterielDistributeurs),
  subPost('Matériel Cinéma', CutPost.BilletterieEtCommunication, SubPost.MaterielCinema),
  subPost('Communication digitale', CutPost.BilletterieEtCommunication, SubPost.CommunicationDigitale),
  subPost('Caisses et bornes', CutPost.BilletterieEtCommunication, SubPost.CaissesEtBornes),
]

export const ADMIN_STUDIES_EXPORT_SHEET_NAME = 'Sheet1'
