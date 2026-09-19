describe('Authentication', () => {
  before(() => {
    cy.resetTestDatabase()
  })

  beforeEach(() => {
    cy.intercept('POST', '/api/auth/callback/credentials').as('login')
    cy.intercept('POST', '/reset-password/*').as('reset-password')
    cy.intercept('GET', '/equipe').as('equipe')
    cy.clearEmails()
  })

  it('does not authenticate with wrong password', () => {
    cy.visit('/')
    cy.url().should('include', '/login')

    cy.login('cut-env-default-1@yopmail.com', 'test1', { cacheSession: false })

    cy.visit('/')
    cy.url().should('include', '/login')
  })

  it('does authenticate with correct password', () => {
    cy.visit('/')
    cy.url().should('include', '/login')

    cy.login('cut-env-default-1@yopmail.com', 'password-1', { cacheSession: false })

    cy.url().should('not.include', '/login')
  })

  it('does reset password', () => {
    cy.visit('/login')

    cy.get('[data-testid="input-email"] > .MuiInputBase-root > .MuiInputBase-input')
      .should('be.visible')
      .should('not.be.disabled')
      .type('cut-env-default-1@yopmail.com')
    cy.getByTestId('reset-password-link').click()

    cy.url().should('include', '/reset-password')

    cy.get('[data-testid="input-email"] > .MuiInputBase-root > .MuiInputBase-input').should(
      'have.value',
      'cut-env-default-1@yopmail.com',
    )

    cy.get('[data-testid="input-email"] > .MuiInputBase-root > .MuiInputBase-input')
      .should('be.visible')
      .should('not.be.disabled')
      .clear()

    cy.get('[data-testid="input-email"] > .MuiInputBase-root > .MuiInputBase-input').type(
      'cut-env-default-0@yopmail.com',
    )

    cy.getByTestId('reset-button').should('be.visible').should('not.be.disabled').click()

    cy.openEmailLink({
      to: 'cut-env-default-0@yopmail.com',
      subject: /Mot de passe oublié/,
    })

    cy.url().should('include', '/reset-password/')
    cy.get('[data-testid="input-password"] > .MuiInputBase-root > .MuiInputBase-input')
      .should('be.visible')
      .should('not.be.disabled')
      .type('new-Password-0')
    cy.get('[data-testid="input-confirm-password"] > .MuiInputBase-root > .MuiInputBase-input')
      .should('be.visible')
      .should('not.be.disabled')
      .type('new-Password-0')

    cy.getByTestId('reset-button').should('be.visible').should('not.be.disabled').click()

    cy.wait('@reset-password')

    cy.url({ timeout: 8000 }).should('include', '/login')

    cy.get('[data-testid="input-email"] > .MuiInputBase-root > .MuiInputBase-input')
      .should('be.visible')
      .should('not.be.disabled')
      .type('cut-env-default-0@yopmail.com')
    cy.get('[data-testid="input-password"] > .MuiInputBase-root > .MuiInputBase-input')
      .should('be.visible')
      .should('not.be.disabled')
      .type('password-0')
    cy.getByTestId('login-button').should('be.visible').should('not.be.disabled').click()

    cy.wait('@login')

    cy.url().should('include', '/login')

    cy.get('[data-testid="input-email"] > .MuiInputBase-root > .MuiInputBase-input')
      .should('be.visible')
      .should('not.be.disabled')
      .should('have.value', 'cut-env-default-0@yopmail.com')

    cy.get('[data-testid="input-password"] > .MuiInputBase-root > .MuiInputBase-input')
      .should('be.visible')
      .should('not.be.disabled')
      .clear()

    cy.get('[data-testid="input-password"] > .MuiInputBase-root > .MuiInputBase-input').type('new-Password-0')

    cy.getByTestId('login-button').should('be.visible').should('not.be.disabled').click()

    cy.wait('@login')

    cy.url().should('not.include', '/login')
  })

  it('does not authorize inactive user', () => {
    cy.visit('/')

    cy.url().should('include', '/login')

    cy.get('[data-testid="input-email"] > .MuiInputBase-root > .MuiInputBase-input')
      .should('be.visible')
      .should('not.be.disabled')
      .type('imported@yopmail.com')
    cy.get('[data-testid="input-password"] > .MuiInputBase-root > .MuiInputBase-input')
      .should('be.visible')
      .should('not.be.disabled')
      .type('password-1')
    cy.getByTestId('login-button').should('be.visible').should('not.be.disabled').click()

    cy.wait('@login')

    cy.visit('/')

    cy.url().should('include', '/login')
  })

  it('does activate account', () => {
    const email = `cut-pending-activate-${Date.now()}@yopmail.com`
    cy.signup(email, '1234567891234')

    cy.getByTestId('activation-form-message', { timeout: 20000 }).should('be.visible')
    cy.getByTestId('activation-form-message', { timeout: 20000 })
      .invoke('text')
      .should('include', "Une demande d'activation de votre compte a été envoyé à vos collègues")

    cy.waitForEmail({
      subject: /Demande d'accès à votre organisation Count/,
    }).its('subject').should('match', /Demande d'accès à votre organisation Count/)

    cy.visit('/')
    cy.login('cut-admin-test@yopmail.com', 'password', { cacheSession: false })
    cy.visit('/equipe')
    cy.getByTestId('invitations-to-validate').should('be.visible')
    cy.getByTestId('invitations-to-validate').within(() => {
      cy.getByTestId('invitation')
        .filter((_index, el) => Cypress.$(el).text().includes(email))
        .getByTestId('validate-invitation')
        .click({ force: true })
    })

    cy.getByTestId('pending-invitation').contains(email).should('be.visible')

    cy.logout()

    cy.url().should('include', '/login')

    cy.openEmailLink({
      to: email,
      subject: /Vous avez été invité sur Count/,
    })

    cy.url().should('include', '/reset-password/')
    cy.get('[data-testid="input-password"] > .MuiInputBase-root > .MuiInputBase-input')
      .should('be.visible')
      .should('not.be.disabled')
      .type('Password-0')
    cy.get('[data-testid="input-confirm-password"] > .MuiInputBase-root > .MuiInputBase-input')
      .should('be.visible')
      .should('not.be.disabled')
      .type('Password-0')

    cy.getByTestId('reset-button').should('be.visible').should('not.be.disabled').click()

    cy.wait('@reset-password')

    cy.url({ timeout: 8000 }).should('include', '/login')

    cy.get('[data-testid="input-email"] > .MuiInputBase-root > .MuiInputBase-input')
      .should('be.visible')
      .should('not.be.disabled')
      .type(email)
    cy.get('[data-testid="input-password"] > .MuiInputBase-root > .MuiInputBase-input')
      .should('be.visible')
      .should('not.be.disabled')
      .type('Password-0')
    cy.getByTestId('login-button').should('be.visible').should('not.be.disabled').click()

    cy.wait('@login')

    cy.url().should('not.include', '/login')
  })
})
