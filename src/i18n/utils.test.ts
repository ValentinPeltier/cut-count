import { Locale } from '@/lib/i18n/config'
import { expect } from '@jest/globals'
import { getMessages } from './utils'

describe('getMessages', () => {
  it('loads French messages by default', async () => {
    const result = await getMessages()
    expect(result.locale).toBe(Locale.FR)
    expect(result.messages.profile.title).toBe('Mon profil')
    expect(result.messages.locale.selector).toBe('Langue du site')
  })

  it('loads English messages when locale is en', async () => {
    const result = await getMessages(Locale.EN)
    expect(result.locale).toBe(Locale.EN)
    expect(result.messages.profile.title).toBe('My profile')
    expect(result.messages.locale.selector).toBe('Site language')
    expect(result.messages.login.welcome).toBe('Welcome on ')
    expect(result.messages.login.form.login).toBe('Log in')
    expect(result.messages.login.form.password).toBe('Password')
    expect(result.messages.login.form.forgotPassword).toBe('Forgot password?')
    expect(result.messages.login.form.firstConnection).toBe('First login?')
    expect(result.messages.login.cineo).toBe('Tool developed thanks to the Bilan Carbone® assessments of Cineo')
  })

  it('has no leftover French UI copy identical to fr.json outside shared terms', async () => {
    const fr = (await import('./translations/fr.json')).default
    const en = (await getMessages(Locale.EN)).messages

    const walk = (obj: unknown, path: string[] = [], out: { path: string; value: string }[] = []) => {
      if (typeof obj === 'string') {
        out.push({ path: path.join('.'), value: obj })
        return out
      }
      if (!obj || typeof obj !== 'object') {
        return out
      }
      for (const [key, value] of Object.entries(obj)) {
        walk(value, [...path, key], out)
      }
      return out
    }

    const get = (obj: Record<string, unknown>, path: string) =>
      path.split('.').reduce<unknown>((acc, key) => (acc as Record<string, unknown>)?.[key], obj)

    const frenchMarker =
      /\b(veuillez|sélectionner|renseigner|supprimer|chargement|bonjour|mot de passe|connexion|utilisateur·|êtes-vous|n'est pas|pourrez|pouvez)\b/i

    const leftovers = walk(en).filter(({ path, value }) => {
      if (get(fr, path) !== value) {
        return false
      }
      if (!frenchMarker.test(value)) {
        return false
      }
      // Native language labels and official org/brand names may stay
      if (path.startsWith('locale.') || path.includes('BaseEmpreinte') || path.includes('Legifrance')) {
        return false
      }
      if (value.includes('Association pour la transition Bas Carbone')) {
        return false
      }
      return true
    })

    expect(leftovers).toEqual([])
  })
})
