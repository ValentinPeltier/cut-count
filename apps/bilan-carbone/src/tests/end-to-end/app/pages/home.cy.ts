describe('Home page - ', () => {
  describe('Count environment', () => {
    beforeEach(() => {
      cy.login('cut-env-admin-0@yopmail.com')
    })

    it('should display the main title on the home page', () => {
      cy.getByTestId('title')
        .should('have.length', 1)
        .first()
        .should('contain.text', 'Faire votre bilan d’impact vous permettra de :')
    })
  })
})
