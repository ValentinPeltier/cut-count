import { expect } from 'chai'

Cypress.Commands.add(
  'getByTestId',
  (testId: string, params?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>) =>
    cy.get(`[data-testid="${testId}"]`, params),
)

type LoginOptions = {
  /** Cache cookies via cy.session (default true). Use false for auth flows that assert login itself. */
  cacheSession?: boolean
}

const fillAndSubmitLogin = (email: string, password: string, entryPath = '/login') => {
  cy.visit(entryPath)
  cy.url().should('include', entryPath)
  cy.get('[data-testid="input-email"] > .MuiInputBase-root > .MuiInputBase-input')
    .should('be.visible')
    .should('not.be.disabled')
    .type(email)
  cy.get('[data-testid="input-email"] > .MuiInputBase-root > .MuiInputBase-input').should('have.value', email)
  cy.get('[data-testid="input-password"] > .MuiInputBase-root > .MuiInputBase-input')
    .should('be.visible')
    .should('not.be.disabled')
    .type(password)
  cy.getByTestId('login-button').should('be.visible').should('not.be.disabled').click()
  cy.wait('@login')
}

const loginWithOptionalSession = (email: string, password: string, entryPath: string, options: LoginOptions = {}) => {
  const { cacheSession = true } = options

  if (!cacheSession) {
    fillAndSubmitLogin(email, password, entryPath)
    return
  }

  // Session key = identity. Switching user / password creates a different cache entry.
  cy.session(
    [email, password],
    () => {
      fillAndSubmitLogin(email, password, entryPath)
      cy.url().should('not.include', '/login')
    },
    {
      validate() {
        cy.request('/api/auth/session').then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body?.user?.email, 'session email').to.eq(email)
        })
      },
    },
  )
}

Cypress.Commands.add('login', (email = 'admin-0@yopmail.com', password = 'admin-0', options: LoginOptions = {}) => {
  loginWithOptionalSession(email, password, '/login', options)
})

Cypress.Commands.add('logout', () => {
  cy.visit('/logout')
  cy.wait('@logout')
  // Drop cached identities so the next login() recreates a fresh session.
  Cypress.session.clearAllSavedSessions()
})

Cypress.Commands.add('signup', (email = 'cut-cnc@yopmail.com', cncOrSiret = '321') => {
  cy.visit('/register')

  cy.getByTestId('activation-email').should('be.visible')
  cy.getByTestId('activation-siretOrCNC').should('be.visible')
  cy.getByTestId('activation-button').should('be.visible')

  cy.getByTestId('activation-email').find('input').clear()
  cy.getByTestId('activation-email').find('input').type(email)
  cy.getByTestId('activation-siretOrCNC').find('input').clear()
  cy.getByTestId('activation-siretOrCNC').find('input').type(cncOrSiret)
  cy.getByTestId('activation-form-message').should('not.exist')
  cy.getByTestId('activation-button').click()

  cy.wait('@signup')
})

// Absolute URL required: support files are bundled for the browser and do not get Node `process.env`.
const MAILDEV_ORIGIN = 'http://localhost:1080'

type MailDevEmail = {
  id: string
  subject: string
  html?: string
  text?: string
  to?: { address: string; name?: string }[]
  from?: { address: string; name?: string }[]
}

const extractFirstLink = (html: string) => {
  const match = html.match(/href="(https?:\/\/[^"]+)"/i) ?? html.match(/href='(https?:\/\/[^']+)'/i)
  if (!match?.[1]) {
    throw new Error('No http(s) link found in email HTML')
  }
  return match[1]
}

Cypress.Commands.add('clearEmails', () => {
  cy.request('DELETE', `${MAILDEV_ORIGIN}/email/all`)
})

Cypress.Commands.add(
  'waitForEmail',
  (matcher: { to?: string; subject?: string | RegExp }, { timeout = 15000 }: { timeout?: number } = {}) => {
    const started = Date.now()

    const poll = (): Cypress.Chainable<MailDevEmail> =>
      cy.request(`${MAILDEV_ORIGIN}/email`).then((response) => {
        const emails = response.body as MailDevEmail[]
        const match = [...emails].reverse().find((email) => {
          const toMatches = !matcher.to || email.to?.some((recipient) => recipient.address === matcher.to)
          const subject = email.subject ?? ''
          const subjectMatches =
            !matcher.subject ||
            (typeof matcher.subject === 'string' ? subject.includes(matcher.subject) : matcher.subject.test(subject))
          return toMatches && subjectMatches
        })

        if (match) {
          return cy.wrap(match)
        }
        if (Date.now() - started > timeout) {
          throw new Error(
            `Timed out waiting for MailDev email${matcher.to ? ` to ${matcher.to}` : ''}${
              matcher.subject ? ` with subject ${matcher.subject}` : ''
            }`,
          )
        }
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        return cy.wait(500).then(poll)
      })

    return poll()
  },
)

Cypress.Commands.add(
  'openEmailLink',
  (matcher: { to?: string; subject?: string | RegExp }, options?: { timeout?: number }) => {
    cy.waitForEmail(matcher, options).then((email) => {
      const html = email.html
      if (!html) {
        throw new Error(`Email "${email.subject}" has no HTML body`)
      }
      cy.visit(extractFirstLink(html))
    })
  },
)

Cypress.Commands.add('resetTestDatabase', () => {
  // Seed recreates users with new ids — invalidate any cached next-auth cookies.
  Cypress.session.clearAllSavedSessions()
  cy.exec('yarn db:test:seed', { timeout: 180000 })
})

type CapturedDownload = {
  fileName: string
  bytes: Uint8Array
}

Cypress.Commands.add('stubDownloads', () => {
  cy.window().then((win) => {
    win.__cyDownloadReady = undefined
    win.__cyDownload = undefined

    cy.stub(win.HTMLAnchorElement.prototype, 'click').callsFake(function (this: HTMLAnchorElement) {
      if (!this.download || !this.href.startsWith('blob:')) {
        return
      }

      const fileName = this.download
      const href = this.href
      win.__cyDownloadReady = fetch(href)
        .then((response) => response.arrayBuffer())
        .then((buffer) => {
          const download = { fileName, bytes: new Uint8Array(buffer) }
          win.__cyDownload = download
          return download
        })
    })
  })
})

Cypress.Commands.add('waitForDownload', (extension: string) => {
  cy.window()
    .its('__cyDownloadReady', { timeout: 120000 })
    .should('exist')
    .then((ready) => ready as Promise<CapturedDownload>)
    .then((download) => {
      expect(download.fileName, 'download file name').to.match(new RegExp(`\\.${extension}$`, 'i'))
      expect(download.bytes.byteLength, 'download size').to.be.greaterThan(0)
      return download
    })
})
