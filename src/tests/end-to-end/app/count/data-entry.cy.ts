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
})
