import { COUNT_GOLDEN_STUDY_ID } from '../../../fixtures/count/constants'
import {
  CUT_FORBIDDEN_STUDY_SUFFIXES,
  CUT_GOLDEN_STUDY_PATHS,
  CUT_STUDY_POST_SLUGS,
} from '../../../fixtures/count/cutPages'

describe('Count! golden study — all study pages', () => {
  before(() => {
    cy.resetTestDatabase()
  })

  beforeEach(() => {
    cy.loginForEnv('cut')
  })

  CUT_GOLDEN_STUDY_PATHS.forEach((suffix) => {
    it(`loads /etudes/:id/${suffix}`, () => {
      cy.visit(`/etudes/${COUNT_GOLDEN_STUDY_ID}/${suffix}`)
      cy.url({ timeout: 20000 }).should('include', suffix.split('/').pop())
      cy.getByTestId('not-found-page').should('not.exist')
    })
  })

  CUT_STUDY_POST_SLUGS.forEach((postSlug) => {
    it(`loads data entry for post ${postSlug}`, () => {
      cy.visit(`/etudes/${COUNT_GOLDEN_STUDY_ID}/comptabilisation/saisie-des-donnees/${postSlug}`)
      cy.url({ timeout: 20000 }).should('include', postSlug)
      cy.getByTestId('not-found-page').should('not.exist')
    })
  })

  it('shows consolidated results table on results page', () => {
    cy.visit(`/etudes/${COUNT_GOLDEN_STUDY_ID}/comptabilisation/resultats`)
    cy.getByTestId('consolidated-results-table-row', { timeout: 20000 }).should('have.length.at.least', 2)
  })
})
