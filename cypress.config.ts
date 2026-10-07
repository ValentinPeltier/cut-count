import { defineConfig } from 'cypress'
import * as dotenv from 'dotenv'
import { execSync } from 'node:child_process'

dotenv.config({ path: '.env.test' })
dotenv.config({ path: '.env' })

export default defineConfig({
  e2e: {
    setupNodeEvents(on) {
      on('task', {
        resetTestDatabase() {
          execSync('yarn db:test:prepare', { stdio: 'inherit', timeout: 180000 })
          return null
        },
      })
    },
    specPattern: 'src/tests/end-to-end/**/*.cy.{js,jsx,ts,tsx}',
    baseUrl: process.env.CYPRESS_URL,
    supportFile: 'cypress/support/index.ts',
    defaultCommandTimeout: 15000, // default value, change if needed during local tests
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: process.env.CYPRESS_UI === 'true' ? 10 : 0,
    pageLoadTimeout: 80000,
    requestTimeout: 15000,
    responseTimeout: 15000,
  },
})
