const STUDY_TO_DELETE_ID = '88c93e88-7c80-4be4-905b-f0bbd2ccc840'

describe('Delete study', () => {
  beforeEach(() => {
    cy.resetTestDatabase()
  })

  it('should be able to delete a study', () => {
    cy.login('admin-0@yopmail.com', 'password-0')

    cy.visit('/organisations')
    cy.getByTestId('organization-page', { timeout: 15000 }).should('be.visible')
    cy.contains('Study to delete', { timeout: 15000 }).scrollIntoView().should('exist')

    cy.visit(`/etudes/${STUDY_TO_DELETE_ID}/comptabilisation/saisie-des-donnees`)
    cy.getByTestId('delete-study', { timeout: 15000 }).click()
    cy.get('#delete-study-modal-title').should('be.visible')
    cy.get('#delete-study-modal-content').should('be.visible')

    cy.getByTestId('delete-study-name-field').type('Study to delet')
    cy.getByTestId('alert-toaster').should('not.exist')
    cy.getByTestId('confirm-study-deletion').click()
    cy.getByTestId('alert-toaster').should('be.visible')
    cy.getByTestId('alert-toaster').should('contain.text', "Le nom de l'étude ne correspond pas")

    cy.getByTestId('delete-study-name-field').type('e')

    cy.url().then((savedUrl) => {
      cy.getByTestId('confirm-study-deletion').click()
      cy.getByTestId('alert-toaster').should('not.exist')

      cy.url().should('eq', `${Cypress.config().baseUrl}/`)

      cy.visit(savedUrl)
      cy.getByTestId('not-found-page').should('be.visible')
    })
  })
})
