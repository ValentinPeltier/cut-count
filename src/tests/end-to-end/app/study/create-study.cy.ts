// import dayjs from 'dayjs'

// type SimplifiedStudyOptions = {
//   includeEndDate?: boolean
//   startPath?: string
// }

// const newSimplifiedStudyTest = (studyName: string, options: SimplifiedStudyOptions = {}) => {
//   const { includeEndDate = true, startPath = '/organisations' } = options

//   cy.intercept('POST', '**/etudes/creer**').as('create')
//   cy.intercept('GET', '**/etudes/creer**').as('creationPageLoad')
//   cy.visit(startPath)
//   cy.getByTestId('new-study').should('be.visible').click()
//   cy.url({ timeout: 15000 }).should('include', 'creer')
//   cy.wait('@creationPageLoad', { timeout: 15000 })

//   cy.get('[data-testid="new-study-organization-title"], [data-testid="new-study-name"]', { timeout: 20000 })
//     .first()
//     .should('be.visible')
//   cy.document().then((doc) => {
//     if (doc.querySelector('[data-testid="new-study-organization-title"]')) {
//       cy.getByTestId('organization-sites-checkbox', { timeout: 10000 }).first().click()
//       cy.getByTestId('new-study-organization-button').click()
//     }
//   })
//   cy.getByTestId('new-study-name', { timeout: 10000 }).should('be.visible')
//   cy.getByTestId('new-study-name').type(studyName)
//   if (includeEndDate) {
//     cy.getByTestId('new-study-endDate').within(() => {
//       cy.get('span').first().type(dayjs().add(1, 'y').format('DD/MM/YYYY'))
//     })
//   }
//   cy.getByTestId('new-study-create-button').click()

//   cy.wait('@create', { timeout: 15000 }).its('response.statusCode').should('eq', 200)
//   cy.url({ timeout: 15000 }).should('include', '/etudes/')
//   cy.contains(studyName, { timeout: 15000 }).should('be.visible')
// }

// const newAdvancedStudyTest = (studyName: string) => {
//   cy.intercept('POST', '**/etudes/creer').as('create')
//   cy.visit('/')
//   cy.getByTestId('new-study').should('be.visible').click()

//   cy.getByTestId('new-study-organization-title').should('be.visible')
//   cy.getByTestId('organization-sites-checkbox').first().click()
//   cy.getByTestId('new-study-organization-button').click()

//   cy.getByTestId('new-study-name').type(studyName)
//   cy.getByTestId('new-study-level').click()
//   cy.get('[data-value="Initial"]').click()
//   cy.getByTestId('new-validator-name').click()
//   cy.get('[data-option-index="1"]').click()
//   cy.getByTestId('new-study-endDate').within(() => {
//     cy.get('span').first().type(dayjs().add(1, 'y').format('DD/MM/YYYY'))
//   })
//   cy.getByTestId('new-study-create-button').click()

//   cy.wait('@create').its('response.statusCode').should('eq', 200)
//   cy.url().should('include', '/etudes/')
//   cy.contains(studyName).should('be.visible')
// }

// describe('Create study', () => {
//   before(() => {
//     cy.resetTestDatabase()
//   })

//   describe('BC', () => {
//     it('should create a study on your organization as a simple user', () => {
//       cy.intercept('POST', '**/etudes/creer').as('create')
//       cy.login()
//       cy.visit('/')
//       cy.getByTestId('new-study').should('be.visible').click()
//       cy.getByTestId('new-study-organization-title').should('be.visible')
//       cy.getByTestId('new-study-organization-select').should('not.exist')
//       cy.getByTestId('new-study-organization-button').should('be.disabled')
//       cy.getByTestId('organization-sites-checkbox').first().click()
//       cy.getByTestId('new-study-organization-button').should('not.be.disabled')
//       cy.getByTestId('new-study-organization-button').click()
//       cy.getByTestId('new-study-name').type('My new study')
//       cy.getByTestId('new-validator-name').click()
//       cy.get('[data-option-index="1"]').click()
//       cy.getByTestId('new-study-level').click()
//       cy.get('[data-value="Initial"]').click()
//       cy.getByTestId('new-study-endDate').within(() => {
//         cy.get('span').first().type(dayjs().add(1, 'y').format('DD/MM/YYYY'))
//       })
//       cy.getByTestId('new-study-create-button').click()
//       cy.wait('@create')
//     })

//     it('should create a study as BC Admin', () => {
//       cy.login('bc-admin-0@yopmail.com', 'password-0')
//       newAdvancedStudyTest('BC Admin study')
//     })

//     it('should create a study as BC GESTIONNAIRE', () => {
//       cy.login('bc-gestionnaire-0@yopmail.com', 'password-0')
//       newAdvancedStudyTest('BC Gestionnaire study')
//     })

//     it('should create a study on a child organization as a CR user', () => {
//       cy.intercept('POST', '**/etudes/creer').as('create')
//       cy.login('bc-cr-collaborator-1@yopmail.com', 'password-1')
//       cy.visit('/')
//       cy.getByTestId('organization').first().find('a').click()
//       cy.url().should('include', '/organisations/')
//       cy.getByTestId('new-study').should('be.visible').click()
//       cy.getByTestId('new-study-organization-title').should('be.visible')
//       cy.getByTestId('organization-sites-checkbox').first().click()
//       cy.getByTestId('new-study-organization-button').click()
//       cy.getByTestId('new-study-name').type('My CR child org study')
//       cy.getByTestId('new-validator-name').click()
//       cy.get('[data-option-index="1"]').should('not.exist')
//       cy.getByTestId('new-study-level').click()
//       cy.get('[data-value="Initial"]').click()
//       cy.getByTestId('new-validator-name').click()
//       cy.get('[data-option-index="1"]').click()
//       cy.getByTestId('new-study-endDate').within(() => {
//         cy.get('span').first().type(dayjs().add(1, 'y').format('MM/DD/YYYY'))
//       })
//       cy.getByTestId('new-study-create-button').click()
//       cy.wait('@create').its('response.statusCode').should('eq', 200)
//       cy.url().should('include', '/etudes/')
//       cy.url().should('not.include', '/creer')
//       cy.contains('My CR child org study').should('be.visible')
//     })
//   })

//   describe('CUT', () => {
//     it('should create a study as CUT Admin', () => {
//       cy.loginForEnv('cut', 'cut-env-admin-0@yopmail.com', 'password-0')
//       newSimplifiedStudyTest('CUT Admin study')
//     })

//     it('should create a study as CUT Default', () => {
//       cy.loginForEnv('cut', 'cut-env-default-0@yopmail.com', 'password-0')
//       newSimplifiedStudyTest('CUT Default study')
//     })
//   })
// })
