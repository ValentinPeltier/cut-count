describe('Count! navbar and static pages', () => {
  before(() => {
    cy.resetTestDatabase()
  })

  beforeEach(() => {
    cy.intercept('POST', '/api/auth/callback/credentials').as('login')
  })

  it('opens resources from dashboard navigation', () => {
    cy.loginForEnv('cut')
    cy.visit('/')

    cy.get('a[href="/ressources"]', { timeout: 15000 }).should('be.visible').click()
    cy.url().should('include', '/ressources')
    cy.getByTestId('ressources-sections').should('be.visible')
  })
})
