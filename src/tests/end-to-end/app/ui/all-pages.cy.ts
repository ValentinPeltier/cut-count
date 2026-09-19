import { COUNT_GOLDEN_STUDY_NAME } from '../../../fixtures/count/constants'
import { CUT_DASHBOARD_PAGES, CUT_PUBLIC_PAGES } from '../../../fixtures/count/cutPages'

describe('Count! pages', () => {
  // One reset for the whole file — concurrent seeds against count_test race on users.email.
  before(() => {
    cy.resetTestDatabase()
  })

  describe('public pages', () => {
    CUT_PUBLIC_PAGES.forEach(({ path, testId }) => {
      it(`loads public page ${path}`, () => {
        cy.visit(path)
        cy.getByTestId(testId, { timeout: 15000 }).should('be.visible')
      })
    })
  })

  describe('authenticated pages', () => {
    // loginForEnv uses cy.session — first test logs in, the rest restore cookies for the same user.
    beforeEach(() => {
      cy.login()
    })

    CUT_DASHBOARD_PAGES.forEach(({ path, testId }) => {
      it(`loads dashboard page ${path}`, () => {
        cy.visit(path)
        cy.getByTestId(testId, { timeout: 20000 }).should('be.visible')
      })
    })

    it('loads organization edit page for CUT admin', () => {
      cy.visit('/organisations')
      cy.getByTestId('organization-page').should('be.visible')
      cy.get('a[href*="/modifier"]', { timeout: 15000 }).first().click()
      cy.url().should('include', '/modifier')
    })

    it('loads team invite page', () => {
      cy.visit('/equipe/ajouter')
      cy.url().should('include', '/equipe/ajouter')
      cy.get('main').should('exist')
    })

    it('shows golden study on organizations page', () => {
      cy.visit('/organisations')
      cy.contains(COUNT_GOLDEN_STUDY_NAME, { timeout: 20000 }).should('be.visible')
    })
  })
})
