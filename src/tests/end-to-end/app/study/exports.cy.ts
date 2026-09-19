import { expect } from 'chai'

import { sanitizeStudyName } from '@/utils/study'
import { COUNT_GOLDEN_STUDY_ID, COUNT_GOLDEN_STUDY_NAME } from '../../../fixtures/count/constants'

const RESULTS_PATH = `/etudes/${COUNT_GOLDEN_STUDY_ID}/comptabilisation/resultats`
const EXPECTED_XLSX_NAME = `resultats_etude_${sanitizeStudyName(COUNT_GOLDEN_STUDY_NAME)}.xlsx`
const EXPECTED_PDF_NAME = `${COUNT_GOLDEN_STUDY_NAME}_empreinte_carbone_2025.pdf`

describe('Count! results exports', () => {
  before(() => {
    cy.resetTestDatabase()
  })

  beforeEach(() => {
    cy.login()
    cy.visit(RESULTS_PATH)
    cy.contains(COUNT_GOLDEN_STUDY_NAME, { timeout: 20000 }).should('be.visible')
    cy.getByTestId('export-results-xlsx', { timeout: 20000 }).should('be.visible')
    cy.stubDownloads()
  })

  it('exports results as an XLSX file', () => {
    cy.getByTestId('export-results-xlsx').click()

    cy.waitForDownload('xlsx').then((download) => {
      expect(download.fileName).to.eq(EXPECTED_XLSX_NAME)
      // XLSX is a ZIP container (PK..)
      expect(Array.from(download.bytes.slice(0, 2))).to.deep.equal([0x50, 0x4b])
    })
  })

  it('downloads the summary sheet as a PDF file', () => {
    cy.getByTestId('download-summary-pdf').click()

    cy.waitForDownload('pdf').then((download) => {
      expect(download.fileName).to.eq(EXPECTED_PDF_NAME)
      expect(String.fromCharCode(...download.bytes.slice(0, 4))).to.eq('%PDF')
    })
  })
})
