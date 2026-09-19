import { COUNT_GOLDEN_STUDY_ID } from '../../../fixtures/count/constants'

describe('Count! data entry', () => {
  before(() => {
    cy.resetTestDatabase()
  })

  beforeEach(() => {
    cy.intercept('POST', '/api/auth/callback/credentials').as('login')
  })

  it('lists accounting posts for the golden study', () => {
    cy.loginForEnv('cut')
    cy.visit(`/etudes/${COUNT_GOLDEN_STUDY_ID}/comptabilisation/saisie-des-donnees`)

    cy.url({ timeout: 20000 }).should('include', 'saisie-des-donnees')
    cy.contains('Fonctionnement', { timeout: 20000 }).should('be.visible')
    cy.contains('Mobilité spectateurs').should('be.visible')
  })

  it('opens fonctionnement post form', () => {
    cy.loginForEnv('cut')
    cy.visit(`/etudes/${COUNT_GOLDEN_STUDY_ID}/comptabilisation/saisie-des-donnees`)

    cy.contains('a', 'Fonctionnement', { timeout: 20000 }).click()
    cy.url({ timeout: 20000 }).should('match', /saisie-des-donnees\/fonctionnement/i)
  })

  it('persists Publicodes answers after reload', () => {
    cy.loginForEnv('cut')
    cy.visit(
      `/etudes/${COUNT_GOLDEN_STUDY_ID}/comptabilisation/saisie-des-donnees/Fonctionnement?subPost=Energie`,
    )

    cy.getByTestId('publicodes-save-status', { timeout: 20000 }).should('exist')
    cy.contains('button, [role="tab"]', 'Énergie', { timeout: 20000 }).should('be.visible')

    // Prefer a mid-page field so the sticky header does not cover it.
    const gasField = 'fonctionnement . énergie . gaz . consommation'
    const gasValue = '4321'

    cy.getByTestId(`publicodes-field-${gasField}`, { timeout: 20000 })
      .scrollIntoView()
      .should('be.visible')
      .within(() => {
        cy.get('input').filter(':visible').first().clear({ force: true }).type(gasValue, { force: true }).blur()
      })

    cy.getByTestId('publicodes-save-status', { timeout: 20000 }).should('have.attr', 'data-status', 'saved')

    cy.reload()

    cy.getByTestId(`publicodes-field-${gasField}`, { timeout: 20000 })
      .scrollIntoView()
      .should('be.visible')
      .within(() => {
        cy.get('input')
          .filter(':visible')
          .first()
          .invoke('val')
          .then((value) => {
            expect(String(value).replace(/[^\d]/g, '')).to.eq(gasValue)
          })
      })
  })
})
