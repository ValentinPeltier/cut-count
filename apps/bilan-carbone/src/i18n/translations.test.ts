import { Locale } from '@abc-transitionbascarbone/i18n/config'
import { expect } from '@jest/globals'
import fs from 'fs'
import path from 'path'

describe('Translations', () => {
  it('loads French common and cut message trees', () => {
    const translationsDir = path.join(__dirname, 'translations', Locale.FR)
    const common = JSON.parse(fs.readFileSync(path.join(translationsDir, 'cut.json'), 'utf8'))
    const cut = JSON.parse(fs.readFileSync(path.join(translationsDir, 'cut.json'), 'utf8'))
    const packagesCommon = path.join(__dirname, '../../../../packages/i18n/translations', Locale.FR, 'common.json')

    expect(common).toBeDefined()
    expect(cut).toBeDefined()
    expect(fs.existsSync(packagesCommon)).toBe(true)
    expect(fs.existsSync(path.join(translationsDir, 'bc.json'))).toBe(false)
  })
})
