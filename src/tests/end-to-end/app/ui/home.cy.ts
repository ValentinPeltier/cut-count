describe('Home page - ', () => {
  describe('Count environment', () => {
    beforeEach(() => {
      cy.login('admin-0@yopmail.com')
      cy.visit('/')
    })

    it('should display the main title on the home page', () => {
      cy.getByTestId('title')
        .should('have.length', 1)
        .first()
        .should('contain.text', 'Calculer votre empreinte carbone simplifiée vous permettra de :')
    })
  })
})
