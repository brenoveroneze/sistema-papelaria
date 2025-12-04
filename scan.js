const sonarqubeScanner = require('sonarqube-scanner');
const scanner = sonarqubeScanner.default || sonarqubeScanner;

scanner(
  {
    serverUrl: 'http://localhost:9000',
    // token: '...',  <-- REMOVA ESSA LINHA DAQUI PARA NÃO DAR CONFLITO
    options: {
      'sonar.projectKey': 'sistema-papelaria',
      'sonar.sources': 'src',
      'sonar.tests': 'tests',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.sourceEncoding': 'UTF-8',
      
      // ADICIONE AQUI DENTRO. O Sonar aceita o token no campo "login"
      'sonar.login': 'sqp_0f90d2377e9a296d0aaba7bbf8f6b6a2fc07031e' 
    },
  },
  () => {
    console.log('>> SonarQube: Análise finalizada!');
    process.exit();
  }
);