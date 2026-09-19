import { Role } from '@/generated/prisma/enums'

describe('Team', () => {
  before(() => {
    cy.resetTestDatabase()
  })

  beforeEach(() => {
    cy.intercept('POST', '/api/auth/callback/credentials').as('login')
    cy.intercept('POST', '/api/auth/signout').as('logout')
    cy.intercept('POST', '/equipe/ajouter').as('new-member')
  })

  it('admins can edit team member role', () => {
    cy.login('admin-1@yopmail.com', 'password-1')
    cy.visit('/equipe')
    cy.getByTestId('team-table-row')
      .eq(0)
      .within(() => {
        cy.get('input').should('exist')
      })
  })

  it('defaults cannot edit team member role', () => {
    cy.login('default-1@yopmail.com', 'password-1')
    cy.visit('/equipe')
    cy.getByTestId('team-table-row')
      .eq(0)
      .within(() => {
        cy.get('input').should('not.exist')
      })
  })

  it('should change a member role', () => {
    cy.login('admin-1@yopmail.com', 'password-1')
    cy.visit('/equipe')

    cy.contains('[data-testid="team-table-row"]', 'admin-1@yopmail.com').within(() => {
      cy.get('input').should('have.value', Role.ADMIN)
      cy.get('input').should('not.be.disabled')
    })

    cy.contains('[data-testid="team-table-row"]', 'default-1@yopmail.com').within(() => {
      cy.get('input').should('have.value', Role.DEFAULT)
      cy.get('input').should('not.be.disabled')
    })

    cy.contains('[data-testid="team-table-row"]', 'default-1@yopmail.com').within(() => {
      cy.get('input').should('have.value', Role.DEFAULT)
      cy.get('.MuiSelect-select').click()
    })
    cy.get('[data-value="ADMIN"]').click()
    cy.getByTestId('alert-toaster').should('be.visible')

    cy.reload()

    cy.contains('[data-testid="team-table-row"]', 'default-1@yopmail.com').within(() => {
      cy.get('input').should('have.value', Role.ADMIN)
    })
  })

  it('should add a new member', () => {
    cy.clearEmails()
    cy.intercept('POST', '/reset-password/*').as('reset-password')
    cy.login('admin-1@yopmail.com', 'password-1')
    cy.visit('/equipe')

    cy.getByTestId('pending-invitation').should('not.exist')
    cy.getByTestId('add-member-link').click()

    cy.getByTestId('new-member-firstName').type('User')
    cy.getByTestId('new-member-lastName').type('Test')
    cy.getByTestId('new-member-email').type('user-test-1@test.fr')
    cy.getByTestId('new-member-role').click()
    cy.get('[data-value="DEFAULT"]').click()

    cy.getByTestId('new-member-create-button').click()
    cy.wait('@new-member')

    cy.url().should('eq', `${Cypress.config().baseUrl}/equipe`)
    cy.getByTestId('pending-invitation').contains('user-test-1@test.fr').should('exist')

    cy.reload()
    cy.getByTestId('pending-invitation').contains('user-test-1@test.fr').should('exist')

    cy.logout()
    cy.url().should('include', '/login')

    cy.openEmailLink({
      to: 'user-test-1@test.fr',
      subject: /Vous avez été invité sur Count/,
    })

    cy.url().should('include', '/reset-password/')
    cy.get('[data-testid="input-password"] > .MuiInputBase-root > .MuiInputBase-input')
      .should('be.visible')
      .type('Password-1')
    cy.get('[data-testid="input-confirm-password"] > .MuiInputBase-root > .MuiInputBase-input')
      .should('be.visible')
      .type('Password-1')

    cy.getByTestId('reset-button').click()
    cy.wait('@reset-password')

    cy.url({ timeout: 8000 }).should('include', '/login')

    cy.get('[data-testid="input-email"] > .MuiInputBase-root > .MuiInputBase-input')
      .should('be.visible')
      .type('user-test-1@test.fr')
    cy.get('[data-testid="input-password"] > .MuiInputBase-root > .MuiInputBase-input')
      .should('be.visible')
      .type('Password-1')
    cy.getByTestId('login-button').click()

    cy.wait('@login')
    cy.url().should('not.include', '/login')
  })
})
