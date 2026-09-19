describe('Count! resources page', () => {
  before(() => {
    cy.resetTestDatabase()
  })

  beforeEach(() => {
    cy.loginForEnv('cut')
  })

  it('opens resources from dashboard navigation', () => {
    cy.visit('/')

    cy.get('a[href="/ressources"]', { timeout: 15000 }).should('be.visible').click()
    cy.url().should('include', '/ressources')
    cy.getByTestId('ressources-sections').should('be.visible')
  })

  it('displays CUT method downloads and external links on /ressources', () => {
    cy.visit('/ressources')

    cy.getByTestId('ressources-sections', { timeout: 20000 }).should('be.visible')
    cy.getByTestId('ressources-cut-description').should('be.visible')
    cy.getByTestId('ressources-cut-france2030').scrollIntoView().should('be.visible')

    cy.getByTestId('ressource-links-card').should('have.length.at.least', 2)
    cy.getByTestId('ressource-download-button').should('have.length.at.least', 2)
    cy.getByTestId('ressource-download-button').first().should('have.attr', 'data-download-key', 'count')

    cy.getByTestId('ressource-external-link').should('have.length.at.least', 1)
    cy.getByTestId('ressource-external-link')
      .first()
      .should('have.attr', 'href')
      .and('match', /^https?:/)
  })
})
