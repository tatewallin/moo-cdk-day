module.exports = {
  roots: [
    '<rootDir>/test',
  ],
  testMatch: [ '**/*.test.(ts|js)'],
  collectCoverage: true,
  testResultsProcessor: 'jest-sonar-reporter',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/test/',
  ],
  coverageDirectory: './.jest/coverage',
  snapshotSerializers: [
    'moo-cdk-jest-serializer',
  ],
  testRegex: [],
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.js']
}
