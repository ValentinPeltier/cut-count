import { expect } from 'chai'

describe('Admin panel', () => {
  before(() => {
    cy.resetTestDatabase()
  })

  describe('organization admin', () => {
    beforeEach(() => {
      cy.login('admin-0@yopmail.com', 'admin-0', { cacheSession: false })
    })

    it('does not show the admin panel link in the navbar', () => {
      cy.visit('/')

      cy.getByTestId('admin-panel-link').should('not.exist')
    })

    it('does not allow access to the admin panel page', () => {
      cy.visit('/administration')

      cy.url({ timeout: 15000 }).should('not.include', '/administration')
      cy.getByTestId('admin-panel-page').should('not.exist')
    })
  })

  describe('super admin', () => {
    beforeEach(() => {
      cy.login('super-admin-0@yopmail.com', 'super-admin-0', { cacheSession: false })
    })

    it('shows the admin panel link in the navbar', () => {
      cy.visit('/')

      cy.getByTestId('admin-panel-link', { timeout: 15000 }).should('exist').click()
      cy.url().should('include', '/administration')
      cy.getByTestId('admin-panel-page').should('exist')
      cy.contains('h1', "Panneau d'administration").should('exist')
    })

    it('allows direct access to the admin panel page', () => {
      cy.visit('/administration')

      cy.url().should('include', '/administration')
      cy.getByTestId('admin-panel-page', { timeout: 15000 }).should('exist')
      cy.contains('h1', "Panneau d'administration").should('exist')
    })

    it('exports study data as an xlsx file', () => {
      cy.visit('/administration')
      cy.getByTestId('admin-panel-page', { timeout: 15000 }).should('exist')
      cy.stubDownloads()

      cy.getByTestId('admin-studies-export-xlsx').click()

      cy.waitForDownload('xlsx').then((download) => {
        expect(download.fileName).to.eq('export-count.xlsx')
        expect(Array.from(download.bytes.slice(0, 2))).to.deep.equal([0x50, 0x4b])
      })
    })
  })
})
