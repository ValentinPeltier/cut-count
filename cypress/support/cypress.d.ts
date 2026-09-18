import '../../src/types/cypress-commands'

declare global {
  namespace Cypress {
    interface Chainable {
      loginForEnv(env: 'cut', email?: string, password?: string): Chainable<void>
      signupCut(email?: string, cncOrSiret?: string): Chainable<void>
      waitForStable(): Chainable<void>
    }
  }
}
