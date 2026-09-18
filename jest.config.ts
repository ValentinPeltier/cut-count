import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const nextJestBaseConfig: Config = {
  preset: 'ts-jest',
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['<rootDir>/src/tests/unit/**/*.test.ts', '<rootDir>/src/**/*.test.*'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/unit/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default nextJest({ dir: './' })(nextJestBaseConfig)
