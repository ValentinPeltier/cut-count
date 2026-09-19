type MailDevEmail = {
  id: string
  subject: string
  html?: string
  text?: string
  to?: { address: string; name?: string }[]
  from?: { address: string; name?: string }[]
}

type CapturedDownload = {
  fileName: string
  bytes: Uint8Array
}

interface Window {
  __cyDownload?: CapturedDownload
  __cyDownloadReady?: Promise<CapturedDownload>
}

declare namespace Cypress {
  interface Chainable {
    getByTestId(
      testId: string,
      params?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>,
    ): Chainable<JQuery<HTMLElement>>
    resetTestDatabase(): Chainable<void>
    login(email?: string, password?: string, options?: { cacheSession?: boolean }): Chainable<void>
    logout(): Chainable<void>
    loginForEnv(env: 'cut', email?: string, password?: string, options?: { cacheSession?: boolean }): Chainable<void>
    signup(email?: string, cncOrSiret?: string): Chainable<void>
    clearEmails(): Chainable<void>
    waitForEmail(
      matcher: { to?: string; subject?: string | RegExp },
      options?: { timeout?: number },
    ): Chainable<MailDevEmail>
    openEmailLink(matcher: { to?: string; subject?: string | RegExp }, options?: { timeout?: number }): Chainable<void>
    stubDownloads(): Chainable<void>
    waitForDownload(extension: string): Chainable<CapturedDownload>
  }
}
