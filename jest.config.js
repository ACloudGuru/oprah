// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // clearMocks: true,
  collectCoverageFrom: [
    'lib/**/*.js',
    '!src/plugins/**/*.js',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    ['lcovonly', { projectRoot: __dirname }],
    'text-summary',
    'html'
  ],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  watchman: true,
  coverageThreshold: {
    global: {
      statements: 94,
      branches: 75,
      functions: 92,
      lines: 94
    }
  }
};
