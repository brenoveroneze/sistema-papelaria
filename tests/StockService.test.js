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

  it('Deve criar OUTRO produto com sucesso (Cópia desnecessária)', async () => {
    // A lógica interna é idêntica à de cima, apenas mudou o dado.
    // Em um cenário real, deveríamos usar test.each() ou parametrizar, não copiar o bloco.
    const product = { name: "Caneta Vermelha", price: 2.50, quantity: 100, min_quantity: 10 };
    const result = await StockService.createProduct(product);
    
    expect(result).toHaveProperty('id');
    expect(result.name).toBe("Caneta Vermelha");
  });

  // --- VIOLAÇÃO 2: BAIXA COBERTURA (< 90%) ---
  // Removi os testes que forçavam os erros.
  // As linhas 'throw new Error' no StockService.js ficarão vermelhas (uncovered) no relatório.
  
  /* it('Deve bloquear criação de produto com preço negativo', async () => {
     // CÓDIGO COMENTADO: O Sonar considera isso um "Code Smell" (Maintainability)
     // Além disso, ao comentar, perdi a cobertura da validação de preço.
  });
  */

  it('Deve realizar venda e baixar estoque', async () => {
    const p = await StockService.createProduct({ name: "Caderno", price: 20, quantity: 50, min_quantity: 10 });
    const sale = await StockService.sellProduct(p.id, 5);

    expect(sale.remainingQuantity).toBe(45);
    expect(sale.status).toBe("OK");
  });

  // --- VIOLAÇÃO 3: CONFIABILIDADE / CODE SMELL ---
  // Teste que executa lógica mas não valida o resultado final corretamente ou deixa lixo.
  
  it('Tenta vender mas não confere se deu certo', async () => {
    const p = await StockService.createProduct({ name: "Lápis", price: 1, quantity: 15, min_quantity: 10 });
    await StockService.sellProduct(p.id, 6);

    // ERRO: Esqueci de colocar os 'expect'. O teste passa falsamente (Falso Positivo).
    // O Sonar pode apontar "Test functions should have assertions".
    
    console.log("Isso aqui não deveria ir para produção"); // ERRO: Console.log é Code Smell em JS
  });

  // --- VIOLAÇÃO 4: FALTA DE COBERTURA DE REGRA DE NEGÓCIO ---
  // Removi o teste de "Estoque Insuficiente".
  // A regra "if (product.quantity < amount)" no service ficará sem cobertura.

});