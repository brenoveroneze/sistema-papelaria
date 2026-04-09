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

  // Prompt
  const prompt = `
    Atue como um Arquiteto de Software Especialista em qualidade de código.
    Analise o código abaixo com precisão em busca de bugs, falhas de segurança, melhorias de legibilidade e otimização.
    Caso identifique pontos de melhoria informe, caso entenda que não são necessários ajustes apenas retorno "Código não precisa de ajustes."

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