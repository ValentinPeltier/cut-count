import { CutPost } from '@/services/posts'

/** Post slugs in study data-entry URLs (`Post` enum keys). */
export const CUT_STUDY_POST_SLUGS = Object.values(CutPost)

/** Dashboard and account pages reachable by a typical CUT admin (seed user). */
export const CUT_DASHBOARD_PAGES: { path: string; testId: string }[] = [
  { path: '/', testId: 'title' },
  { path: '/ressources', testId: 'ressources-sections' },
  { path: '/profil', testId: 'profile-page' },
  { path: '/mentions-legales', testId: 'legal-notices' },
  { path: '/organisations', testId: 'organization-page' },
  { path: '/equipe', testId: 'team-page' },
  { path: '/etudes/creer', testId: 'new-study-organization-title' },
]

/** Public Count! routes (no auth). */
export const CUT_PUBLIC_PAGES: { path: string; testId: string }[] = [
  { path: '/login', testId: 'input-email' },
  { path: '/register', testId: 'activation-email' },
  { path: '/reset-password', testId: 'input-email' },
]

/** Study sub-routes for the golden seeded study (relative to `/etudes/:id`). */
export const CUT_GOLDEN_STUDY_PATHS = [
  'cadrage',
  'cadrage/ajouter',
  'comptabilisation/saisie-des-donnees',
  'comptabilisation/resultats',
] as const