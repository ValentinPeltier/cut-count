import { Locale } from '@/lib/i18n/config'
import { expect } from '@jest/globals'
import fs from 'fs'
import path from 'path'

describe('Translations', () => {
  it('loads the French message tree from a single file', () => {
    const translationsDir = path.join(__dirname, 'translations')
    const messages = JSON.parse(fs.readFileSync(path.join(translationsDir, `${Locale.FR}.json`), 'utf8'))

    expect(messages).toBeDefined()
    expect(messages.common).toBeDefined()
    expect(messages['publicodes-rules']).toBeDefined()
    expect(messages['publicodes-layout']).toBeDefined()
    expect(fs.existsSync(path.join(translationsDir, Locale.FR, 'bc.json'))).toBe(false)
  })
})
