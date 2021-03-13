// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // clearMocks: true,
  collectCoverageFrom: [
    'lib/**/*.js',
    '!src/plugins/**/*.js',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'html'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  watchman: true,
  coverageThreshold: {
    global: {
      statements: 95,
      branches: 80,
      functions: 93,
      lines: 95
    }
  }
};
