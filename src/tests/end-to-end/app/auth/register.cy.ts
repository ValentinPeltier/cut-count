import { expect } from 'chai'

const uniqueEmail = (prefix: string) => `${prefix}-${Date.now()}-${Cypress._.random(1e5)}@yopmail.com`

describe('Register', () => {
  before(() => {
    cy.resetTestDatabase()
  })

  beforeEach(() => {
    cy.intercept('POST', '/reset-password/*').as('reset-password')
    cy.clearEmails()
  })

  it('does create new user and organization with CNC', () => {
    const email = uniqueEmail('cnc')
    cy.signup(email, '5678')

    cy.getByTestId('activation-form-message').should('exist')
    cy.getByTestId('activation-form-message')
      .invoke('text')
      .should('include', "Vous allez recevoir un mail pour finaliser l'activation de votre compte.")

    cy.waitForEmail({
      to: email,
      subject: /Vous avez activé votre compte sur Count/,
    })
      .its('subject')
      .should('match', /Vous avez activé votre compte sur Count/)
  })

  it('does create new user and organization with SIRET', () => {
    const email = uniqueEmail('siret')
    cy.signup(email, '50016424900012')

    cy.getByTestId('activation-form-message').should('exist')
    cy.getByTestId('activation-form-message')
      .invoke('text')
      .should('include', "Vous allez recevoir un mail pour finaliser l'activation de votre compte.")

    cy.waitForEmail({
      to: email,
      subject: /Vous avez activé votre compte sur Count/,
    })
      .its('subject')
      .should('match', /Vous avez activé votre compte sur Count/)
  })

  it('does create new user without CNC or SIRET', () => {
    const email = uniqueEmail('no-siret-cnc')
    cy.signup(email, null)

    cy.getByTestId('activation-form-message').should('exist')
    cy.getByTestId('activation-form-message')
      .invoke('text')
      .should('include', "Vous allez recevoir un mail pour finaliser l'activation de votre compte.")

    cy.waitForEmail({
      to: email,
      subject: /Vous avez activé votre compte sur Count/,
    })
      .its('subject')
      .should('match', /Vous avez activé votre compte sur Count/)
  })

  it('does not create new user and organization when user already in environment', () => {
    const email = uniqueEmail('existing')
    cy.signup(email, '5699')
    cy.getByTestId('activation-form-message')
      .invoke('text')
      .should('include', "Vous allez recevoir un mail pour finaliser l'activation de votre compte.")

    cy.signup(email, '5699')
    cy.getByTestId('activation-form-message').should('exist')
    cy.getByTestId('activation-form-message')
      .invoke('text')
      .should('include', 'Cet email est déjà inscrit avec un compte CUT')
  })

  it('does not create new user with wrong CNC', () => {
    cy.signup(uniqueEmail('wrong-cnc'), '0')

    cy.getByTestId('activation-form-message').should('exist')
    cy.getByTestId('activation-form-message')
      .invoke('text')
      .should('include', "Ce numéro CNC ou SIRET n'est pas reconnu")
  })

  it('does create new user and ask for validation to already existing organization', () => {
    const email = uniqueEmail('pending')
    cy.signup(email, '1234567891234')

    cy.getByTestId('activation-form-message').should('exist')
    cy.getByTestId('activation-form-message')
      .invoke('text')
      .should('include', "Une demande d'activation de votre compte a été envoyé à vos collègues")

    cy.waitForEmail({
      subject: /Demande d'accès à votre organisation Count/,
    })
      .its('subject')
      .should('match', /Demande d'accès à votre organisation Count/)
  })

  it('allows a logged-in user without organization to register with CNC and join the organization', () => {
    const email = 'no-organization@yopmail.com'
    const password = 'no-organization'
    const passwordAfterActivation = 'Password-0'
    const colleagueStudyName = 'Étude collègue e2e'

    cy.intercept('POST', '/api/auth/callback/credentials').as('login')
    cy.intercept('POST', '/api/auth/signout').as('logout')
    cy.login(email, password)

    cy.visit('/register')
    cy.url().should('include', '/register')

    cy.getByTestId('activation-email').find('input').should('have.value', email)
    cy.getByTestId('activation-siretOrCNC').find('input').clear().type('1321')
    cy.getByTestId('activation-form-message').should('not.exist')
    cy.getByTestId('activation-button').click({ force: true })
    cy.wait('@signup')

    cy.getByTestId('activation-form-message').should('exist')
    cy.getByTestId('activation-form-message')
      .invoke('text')
      .should('include', "Une demande d'activation de votre compte a été envoyé à vos collègues")

    cy.visit('/')
    cy.getByTestId('home-no-organization-message').should('exist')

    cy.visit('/organisations')
    cy.getByTestId('organization-onboarding').should('exist')
    cy.getByTestId('organization-page').should('not.exist')
    cy.contains(colleagueStudyName).should('not.exist')

    cy.request('/api/auth/session').then((response) => {
      expect(response.body?.user?.organizationVersionId ?? null).to.equal(null)
    })

    cy.logout()
    cy.visit('/login')
    cy.get('[data-testid="input-email"] > .MuiInputBase-root > .MuiInputBase-input').clear().type(email)
    cy.get('[data-testid="input-password"] > .MuiInputBase-root > .MuiInputBase-input').clear().type(password)
    cy.getByTestId('login-button').click()
    cy.wait('@login')
    cy.url().should('include', '/login')

    cy.login('admin-0@yopmail.com', 'admin-0')
    cy.visit('/equipe')
    cy.url({ timeout: 15000 }).should('include', '/equipe')
    cy.getByTestId('team-page', { timeout: 15000 }).should('exist')
    cy.getByTestId('invitations-to-validate', { timeout: 15000 })
      .should('exist')
      .within(() => {
        cy.getByTestId('invitation')
          .filter((_index, el) => Cypress.$(el).text().includes(email))
          .getByTestId('validate-invitation')
          .click()
      })

    cy.logout()

    cy.openEmailLink({
      to: email,
      subject: /Vous avez été invité sur Count/,
    })

    cy.url().should('include', '/reset-password/')
    cy.get('[data-testid="input-password"] > .MuiInputBase-root > .MuiInputBase-input')
      .should('exist')
      .should('not.be.disabled')
      .type(passwordAfterActivation)
    cy.get('[data-testid="input-confirm-password"] > .MuiInputBase-root > .MuiInputBase-input')
      .should('exist')
      .should('not.be.disabled')
      .type(passwordAfterActivation)
    cy.getByTestId('reset-button').should('exist').should('not.be.disabled').click()
    cy.wait('@reset-password').its('response.statusCode').should('eq', 200)
    cy.url({ timeout: 8000 }).should('include', '/login')

    Cypress.session.clearAllSavedSessions()
    cy.visit('/login')
    cy.get('[data-testid="input-email"] > .MuiInputBase-root > .MuiInputBase-input').type(email)
    cy.get('[data-testid="input-password"] > .MuiInputBase-root > .MuiInputBase-input').type(passwordAfterActivation)
    cy.getByTestId('login-button').click()
    cy.wait('@login')
    cy.url({ timeout: 15000 }).should('not.include', '/login')

    cy.visit('/equipe')
    cy.contains('[data-testid="team-table-row"]', 'admin-0@yopmail.com').should('exist')
    cy.contains('[data-testid="team-table-row"]', 'default-0@yopmail.com').should('exist')

    cy.visit('/organisations')
    cy.getByTestId('organization-page', { timeout: 15000 }).should('exist')
    cy.getByTestId('organization-onboarding').should('not.exist')
    cy.contains(colleagueStudyName, { timeout: 15000 }).should('exist')

    cy.visit('/')
    cy.getByTestId('home-no-organization-message').should('not.exist')
  })
})
