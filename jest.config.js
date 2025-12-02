const path = require('path');

module.exports = {
  testEnvironment: 'node',
  
  roots: [
    "<rootDir>/tests"
  ],

  testMatch: [
    "**/*.test.js"
  ],

  testPathIgnorePatterns: [
    "/node_modules/"
  ],

  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js'
  ]
};