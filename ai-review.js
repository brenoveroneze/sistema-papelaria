const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require('dotenv').config(); // Para testes locais

// Configuração
const API_KEY = process.env.GEMINI_API_KEY;
const FILE_TO_REVIEW = './src/services/StockService.js';

async function runReview() {
  if (!API_KEY) {
    console.error("Erro: GEMINI_API_KEY não encontrada.");
    process.exit(1);
  }

  try {
    // 1. Ler o código fonte
    if (!fs.existsSync(FILE_TO_REVIEW)) {
      console.log("Arquivo não encontrado para revisão.");
      return;
    }
    const codeContent = fs.readFileSync(FILE_TO_REVIEW, 'utf8');

    // 2. Preparar o Gemini
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. Criar o Prompt (O comando para a IA)
    const prompt = `
      Você é um Engenheiro de Software Sênior especialista em Node.js e Clean Code.
      Analise o código abaixo.
      
      Seu objetivo:
      1. Identificar pontos de melhoria de performance (Complexidade O(n)).
      2. Sugerir refatorações para legibilidade.
      3. Elogiar o que estiver bom.
      
      Seja conciso e didático. Use markdown na resposta.
      
      Código para análise:
      \`\`\`javascript
      ${codeContent}
      \`\`\`
    `;

    console.log("Gemini está analisando seu código... Aguarde.");

    // 4. Enviar e Receber resposta
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("\n================ RELATÓRIO DO GEMINI ================\n");
    console.log(text);
    console.log("\n=====================================================\n");

  } catch (error) {
    console.error("Falha na revisão por IA:", error.message);
    // Não damos exit(1) para não quebrar o pipeline, apenas logamos o erro.
  }
}

runReview();