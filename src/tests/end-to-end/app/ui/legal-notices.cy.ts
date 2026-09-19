describe('Legal Notices', () => {
  beforeEach(() => {
    cy.login('cut-env-admin-0@yopmail.com', 'password-0')
  })

  it('Should be accessible from the profile view', () => {
    cy.visit('/profil')
    cy.getByTestId('legal-notices-link').should('be.visible')
    cy.getByTestId('legal-notices-link').click()
    cy.url().should('include', '/mentions-legales')
  })

  it('Should display the body and content of the legal notices', () => {
    cy.visit('/mentions-legales')

    cy.getByTestId('legal-notices').should('be.visible')
    cy.getByTestId('legal-notices').should(
      'contain.text',
      "Conformément aux dispositions des articles 6-III et 19 de la loi pour la Confiance dans l'Économie Numérique",
    )
    cy.getByTestId('legal-notices').should('contain.text', 'Propriétaire du site')
    cy.getByTestId('legal-notices').should('contain.text', 'La marque Bilan Carbone®')
    cy.getByTestId('legal-notices').should('contain.text', 'contact@associationcount.fr')

    cy.getByTestId('profile-link').scrollIntoView()
    cy.getByTestId('profile-link').should('be.visible')
    cy.getByTestId('profile-link').should('have.attr', 'href', '/profil')
    cy.getByTestId('profile-link').should('have.text', 'Retour au profil')
  })
})
