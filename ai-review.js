const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require('dotenv').config();

// Ordem de prioridade: Variável do Sistema (GitHub Actions) > Arquivo .env
const API_KEY = process.env.GEMINI_API_KEY;
const FILE_TO_REVIEW = './src/services/StockService.js';

async function runReview() {
  console.log("--- INICIANDO DIAGNÓSTICO IA ---");

  // Debug de Segurança: Mostra se a chave existe sem revelar ela
  if (!API_KEY) {
    console.error("❌ ERRO CRÍTICO: A variável GEMINI_API_KEY está VAZIA ou INDEFINIDA.");
    return;
  } else {
    console.log(`✅ API Key detectada (Tamanho: ${API_KEY.length} caracteres)`);
  }

  try {
    if (!fs.existsSync(FILE_TO_REVIEW)) {
      console.log("Arquivo não encontrado para revisão.");
      return;
    }
    const codeContent = fs.readFileSync(FILE_TO_REVIEW, 'utf8');

    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // USANDO GEMINI-PRO: É o modelo mais estável para evitar erro 404
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Você é um Tech Lead avaliando um código de TCC.
      Analise o código abaixo (StockService.js).
      Seja curto, direto e educado. Dê 3 sugestões de melhoria.
      
      Código:
      ${codeContent}
    `;

    console.log("🤖 Enviando para o Google Gemini...");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("\n=== RELATÓRIO GEMINI ===\n");
    console.log(text);
    console.log("\n========================\n");

  } catch (error) {
    console.error("❌ Falha na comunicação com a IA:");
    console.error(error.message); 
    // Se for erro de permissão, vai aparecer aqui
  }
}

runReview();