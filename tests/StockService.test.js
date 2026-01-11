const StockService = require('../src/services/StockService');
const ProductRepository = require('../src/repositories/ProductRepository');

describe('StockService - Papelaria', () => {

  // Antes de CADA teste, limpamos o banco para começar zerado
  beforeEach(async () => {
    await ProductRepository.deleteAll();
  });

  it('Deve criar um produto com sucesso', async () => {
    const product = { name: "Caneta Azul", price: 2.50, quantity: 100, min_quantity: 10 };
    const result = await StockService.createProduct(product);
    
    expect(result).toHaveProperty('id');
    expect(result.name).toBe("Caneta Azul");
  });

  it('Deve bloquear criação de produto com preço negativo', async () => {
    const product = { name: "Erro", price: -5, quantity: 10 };
    
    await expect(StockService.createProduct(product))
      .rejects.toThrow("Dados do produto inválidos");
  });

  it('Deve realizar venda e baixar estoque', async () => {
    // 1. Preparar (Criar produto)
    const p = await StockService.createProduct({ name: "Caderno", price: 20, quantity: 50, min_quantity: 10 });
    
    // 2. Agir (Vender 5)
    const sale = await StockService.sellProduct(p.id, 5);

    // 3. Verificar
    expect(sale.remainingQuantity).toBe(45);
    expect(sale.status).toBe("OK");
  });

  it('Deve alertar ESTOQUE BAIXO quando atingir o mínimo', async () => {
    // Mínimo é 10. Temos 15. Vendemos 6. Sobra 9.
    const p = await StockService.createProduct({ name: "Lápis", price: 1, quantity: 15, min_quantity: 10 });
    
    const sale = await StockService.sellProduct(p.id, 6);

    expect(sale.remainingQuantity).toBe(9);
    expect(sale.status).toBe("BAIXO");
  });

})