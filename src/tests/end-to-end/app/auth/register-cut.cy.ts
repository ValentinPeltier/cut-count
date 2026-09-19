const uniqueEmail = (prefix: string) => `${prefix}-${Date.now()}-${Cypress._.random(1e5)}@yopmail.com`

describe('Register cut', () => {
  before(() => {
    cy.resetTestDatabase()
  })

  beforeEach(() => {
    cy.clearEmails()
  })

  it('does create new cut user and organization with CNC', () => {
    const email = uniqueEmail('cut-cnc')
    cy.signup(email, '1321')

    cy.getByTestId('activation-form-message').should('be.visible')
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

  it('does create new cut user and organization with SIRET', () => {
    const email = uniqueEmail('cut-siret')
    cy.signup(email, '55204944776279')

    cy.getByTestId('activation-form-message').should('be.visible')
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
    const email = uniqueEmail('cut-existing')
    cy.signup(email, '1321')
    cy.getByTestId('activation-form-message')
      .invoke('text')
      .should('include', "Vous allez recevoir un mail pour finaliser l'activation de votre compte.")

    cy.signup(email, '1321')
    cy.getByTestId('activation-form-message').should('be.visible')
    cy.getByTestId('activation-form-message')
      .invoke('text')
      .should('include', 'Cet email est déjà inscrit avec un compte CUT')
  })

  it('does not create new cut user with wrong CNC', () => {
    cy.signup(uniqueEmail('cut-wrong-cnc'), '0')

    cy.getByTestId('activation-form-message').should('be.visible')
    cy.getByTestId('activation-form-message').invoke('text').should('include', "Ce Siret ou code CNC n'est pas reconnu")
  })

  it('does create new cut user and ask for validation to already existing organization', () => {
    const email = uniqueEmail('cut-pending')
    cy.signup(email, '1234567891234')

    cy.getByTestId('activation-form-message').should('be.visible')
    cy.getByTestId('activation-form-message')
      .invoke('text')
      .should('include', "Une demande d'activation de votre compte a été envoyé à vos collègues")

    cy.waitForEmail({
      subject: /Demande d'accès à votre organisation Count/,
    })
      .its('subject')
      .should('match', /Demande d'accès à votre organisation Count/)
  })
})
