describe('Locale selector', () => {
  it('translates the login page when English is selected', () => {
    cy.clearCookie('NEXT_LOCALE')
    cy.visit('/login')

    cy.get('button[aria-label="English"]').click()

    cy.get('html').should('have.attr', 'lang', 'en')
    cy.contains('Log in').should('be.visible')
    cy.contains('Password').should('be.visible')
    cy.contains('Forgot password?').should('be.visible')
    cy.contains('First login?').should('be.visible')
    cy.contains('Tool developed thanks to the Bilan Carbone® assessments of Cineo').should('be.visible')
    cy.get('body').should('not.contain', 'Se connecter')
    cy.get('body').should('not.contain', 'Mot de passe oublié')
  })

  describe('authenticated', () => {
    beforeEach(() => {
      cy.login()
      cy.clearCookie('NEXT_LOCALE')
    })

    it('switches the profile language from French to English and persists it', () => {
      cy.visit('/profil')

      cy.get('html').should('have.attr', 'lang', 'fr')
      cy.contains('h1', 'Mon profil').should('be.visible')
      cy.getByTestId('locale-selector').should('contain.text', 'Français')

      cy.getByTestId('locale-selector').click()
      cy.get('[data-value="en"]').should('be.visible').click()

      cy.get('html').should('have.attr', 'lang', 'en')
      cy.contains('h1', 'My profile').should('be.visible')
      cy.getByTestId('locale-selector').should('contain.text', 'English')
      cy.getByTestId('legal-notices-link').should('contain.text', 'Legal notices')
      cy.getCookie('NEXT_LOCALE').should('have.property', 'value', 'en')

      cy.reload()
      cy.get('html').should('have.attr', 'lang', 'en')
      cy.contains('h1', 'My profile').should('be.visible')

      cy.getByTestId('locale-selector').click()
      cy.get('[data-value="fr"]').should('be.visible').click()

      cy.get('html').should('have.attr', 'lang', 'fr')
      cy.contains('h1', 'Mon profil').should('be.visible')
      cy.getCookie('NEXT_LOCALE').should('have.property', 'value', 'fr')
    })
  })
})
