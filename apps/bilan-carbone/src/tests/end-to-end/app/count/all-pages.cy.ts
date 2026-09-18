import {
  COUNT_GOLDEN_STUDY_ID,
  COUNT_GOLDEN_STUDY_NAME,
} from '../../../fixtures/count/constants'
import {
  CUT_DASHBOARD_PAGES,
  CUT_FORBIDDEN_PAGES,
  CUT_PUBLIC_PAGES,
} from '../../../fixtures/count/cutPages'

describe('Count! public pages', () => {
  before(() => {
    cy.resetTestDatabase()
  })

  CUT_PUBLIC_PAGES.forEach(({ path, testId }) => {
    it(`loads public page ${path}`, () => {
      cy.visit(path)
      cy.getByTestId(testId, { timeout: 15000 }).should('be.visible')
    })
  })
})

describe('Count! dashboard pages', () => {
  before(() => {
    cy.resetTestDatabase()
  })

  beforeEach(() => {
    cy.intercept('POST', '/api/auth/callback/credentials').as('login')
    cy.loginForEnv('cut')
  })

  CUT_DASHBOARD_PAGES.forEach(({ path, testId }) => {
    it(`loads dashboard page ${path}`, () => {
      cy.visit(path)
      cy.getByTestId(testId, { timeout: 20000 }).should('be.visible')
    })
  })

  CUT_FORBIDDEN_PAGES.forEach((path) => {
    it(`does not expose BC-only page ${path}`, () => {
      cy.visit(path, { failOnStatusCode: false })
      cy.getByTestId('not-found-page', { timeout: 15000 }).should('be.visible')
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
})

describe('Count! golden study summary', () => {
  before(() => {
    cy.resetTestDatabase()
  })

  beforeEach(() => {
    cy.intercept('POST', '/api/auth/callback/credentials').as('login')
    cy.loginForEnv('cut')
  })

  it('shows golden study on organizations page', () => {
    cy.visit('/organisations')
    cy.contains(COUNT_GOLDEN_STUDY_NAME, { timeout: 20000 }).should('be.visible')
  })
})
