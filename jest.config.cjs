/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/src/test/jest.setup.ts'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  clearMocks: true,
}
