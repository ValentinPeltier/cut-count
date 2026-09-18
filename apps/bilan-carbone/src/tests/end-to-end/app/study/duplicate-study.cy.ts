describe('Duplicate study', () => {
  before(() => {
    cy.resetTestDatabase()
  })

  it('Should be able to duplicate a study', () => {
    cy.login('all-env-admin-0@yopmail.com', 'password-0')
    cy.url({ timeout: 10000 }).should('eq', `${Cypress.config().baseUrl}/selection-du-compte`)
    cy.contains('li', 'BC+').click()
    cy.url({ timeout: 10000 }).should('eq', `${Cypress.config().baseUrl}/`)

    cy.getByTestId('study')
      .contains('BC V8.10')
      .scrollIntoView()
      .parents('[data-testid="study"]')
      .within(() => {
        cy.getByTestId('study-link').click()
      })

    cy.url().should('include', '/comptabilisation/saisie-des-donnees')
    cy.getByTestId('duplicate-study').click()
    cy.get('#duplicate-study-modal-title').should('be.visible')
    cy.get('#duplicate-study-modal-description').should('be.visible')

    cy.getByTestId('duplication-modale-text').invoke('text').should('contain', 'Vous serez redirigé vers la page')

    cy.getByTestId('environment-selector').should('be.visible').click()
    cy.get('[data-value="BC"]').click()

    cy.getByTestId('duplicate-study-confirm').click()

    cy.get('#duplicate-study-modal-title', { timeout: 15000 }).should('not.exist')
  })
})
