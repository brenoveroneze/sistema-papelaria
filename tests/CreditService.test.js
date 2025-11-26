const CreditService = require('../src/CreditService');

describe('CreditService - Análise de Risco', () => {
  let service;

  // Antes de cada teste, instanciamos a classe de novo para garantir limpeza
  beforeEach(() => {
    service = new CreditService();
  });

  it('Deve rejeitar cliente menor de idade (Regra Crítica)', () => {
    const customer = { age: 17, income: 5000, creditScore: 700 };
    const loanAmount = 1000;

    const result = service.calculateRisk(customer, loanAmount);

    expect(result.approved).toBe(false);
    expect(result.reason).toBe('Cliente menor de idade');
    expect(result.riskLevel).toBe('CRITICAL');
  });

  it('Deve rejeitar cliente com Score baixo (Regra de Negócio)', () => {
    const customer = { age: 25, income: 5000, creditScore: 300 }; // Score baixo
    const loanAmount = 1000;

    const result = service.calculateRisk(customer, loanAmount);

    expect(result.approved).toBe(false);
    expect(result.riskLevel).toBe('HIGH');
  });

  it('Deve rejeitar empréstimo muito alto em relação a renda', () => {
    const customer = { age: 25, income: 2000, creditScore: 800 };
    // Limite seria 6000 (3x renda). Pedindo 7000 deve falhar.
    const loanAmount = 7000;

    const result = service.calculateRisk(customer, loanAmount);

    expect(result.approved).toBe(false);
    expect(result.reason).toContain('excede o limite');
  });

  it('Deve APROVAR cliente com boas condições', () => {
    const customer = { age: 30, income: 10000, creditScore: 800 };
    const loanAmount = 5000; // Dentro do limite

    const result = service.calculateRisk(customer, loanAmount);

    expect(result.approved).toBe(true);
    expect(result.riskLevel).toBe('LOW');
  });

  it('Deve lançar erro se dados forem nulos', () => {
    expect(() => {
      service.calculateRisk(null, 1000);
    }).toThrow('Dados inválidos para análise');
  });
});