import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config = async (): Promise<Config> => {
  const jestConfig = await createJestConfig({
    preset: 'ts-jest',
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    testMatch: ['<rootDir>/src/tests/unit/**/*.test.ts', '<rootDir>/src/**/*.test.*'],
    setupFilesAfterEnv: ['<rootDir>/src/tests/unit/setupTests.ts'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
  })()

  // TanStack Table v9 is ESM-only. Next prepends its own ignore pattern, so the exception has to be added there.
  jestConfig.transformIgnorePatterns = jestConfig.transformIgnorePatterns?.map((pattern) =>
    pattern.startsWith('/node_modules/(?!.pnpm)') ? pattern.replace('(?!(', '(?!(@tanstack|') : pattern,
  )

  return jestConfig
}

export default config
