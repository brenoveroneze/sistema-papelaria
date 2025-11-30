module.exports = {
  testEnvironment: 'node',

  // PROCURA: Qualquer arquivo que termine com .test.js em qualquer pasta
  testMatch: ['**/*.test.js'],

  // IGNORA: Proíbe entrar nestas pastas (Resolve o erro do Runner e do GitHub)
  testPathIgnorePatterns: [
    "/node_modules/",
    "/actions-runner/", // A pasta do seu runner
    "/.github/",        // A pasta do pipeline
    "/coverage/"
  ],

  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js'
  ],
};