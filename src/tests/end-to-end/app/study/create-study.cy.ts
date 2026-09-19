import { expect } from 'chai'
import dayjs from 'dayjs'

const STUDY_NAME = 'CUT e2e study'
const END_DATE = dayjs().add(1, 'y')
const END_DATE_LABEL = END_DATE.format('DD/MM/YYYY')
const TICKETS = '12345'

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
    cy.get('span').first().type(END_DATE_LABEL)
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

  it('creates a study as CUT admin and persists name after revisit', () => {
    cy.loginForEnv('cut', 'admin-0@yopmail.com', 'password-0')
    newCutStudy(STUDY_NAME)

    cy.url().then((url) => {
      const studyId = url.match(/\/etudes\/([^/?#]+)/)?.[1]
      expect(studyId, 'study id in URL').to.be.a('string')

      cy.visit('/organisations')
      cy.contains(STUDY_NAME, { timeout: 20000 }).scrollIntoView().should('exist')

      cy.visit(`/etudes/${studyId}/cadrage`)
      cy.intercept({ method: 'POST', url: '**/etudes/**/cadrage**' }).as('updateCinema')
      cy.getByTestId('new-study-number-of-tickets', { timeout: 20000 }).should('be.visible')
      cy.getByTestId('new-study-number-of-tickets').find('input').clear().type(TICKETS).blur()
      cy.wait('@updateCinema', { timeout: 15000 })

      cy.reload()

      cy.getByTestId('new-study-number-of-tickets', { timeout: 20000 }).find('input').should('have.value', TICKETS)
    })
  })
})
