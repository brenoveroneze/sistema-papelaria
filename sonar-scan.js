const scanner = require('sonarqube-scanner');

// Correção: Agora chamamos o método .scan() explicitamente
scanner.scan(
  {
    serverUrl: 'http://localhost:9000',
    options: {
      'sonar.login': 'admin', // Se já mudou a senha no navegador, use a nova aqui
      'sonar.password': '@Bre26092000', // Senha padrão ou a nova
    },
  },
  () => process.exit()
);