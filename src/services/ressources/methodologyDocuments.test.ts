import path from 'path'
import {
  getMethodologyDownloadApiPath,
  isMethodologyDocumentKey,
  resolveMethodologyDocumentPath,
} from './methodologyDocuments'

describe('methodologyDocuments', () => {
  it('recognizes configured document keys', () => {
    expect(isMethodologyDocumentKey('count')).toBe(true)
    expect(isMethodologyDocumentKey('resilio')).toBe(true)
    expect(isMethodologyDocumentKey('OTHER')).toBe(false)
  })

  it('resolves files under private/ressources', () => {
    expect(resolveMethodologyDocumentPath('count')).toBe(
      path.join(process.cwd(), 'private', 'ressources', 'methodologie_count.pdf'),
    )
  })

  it('builds download API paths', () => {
    expect(getMethodologyDownloadApiPath('resilio')).toBe(
      '/api/ressources/methodologie?documentKey=resilio',
    )
  })
})
