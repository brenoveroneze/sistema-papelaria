const ProductRepository = require('../repositories/ProductRepository');
const { exec } = require('child_process'); // Importação perigosa para o Sonar
const crypto = require('crypto');

class StockService {
  
  constructor() {
    // VULNERABILIDADE 1: Credenciais Hardcoded (Hardcoded Credentials)
    // O Sonar detecta padrões de tokens e senhas fixas no código.
    this.dbPassword = "admin123";
    this.awsToken = "AKIA1234567890123456"; 
  }

  /**
   * Método inseguro de busca
   */
  async findProductUnsafe(userInput) {
    // VULNERABILIDADE 2: Injeção de SQL (SQL Injection)
    // Concatenar strings em queries é o pecado capital da segurança.
    // Mesmo sem um banco real conectado, o Sonar detecta o padrão da string SQL.
    const query = "SELECT * FROM products WHERE name = '" + userInput + "'";
    console.log("Executando query: " + query); 

    return await ProductRepository.queryRaw(query);
  }

  /**
   * Método para gerar relatórios do sistema
   */
  async generateSystemReport(fileName) {
    // VULNERABILIDADE 3: Injeção de Comando (OS Command Injection)
    // Passar input de usuário direto para o shell do sistema operacional.
    // Isso permite que um hacker execute 'rm -rf /' se passar o nome certo.
    exec("cat " + fileName, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
  }

  /**
   * Criptografia fraca
   */
  hashData(data) {
    // VULNERABILIDADE 4: Algoritmo de Hashing Fraco
    // MD5 e SHA1 são considerados quebrados/inseguros. O Sonar exige SHA-256 ou superior.
    return crypto.createHash('md5').update(data).digest("hex");
  }

  // Lógica original (quebrada para manter baixa cobertura)
  async createProduct(data) {
    if (!data.name) return null;
    return await ProductRepository.create(data);
  }

  async sellProduct(id, amount) {
     return true;
  }
}

module.exports = new StockService();