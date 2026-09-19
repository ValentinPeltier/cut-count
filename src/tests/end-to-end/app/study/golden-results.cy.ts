import { COUNT_GOLDEN_STUDY_ID, COUNT_GOLDEN_STUDY_NAME } from '../../../fixtures/count/constants'

/** Study uses StudyResultUnit.T — values are kgCO2e / 1000, rounded like formatEmissionFromNumber. */
const EXPECTED_TOTAL_T = 25
const EXPECTED_FONCTIONNEMENT_T = 25
const EXPECTED_MOBILITE_T = 0

describe('Count! golden study results', () => {
  before(() => {
    cy.resetTestDatabase()
  })

  beforeEach(() => {
    cy.intercept('POST', '/api/auth/callback/credentials').as('login')
  })

  it('displays Publicodes post totals matching the seeded fixture', () => {
    cy.login()
    cy.visit(`/etudes/${COUNT_GOLDEN_STUDY_ID}/comptabilisation/resultats`)

    cy.contains(COUNT_GOLDEN_STUDY_NAME, { timeout: 20000 }).should('be.visible')

    cy.getByTestId('consolidated-results-table-row', { timeout: 20000 }).should('have.length.at.least', 2)

    cy.getByTestId('consolidated-results-table-row').contains('td', String(EXPECTED_FONCTIONNEMENT_T)).should('exist')
    cy.getByTestId('consolidated-results-table-row').contains('td', String(EXPECTED_MOBILITE_T)).should('exist')
    cy.getByTestId('consolidated-results-table-row').contains('td', String(EXPECTED_TOTAL_T)).should('exist')
  })
})
