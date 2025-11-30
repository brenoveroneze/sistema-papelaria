module.exports = {
  // Diz que o ambiente é Node.js (backend)
  testEnvironment: 'node',

  // A SOLUÇÃO: Força o Jest a olhar APENAS para dentro da pasta 'tests'
  roots: ['<rootDir>/tests'],

  // SEGURANÇA EXTRA: Manda ignorar explicitamente a pasta do runner e node_modules
  testPathIgnorePatterns: [
    "/node_modules/",
    "/actions-runner/",
    "/.github/"
  ],

  // Configurações de cobertura (para o SonarQube ler depois)
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js' // Ignora o server.js pois é difícil testar o listen da porta
  ],
};