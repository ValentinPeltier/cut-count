import './commands'

beforeEach(() => {
  cy.intercept('POST', '/api/auth/callback/credentials').as('login')
  cy.intercept('POST', '/api/auth/signout').as('logout')
  cy.intercept('POST', '/register').as('signup')
})

Cypress.on('uncaught:exception', () => {
  return false
})
