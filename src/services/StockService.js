const ProductRepository = require('../repositories/ProductRepository');

class StockService {
  
  /**
   * Adiciona um novo produto ao estoque
   */
  async createProduct(data) {
    // Regra 1: Validação de Campos
    if (!data.name || data.price <= 0 || data.quantity < 0) {
      throw new Error("Dados do produto inválidos");
    }
    
    // Regra 2: Categoria Padrão
    if (!data.category) {
      data.category = 'GERAL';
    }

    return await ProductRepository.create(data);
  }

  /**
   * Realiza uma venda e baixa o estoque
   */
  async sellProduct(id, amount) {
    const product = await ProductRepository.findByID(id);

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    // Regra 3: Não pode vender mais do que tem
    if (product.quantity < amount) {
      throw new Error("Estoque insuficiente para a venda");
    }

    const newQuantity = product.quantity - amount;
    await ProductRepository.updateQuantity(id, newQuantity);

    // Regra 4: Retorna status do estoque após venda
    let stockStatus = "OK";
    if (newQuantity === 0) {
      stockStatus = "ESGOTADO";
    } else if (newQuantity <= product.min_quantity) {
      stockStatus = "BAIXO"; // Alerta de reposição
    }

    return {
      message: "Venda realizada",
      remainingQuantity: newQuantity,
      status: stockStatus
    };
  }

  /**
   * Relatório de Inventário (Soma total do patrimônio)
   */
  async getInventoryValue() {
    const products = await ProductRepository.listAll();
    
    // Complexidade para o Sonar: Reduce
    const totalValue = products.reduce((acc, prod) => {
      return acc + (prod.price * prod.quantity);
    }, 0);

    return {
      totalProducts: products.length,
      totalValue: parseFloat(totalValue.toFixed(2))
    };
  }
}

module.exports = new StockService();