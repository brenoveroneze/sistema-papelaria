const fs = require('fs');
require('dotenv').config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const FILE_TO_REVIEW = './src/services/StockService.js';

async function runReview() {
  console.log("--- INICIANDO DIAGNÓSTICO IA  ---");

  if (!GROQ_API_KEY) {
    console.error("ERRO: A variável GROQ_API_KEY está vazia/não definida.");
    process.exit(1);
  }

  if (!fs.existsSync(FILE_TO_REVIEW)) {
    console.error(`Arquivo não encontrado: ${FILE_TO_REVIEW}`);
    return;
  }

  const codeContent = fs.readFileSync(FILE_TO_REVIEW, 'utf8');

  // Prompt ajustado para Code Review
  const prompt = `
    Atue como um Arquiteto de Software Especialista.
    Analise o código abaixo em busca de bugs, falhas de segurança e melhorias de legibilidade.
    Forneça exatamente 3 recomendações práticas e diretas.
    Responda em Português do Brasil.
    
    Código:
    ${codeContent}
  `;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
            { role: "system", content: "Você é um assistente de Code Review focado em qualidade." },
            { role: "user", content: prompt }
        ],
        // ATUALIZADO: Modelo novo e estável da Groq
        model: "llama-3.3-70b-versatile", 
        temperature: 0.2
      })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Erro API Groq (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const feedback = data.choices[0]?.message?.content;

    console.log("\n=== RELATÓRIO DE QUALIDADE (GROQ) ===\n");
    console.log(feedback);
    console.log("\n========================================\n");

  } catch (error) {
    console.error(" Falha crítica na IA:", error.message);
    process.exit(1);
  }
}

runReview();