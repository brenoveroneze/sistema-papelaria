const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
const FILE_TO_REVIEW = './src/services/StockService.js';

async function runReview() {
  if (!API_KEY) {
    console.error("❌ Erro: GEMINI_API_KEY não encontrada.");
    // Não mata o processo para não quebrar o pipeline, apenas avisa
    return;
  }

  try {
    if (!fs.existsSync(FILE_TO_REVIEW)) {
      console.log("Arquivo não encontrado para revisão.");
      return;
    }
    const codeContent = fs.readFileSync(FILE_TO_REVIEW, 'utf8');

    const genAI = new GoogleGenerativeAI(API_KEY);
    // Voltamos para o modelo flash, mas agora vamos atualizar a lib
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analise este código Node.js (StockService.js) focando em Clean Code e performance.
      Seja breve e liste apenas 3 pontos principais.
      
      Código:
      ${codeContent}
    `;

    console.log("🤖 Gemini está analisando...");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("\n=== RELATÓRIO GEMINI ===\n");
    console.log(text);
    console.log("\n========================\n");

  } catch (error) {
    console.error("Falha na revisão por IA:", error.message);
  }
}

runReview();