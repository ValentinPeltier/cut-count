describe('Count! resources page', () => {
  before(() => {
    cy.resetTestDatabase()
  })

  beforeEach(() => {
    cy.intercept('POST', '/api/auth/callback/credentials').as('login')
  })

  it('displays CUT method downloads and external links on /ressources', () => {
    cy.loginForEnv('cut')
    cy.visit('/ressources')

    cy.getByTestId('ressources-sections', { timeout: 20000 }).should('be.visible')
    cy.getByTestId('ressources-cut-description').should('be.visible')
    cy.getByTestId('ressources-cut-france2030').should('be.visible')

    cy.getByTestId('ressource-links-card').should('have.length.at.least', 2)
    cy.getByTestId('ressource-download-button').should('have.length.at.least', 2)
    cy.getByTestId('ressource-download-button').first().should('have.attr', 'data-download-key', 'SCW_CUT_METHOD_KEY')

    cy.getByTestId('ressource-external-link').should('have.length.at.least', 1)
    cy.getByTestId('ressource-external-link').first().should('have.attr', 'href').and('match', /^https?:/)
  })
})
