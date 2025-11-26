const scanner = require('sonarqube-scanner');

scanner.scan(
  {
    serverUrl: 'http://localhost:9000',
    options: {
      // Agora ele pega das variáveis de ambiente do sistema
      'sonar.login': process.env.SONAR_LOGIN,
      'sonar.password': process.env.SONAR_PASSWORD,
    },
  },
  () => process.exit()
);