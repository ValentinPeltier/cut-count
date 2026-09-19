// The organization edit page is reached from the navbar "information" link.
const openOrganizationEdit = () => {
  cy.visit('/organisations')
  cy.get('a[href*="/modifier"]', { timeout: 15000 }).first().click()
  cy.url().should('include', '/modifier')
}

describe('Edit organization', () => {
  before(() => {
    cy.resetTestDatabase()
  })

  beforeEach(() => {
    cy.intercept('POST', '/organisations/*/modifier').as('update')
  })

  it('should edit an organization', () => {
    cy.login('admin-0@yopmail.com', 'password-0')

    openOrganizationEdit()

    cy.getByTestId('edit-site-name')
      .last()
      .within(() => {
        cy.get('input').clear()
        cy.get('input').type('My new site 0')
      })

    cy.getByTestId('organization-sites-postal-code')
      .last()
      .within(() => {
        cy.get('input').clear()
        cy.get('input').type('75002')
      })

    cy.getByTestId('organization-sites-city')
      .last()
      .within(() => {
        cy.get('input').clear()
        cy.get('input').type('Paris')
      })

    cy.getByTestId('edit-organization-button').click()
    cy.wait('@update')

    openOrganizationEdit()

    cy.getByTestId('edit-site-name')
      .last()
      .within(() => {
        cy.get('input').should('have.value', 'My new site 0')
        cy.get('input').clear()
        cy.get('input').type('My new site')
      })

    cy.getByTestId('organization-sites-postal-code')
      .last()
      .within(() => {
        cy.get('input').should('have.value', '75002')
        cy.get('input').clear()
        cy.get('input').type('75001')
      })

    cy.getByTestId('organization-sites-city')
      .last()
      .within(() => {
        cy.get('input').should('have.value', 'Paris')
        cy.get('input').clear()
        cy.get('input').type('Paris 1er')
      })

    cy.getByTestId('edit-organization-button').click()
    cy.wait('@update')

    openOrganizationEdit()

    cy.getByTestId('edit-site-name')
      .last()
      .within(() => {
        cy.get('input').should('have.value', 'My new site')
      })

    cy.getByTestId('organization-sites-postal-code')
      .last()
      .within(() => {
        cy.get('input').should('have.value', '75001')
      })

    cy.getByTestId('organization-sites-city')
      .last()
      .within(() => {
        cy.get('input').should('have.value', 'Paris 1er')
      })
  })
})
