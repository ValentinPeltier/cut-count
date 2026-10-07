import { Locale } from '@/lib/i18n/config'
import { expect } from '@jest/globals'
import { execFileSync } from 'child_process'
import fs from 'fs'
import path from 'path'

describe('Translations', () => {
  const translationsDir = path.join(__dirname, 'translations')
  const repoRoot = path.join(__dirname, '../..')

  it.each([Locale.FR, Locale.EN])('loads the %s message tree from a single file', (locale) => {
    const messages = JSON.parse(fs.readFileSync(path.join(translationsDir, `${locale}.json`), 'utf8'))

    expect(messages).toBeDefined()
    expect(messages.common).toBeDefined()
    expect(messages['publicodes-rules']).toBeDefined()
    expect(messages['publicodes-layout']).toBeDefined()
    expect(fs.existsSync(path.join(translationsDir, locale, 'bc.json'))).toBe(false)
  })

  it('keeps the same keys across locales and rejects empty values', () => {
    expect(() =>
      execFileSync('node', ['scripts/i18n/check-translations.mjs'], {
        cwd: repoRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      }),
    ).not.toThrow()
  })
})
