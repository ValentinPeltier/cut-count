import dayjs from 'dayjs'

const newCutStudy = (studyName: string) => {
  cy.intercept('POST', '**/etudes/creer**').as('create')
  cy.intercept('GET', '**/etudes/creer**').as('creationPageLoad')
  cy.visit('/organisations')
  cy.getByTestId('new-study', { timeout: 15000 }).should('be.visible').click()
  cy.url({ timeout: 15000 }).should('include', 'creer')
  cy.wait('@creationPageLoad', { timeout: 15000 })

  cy.getByTestId('new-study-organization-title', { timeout: 10000 }).should('be.visible')
  cy.getByTestId('organization-sites-checkbox', { timeout: 10000 }).first().click()
  cy.getByTestId('new-study-organization-button').click()

  cy.getByTestId('new-study-name', { timeout: 10000 }).should('be.visible')
  cy.getByTestId('new-study-name').type(studyName)
  cy.getByTestId('new-study-endDate').within(() => {
    cy.get('span').first().type(dayjs().add(1, 'y').format('DD/MM/YYYY'))
  })
  cy.getByTestId('new-study-create-button').click()

  cy.wait('@create', { timeout: 15000 }).its('response.statusCode').should('eq', 200)
  cy.url({ timeout: 15000 }).should('include', '/etudes/')
  cy.contains(studyName, { timeout: 15000 }).should('be.visible')
}

describe('Count! create simplified study', () => {
  before(() => {
    cy.resetTestDatabase()
  })

  beforeEach(() => {
    cy.intercept('POST', '/api/auth/callback/credentials').as('login')
  })

  it('creates a study as CUT admin', () => {
    cy.loginForEnv('cut', 'cut-env-admin-0@yopmail.com', 'password-0')
    newCutStudy('CUT e2e study')
  })
})
