const ProductRepository = require('../repositories/ProductRepository');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

class StockService {
  
  constructor() {

    this.dbPassword = process.env.DB_PASSWORD || "";
    this.awsToken = process.env.AWS_TOKEN || ""; 
  }

  /**
   * Método seguro de busca
   */
  async findProductSafe(userInput) {

    if (!userInput || typeof userInput !== 'string') {
        throw new Error("Input inválido");
    }
    
    console.log(`Buscando produto pelo nome: ${userInput}`); 
    return await ProductRepository.findByName(userInput);
  }

  /**
   * Método para gerar relatórios do sistema (Corrigido)
   */
  async generateSystemReport(fileName) {

    const safeFileName = path.basename(fileName);
    const safePath = path.join(__dirname, '../reports', safeFileName);

    try {
        const data = await fs.readFile(safePath, 'utf8');
        console.log(`Relatório lido com sucesso.`);
        return data;
    } catch (error) {
        console.error(`Erro ao ler o relatório: ${error.message}`);
        throw error;
    }
  }

  /**
   * Criptografia forte
   */
  hashData(data) {
  
    return crypto.createHash('sha256').update(data).digest("hex");
  }

  async createProduct(data) {
    if (!data.name) return null;
    return await ProductRepository.create(data);
  }

  async sellProduct(id, amount) {
     return true;
  }
}

module.exports = new StockService();