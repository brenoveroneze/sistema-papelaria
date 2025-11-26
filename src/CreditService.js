class CreditService {
  /**
   * Analisa se um empréstimo pode ser concedido.
   * @param {Object} customer - Dados do cliente
   * @param {number} customer.age - Idade
   * @param {number} customer.income - Renda mensal
   * @param {number} customer.creditScore - Score (0 a 1000)
   * @param {number} loanAmount - Valor solicitado do empréstimo
   * @returns {Object} Resultado da análise
   */
  calculateRisk(customer, loanAmount) {
    // Regra 1: Validação de Inputs básicos
    if (!customer || !loanAmount) {
      throw new Error("Dados inválidos para análise");
    }

    // Regra 2: Menor de idade (Risco Legal)
    if (customer.age < 18) {
      return {
        approved: false,
        reason: "Cliente menor de idade",
        riskLevel: "CRITICAL"
      };
    }

    // Regra 3: Score baixo (Risco de Inadimplência)
    if (customer.creditScore < 500) {
      return {
        approved: false,
        reason: "Score de crédito insuficiente",
        riskLevel: "HIGH"
      };
    }

    // Regra 4: Comprometimento de Renda (Capacidade de Pagamento)
    const maxInstallment = customer.income * 0.30;
    // Vamos supor um empréstimo pago em 1 parcela para simplificar a lógica inicial
    // Ou considerar que o loanAmount total não pode ser maior que 3x a renda (regra comum)
    const limit = customer.income * 3;

    if (loanAmount > limit) {
      return {
        approved: false,
        reason: "Valor do empréstimo excede o limite baseado na renda",
        riskLevel: "MEDIUM"
      };
    }

    // Se passou por tudo: Aprovado
    return {
      approved: true,
      reason: "Análise concluída com sucesso",
      riskLevel: "LOW"
    };
  }
}

module.exports = CreditService;