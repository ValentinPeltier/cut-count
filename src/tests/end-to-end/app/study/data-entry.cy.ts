import { expect } from 'chai'

import { COUNT_GOLDEN_STUDY_ID } from '../../../fixtures/count/constants'

describe('Count! data entry', () => {
  before(() => {
    cy.resetTestDatabase()
  })

  beforeEach(() => {
    cy.intercept('POST', '/api/auth/callback/credentials').as('login')
  })

  it('lists accounting posts for the golden study', () => {
    cy.login()
    cy.visit(`/etudes/${COUNT_GOLDEN_STUDY_ID}/comptabilisation/saisie-des-donnees`)

    cy.url({ timeout: 20000 }).should('include', 'saisie-des-donnees')
    cy.contains('Fonctionnement', { timeout: 20000 }).should('exist')
    cy.contains('Mobilité spectateurs').should('exist')
  })

  it('opens fonctionnement post form', () => {
    cy.login()
    cy.visit(`/etudes/${COUNT_GOLDEN_STUDY_ID}/comptabilisation/saisie-des-donnees`)

    cy.contains('a', 'Fonctionnement', { timeout: 20000 }).click()
    cy.url({ timeout: 20000 }).should('match', /saisie-des-donnees\/fonctionnement/i)
  })

  it('persists Publicodes answers after reload', () => {
    cy.login()
    cy.visit(`/etudes/${COUNT_GOLDEN_STUDY_ID}/comptabilisation/saisie-des-donnees/Fonctionnement?subPost=Energie`)

    cy.getByTestId('publicodes-save-status', { timeout: 20000 }).should('exist')
    cy.contains('button, [role="tab"]', 'Énergie', { timeout: 20000 }).should('exist')

    const gasField = 'fonctionnement . énergie . gaz . consommation'
    const gasValue = '4321'

    cy.getByTestId(`publicodes-field-${gasField}`, { timeout: 20000 })
      .should('exist')
      .find('input.MuiInputBase-input')
      .first()
      .clear()
      .type(gasValue)
      .blur()

    cy.getByTestId('publicodes-save-status', { timeout: 20000 }).should('have.attr', 'data-status', 'saved')

    cy.reload()

    cy.getByTestId(`publicodes-field-${gasField}`, { timeout: 20000 })
      .should('exist')
      .find('input.MuiInputBase-input')
      .first()
      .invoke('val')
      .then((value) => {
        expect(String(value).replace(/[^\d]/g, '')).to.eq(gasValue)
      })
  })
})
