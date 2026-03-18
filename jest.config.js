const path = require('path');

module.exports = {
  testEnvironment: 'node',
  
  roots: [
    "<rootDir>"
  ],

  testMatch: [
    "**/tests/**/*.test.js"
  ],

  testPathIgnorePatterns: [
    "/node_modules/"
  ],

  collectCoverage: true, 
  coverageDirectory: 'coverage',
  
  // Formato 'lcov' obrigatório para o SonarQube
  coverageReporters: ['lcov', 'text-summary', 'html'], 

  collectCoverageFrom: [
    'src/**/*.js',               // Coleta cobertura APENAS do que está dentro do src
    '!src/server.js',            // Ignora o start do servidor
    '!src/database/db.js'        // Ignora o arquivo de conexão pura com o banco
  ]
};