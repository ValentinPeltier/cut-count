import { getOrCreateEngine } from '@/lib/publicodes/singletons'
import rules from '@/publicodes/rules/publicodes-build/publicodes-count.model.json'
import Engine from 'publicodes'
import { CutPublicodesEngine } from './types'

/**
 * Returns a singleton instance of the Publicodes {@link Engine} configured
 * with CUT specific rules.
 */
export function getCutEngine(): CutPublicodesEngine {
  return getOrCreateEngine('CUT', () => {
    return new Engine(rules, {
      flag: {
        // option required by @publicodes/forms.
        filterNotApplicablePossibilities: true,
      },
      strict: {
        // NOTE: for now, we disable strict mode to allow setting situations
        // that not fit the current model. Howerver, if the model changes,
        // migration for situations should be implemented.
        situation: false,
      },
    })
  })
}
