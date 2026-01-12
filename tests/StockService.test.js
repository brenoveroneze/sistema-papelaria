const StockService = require('../src/services/StockService');
const ProductRepository = require('../src/repositories/ProductRepository');

describe('StockService - Papelaria', () => {

  beforeEach(async () => {
    await ProductRepository.deleteAll();
  });

  // --- VIOLAÇÃO 1: DUPLICAÇÃO DE CÓDIGO ---
  // O teste abaixo é praticamente idêntico ao seguinte. Isso vai disparar o gatilho
  // de "Duplicated Lines > 3%".
  
  it('Deve criar um produto com sucesso', async () => {
    const product = { name: "Caneta Azul", price: 2.50, quantity: 100, min_quantity: 10 };
    const result = await StockService.createProduct(product);
    
    expect(result).toHaveProperty('id');
    expect(result.name).toBe("Caneta Azul");
  });


});