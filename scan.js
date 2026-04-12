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
      'sonar.login': 'sqa_8c75eae117f8f1cdd88769351e6b8f72bd7defb8' 
    },
  },
  () => {
    console.log('>> SonarQube: Análise finalizada!');
    process.exit();
  }
);