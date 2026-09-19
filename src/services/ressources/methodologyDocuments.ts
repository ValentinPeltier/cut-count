import path from 'path'

/** Identifiers passed as `downloadKey` from the Ressources page. */
export const METHODOLOGY_DOCUMENT_KEYS = {
  count: 'methodologie_count.pdf',
  resilio: 'methodologie_resilio.pdf',
} as const

export type MethodologyDocumentKey = keyof typeof METHODOLOGY_DOCUMENT_KEYS

export const isMethodologyDocumentKey = (key: string): key is MethodologyDocumentKey => key in METHODOLOGY_DOCUMENT_KEYS

export const getMethodologyDocumentFileName = (documentKey: MethodologyDocumentKey): string =>
  METHODOLOGY_DOCUMENT_KEYS[documentKey]

export const resolveMethodologyDocumentPath = (documentKey: MethodologyDocumentKey): string =>
  path.join(process.cwd(), 'private', 'ressources', METHODOLOGY_DOCUMENT_KEYS[documentKey])

export const getMethodologyDownloadApiPath = (documentKey: MethodologyDocumentKey): string =>
  `/api/ressources/methodologie?documentKey=${encodeURIComponent(documentKey)}`
