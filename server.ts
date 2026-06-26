import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Gemini API:", error);
  }
} else {
  console.log("GEMINI_API_KEY is not configured. Running AI Mentor in simulation fallback mode.");
}

// AI Mentor API Route
app.post("/api/gemini/mentor", async (req: express.Request, res: express.Response) => {
  const { messages, userProgress } = req.body;

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "Missing or invalid messages array." });
    return;
  }

  const lastMessage = messages[messages.length - 1]?.content;
  if (!lastMessage) {
    res.status(400).json({ error: "Last message is empty." });
    return;
  }

  // Construct context about the user's learning state
  const progressCtx = userProgress ? 
    `O usuário está no nível de programação com ${userProgress.xp || 0} XP, ofensiva de ${userProgress.streak || 0} dias, e estuda trilhas como ${userProgress.activeTrack || "HTML/CSS e JS"}.` : 
    `O usuário está iniciando na programação.`;

  const systemInstruction = `Você é o "DevBot", um mentor de programação simpático, focado e altamente motivador estilo o mascote do Duolingo.
Seu objetivo é ajudar o usuário a aprender desenvolvimento de software de forma simples, direta e encorajadora.
Dê explicações curtas, use metáforas de código, use blocos de código formatados com markdown e sugira analogias engraçadas.
Seja bilingue: responda no mesmo idioma em que o usuário falar (português ou inglês).
Sempre mantenha a resposta concisa (no máximo 3 parágrafos curtos) para caber bem em uma tela de chat de celular.
${progressCtx}`;

  // If Gemini client is active, try to fetch response
  if (ai) {
    try {
      // Map message history to Gemini format (user / model)
      const contents = messages.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "Desculpe, não consegui processar sua resposta no momento.";
      res.json({ content: responseText });
      return;
    } catch (err: any) {
      console.error("Gemini API generation failed, falling back to simulated response:", err);
    }
  }

  // Simulator fallback responses if API fails or key is missing
  setTimeout(() => {
    const promptLower = lastMessage.toLowerCase();
    let reply = "";

    if (promptLower.includes("erro") || promptLower.includes("bug")) {
      reply = `**Ah, o famoso Bug!** 🐞 Não se preocupe! Na programação, bugs são apenas lições disfarçadas. 

Tente estes passos:
1. Adicione \`console.log()\` em partes chave do código.
2. Verifique se não esqueceu de fechar chaves \`{}\` ou parênteses \`()\`.
3. Explique o código para um patinho de borracha! 

Qual é o erro que você está vendo? Envie o trecho do código para mim!`;
    } else if (promptLower.includes("javascript") || promptLower.includes("js")) {
      reply = `**JavaScript é a alma da Web!** 🌐 Com ele você dá vida, animações e interatividade para as páginas.

Por exemplo, um botão ganha superpoderes com:
\`\`\`javascript
const botao = document.querySelector('button');
botao.addEventListener('click', () => {
  alert('Você clicou em mim!');
});
\`\`\`
Quer praticar um pouco? Peça-me um minidesafio de JavaScript!`;
    } else if (promptLower.includes("python")) {
      reply = `**Python é elegante e super legível!** 🐍 Parece quase inglês! É excelente para inteligência artificial, dados e scripts rápidos.

Veja como é simples ler um arquivo:
\`\`\`python
with open("devlingo.txt") as arquivo:
    conteudo = arquivo.read()
    print("Suas lições concluídas!")
\`\`\`
Gostaria de ver um desafio em Python ou quer tirar alguma dúvida de sintaxe?`;
    } else if (promptLower.includes("sql")) {
      reply = `**SQL é a linguagem de conversar com bancos de dados!** 🗄️ Pense nela como fazer perguntas estruturadas a uma planilha super inteligente.

Para buscar todos os alunos com pontuação maior que 100:
\`\`\`sql
SELECT nome, xp FROM alunos
WHERE xp > 100
ORDER BY xp DESC;
\`\`\`
O que você quer pesquisar hoje? Vamos montar uma consulta juntos!`;
    } else if (promptLower.includes("html") || promptLower.includes("css")) {
      reply = `**HTML é o esqueleto 🦴 e CSS é a roupa estilosa 💅 de qualquer site!**

No HTML criamos a estrutura:
\`\`\`html
<div class="card">
  <h1>Aprenda Código</h1>
</div>
\`\`\`
E no CSS deixamos incrível:
\`\`\`css
.card {
  background: linear-gradient(135deg, #10b981, #3b82f6);
  border-radius: 12px;
  color: white;
}
\`\`\`
Qual elemento você quer estilizar hoje?`;
    } else {
      reply = `**Olá, Dev! Sou o DevBot, seu mentor no Duolingo de Programação!** 🚀

Que excelente ver você estudando hoje. Posso te ajudar com várias coisas:
1. Explicar qualquer conceito (loops, condicionais, POO, SQL, etc.).
2. Encontrar erros no seu código.
3. Criar um minidesafio interativo para testar seus conhecimentos.

Diga-me: em qual linguagem de programação você quer focar agora? (JavaScript, Python, SQL ou HTML/CSS)`;
    }

    res.json({ content: reply });
  }, 1000);
});

// Setup Vite Dev server / Production Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
