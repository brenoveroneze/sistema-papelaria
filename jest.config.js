const path = require('path');

module.exports = {
  testEnvironment: 'node',
  
  roots: [
    "<rootDir>/tests"
  ],

  testMatch: [
    "**/*.test.js"
  ],

  // Removemos 'actions-runner' daqui para não bloquear o projeto todo
  testPathIgnorePatterns: [
    "/node_modules/"
  ],

  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js'
  ]
};