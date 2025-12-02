const fs = require('fs');
require('dotenv').config();

// Configurações
const HF_TOKEN = process.env.HF_TOKEN;
// Modelo focado em código (Open Source e Gratuito na API de inferência)
const MODEL_URL = "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-Coder-32B-Instruct"; 
const FILE_TO_REVIEW = './src/services/StockService.js';

async function runReview() {
  console.log("--- INICIANDO DIAGNÓSTICO IA (VIA HUGGING FACE) ---");

  if (!HF_TOKEN) {
    console.error("❌ ERRO: A variável HF_TOKEN está vazia.");
    process.exit(1);
  }

  if (!fs.existsSync(FILE_TO_REVIEW)) {
    console.error(`❌ Arquivo não encontrado: ${FILE_TO_REVIEW}`);
    return;
  }

  const codeContent = fs.readFileSync(FILE_TO_REVIEW, 'utf8');

  // Prompt formatado para o modelo
  const prompt = `
    Aja como um Tech Lead Sênior. Analise o código JavaScript abaixo.
    Identifique problemas de segurança, performance ou boas práticas.
    Dê 3 sugestões curtas e diretas em formato de lista.
    
    Código:
    ${codeContent}
    
    Sugestões:
  `;

  console.log("🤖 Enviando requisição para Hugging Face...");

  try {
    const response = await fetch(MODEL_URL, {
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
            max_new_tokens: 500, // Limite da resposta
            return_full_text: false, // Não repete o prompt na resposta
            temperature: 0.3 // Criatividade baixa para ser mais técnico
        }
      }),
    });

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();

    // Tratamento de erro específico da API gratuita (Modelo carregando)
    if (result.error && result.error.includes("loading")) {
        console.warn("⚠️ O modelo está 'frio' (carregando). Tente rodar o pipeline novamente em 30 segundos.");
        return;
    }

    console.log("\n=== RELATÓRIO HUGGING FACE ===\n");
    // A API retorna um array de objetos. Pegamos o texto gerado.
    const feedback = result[0]?.generated_text || JSON.stringify(result);
    console.log(feedback);
    console.log("\n==============================\n");

  } catch (error) {
    console.error("❌ Falha na comunicação com a API:");
    console.error(error.message);
  }
}

runReview();