import { Track, Badge, ForumPost, FriendActivity, LeaderboardUser } from "./types";

export const APP_TRANSLATIONS = {
  pt: {
    title: "Duolingo de Programação",
    subtitle: "Aprenda código praticando 5 minutos por dia!",
    xp: "XP",
    coins: "Moedas",
    lives: "Vidas",
    streak: "Ofensiva",
    level: "Nível",
    shop: "Loja",
    forum: "Fórum",
    rankings: "Rankings",
    dashboard: "Progresso",
    settings: "Ajustes",
    offlineMode: "Modo Offline",
    offlineActive: "Você está no Modo Offline! Estudando localmente.",
    downloaded: "Cursos Baixados",
    downloadCourse: "Baixar Curso Offline",
    downloadSuccess: "Curso baixado com sucesso!",
    onlineMode: "Você voltou ao Modo Online!",
    startLesson: "Começar Lição",
    continue: "Continuar",
    check: "Verificar",
    correct: "Excelente trabalho!",
    incorrect: "Oops! Resposta incorreta.",
    explanation: "Explicação",
    loseHeart: "Você perdeu uma vida!",
    outOfLives: "Sem vidas! Visite a loja para recarregar ou espere.",
    refillLives: "Recarregar Vidas",
    buyShield: "Comprar Escudo de Ofensiva",
    shieldActive: "Escudo Ativo",
    cost: "Custo",
    unlocked: "Desbloqueado",
    locked: "Bloqueado",
    chooseLanguage: "Escolher Idioma",
    soundEffects: "Efeitos Sonoros",
    darkTheme: "Tema Escuro",
    themeClassic: "Clássico Claro",
    themeDark: "Meia-Noite Escuro",
    themeCyberpunk: "Cyberpunk Hacker",
    themeForest: "Floresta Verde",
    reminderTitle: "Agendar Lembrete de Estudo",
    addGoogleCalendar: "Adicionar à Google Agenda",
    badges: "Conquistas",
    exportData: "Exportar Dados",
    weeklyProgress: "Progresso Semanal",
    activeStreak: "Dias de Ofensiva Ativos",
    timeSpent: "Tempo de Estudo",
    accuracy: "Precisão Média",
    minutes: "min",
    communityForum: "Fórum da Comunidade",
    postQuestion: "Perguntar à Comunidade",
    comments: "Comentários",
    upvotes: "Curtidas",
    newPostTitle: "Título da Pergunta",
    newPostContent: "Conteúdo da sua dúvida...",
    submit: "Postar",
    aiMentor: "Mentor IA (DevBot)",
    chatPlaceholder: "Pergunte ao DevBot (ex: 'O que é um loop for?')",
    biometricTitle: "Autenticação Biométrica",
    biometricDesc: "Use impressão digital ou FaceID para login rápido.",
    cloudBackup: "Backup na Nuvem",
    cloudBackupDesc: "Salve seu progresso na nuvem e evite perder suas conquistas.",
    backupSuccess: "Progresso sincronizado com a Nuvem com sucesso!",
    friendsActivity: "Atividade dos Amigos",
    congratulate: "Parabenizar 🎉",
    congratulated: "Parabenizado!",
    globalLeaderboard: "Ranking Global",
    leagueName: "Liga",
    bronzeLeague: "Liga de Bronze",
    silverLeague: "Liga de Prata",
    goldLeague: "Liga de Ouro",
    diamondLeague: "Liga de Diamante",
    timerRanking: "Termina em: 3 dias 5 horas",
    promotionZone: "Zona de Promoção",
    demotionZone: "Zona de Rebaixamento",
    orientationToggle: "Girar Simulador",
    desktopMode: "Modo Monitor",
    mobileMode: "Modo Celular",
    mobileGuide: "Toque para alternar o simulador de celular! Melhore a experiência retrato adaptativo.",
    resetProgress: "Resetar Progresso",
  },
  en: {
    title: "Programming Duolingo",
    subtitle: "Learn code by practicing 5 minutes a day!",
    xp: "XP",
    coins: "Coins",
    lives: "Lives",
    streak: "Streak",
    level: "Level",
    shop: "Shop",
    forum: "Forum",
    rankings: "Rankings",
    dashboard: "Analytics",
    settings: "Settings",
    offlineMode: "Offline Mode",
    offlineActive: "You are in Offline Mode! Studying locally.",
    downloaded: "Downloaded Courses",
    downloadCourse: "Download Offline",
    downloadSuccess: "Course downloaded successfully!",
    onlineMode: "You're back online!",
    startLesson: "Start Lesson",
    continue: "Continue",
    check: "Check",
    correct: "Excellent job!",
    incorrect: "Oops! Incorrect answer.",
    explanation: "Explanation",
    loseHeart: "You lost a life!",
    outOfLives: "No lives left! Visit the shop to refill or wait.",
    refillLives: "Refill Lives",
    buyShield: "Buy Streak Freeze",
    shieldActive: "Shield Active",
    cost: "Cost",
    unlocked: "Unlocked",
    locked: "Locked",
    chooseLanguage: "Choose Language",
    soundEffects: "Sound Effects",
    darkTheme: "Dark Theme",
    themeClassic: "Classic Light",
    themeDark: "Midnight Dark",
    themeCyberpunk: "Cyberpunk Hacker",
    themeForest: "Forest Green",
    reminderTitle: "Schedule Study Reminder",
    addGoogleCalendar: "Add to Google Calendar",
    badges: "Achievements",
    exportData: "Export Data",
    weeklyProgress: "Weekly Progress",
    activeStreak: "Active Streak Days",
    timeSpent: "Study Time",
    accuracy: "Average Accuracy",
    minutes: "min",
    communityForum: "Community Forum",
    postQuestion: "Ask Community",
    comments: "Comments",
    upvotes: "Upvotes",
    newPostTitle: "Question Title",
    newPostContent: "Write your question here...",
    submit: "Post",
    aiMentor: "AI Mentor (DevBot)",
    chatPlaceholder: "Ask DevBot (e.g. 'What is a for loop?')",
    biometricTitle: "Biometric Authentication",
    biometricDesc: "Use fingerprint or FaceID for fast secure login.",
    cloudBackup: "Cloud Backup",
    cloudBackupDesc: "Back up your progress to the cloud to prevent data loss.",
    backupSuccess: "Progress backed up to cloud successfully!",
    friendsActivity: "Friends Activity",
    congratulate: "Congratulate 🎉",
    congratulated: "Congratulated!",
    globalLeaderboard: "Global Leaderboard",
    leagueName: "League",
    bronzeLeague: "Bronze League",
    silverLeague: "Silver League",
    goldLeague: "Gold League",
    diamondLeague: "Diamond League",
    timerRanking: "Ends in: 3 days 5 hours",
    promotionZone: "Promotion Zone",
    demotionZone: "Demotion Zone",
    orientationToggle: "Rotate Simulator",
    desktopMode: "Monitor Mode",
    mobileMode: "Mobile Mode",
    mobileGuide: "Click to toggle mobile simulator! Enjoy the portrait adaptive layout.",
    resetProgress: "Reset Progress",
  }
};

export const TRACKS_DATA: Track[] = [
  {
    id: "html-css",
    title: "HTML & CSS",
    description: "Estruture e estilize páginas web modernas.",
    color: "from-orange-500 to-red-500",
    icon: "Layout",
    lessons: [
      {
        id: "html-basics",
        trackId: "html-css",
        title: {
          pt: "Esqueleto da Web",
          en: "Skeleton of the Web"
        },
        description: {
          pt: "Aprenda as tags estruturais mais importantes como div, h1, p e button.",
          en: "Learn the most important structure tags like div, h1, p and button."
        },
        icon: "FileCode",
        xpReward: 20,
        coinReward: 10,
        exercises: [
          {
            id: "html-q1",
            type: "multiple-choice",
            question: {
              pt: "Qual elemento HTML é usado para definir o título principal de uma página?",
              en: "Which HTML element is used to define the main heading of a page?"
            },
            options: ["<h6>", "<h1>", "<title>", "<head>"],
            correctAnswer: "<h1>",
            explanation: {
              pt: "A tag <h1> define o cabeçalho mais importante do documento. As tags vão de h1 a h6 em ordem decrescente de importância.",
              en: "The <h1> tag defines the most important heading of the document. Headings range from h1 to h6 in decreasing importance."
            }
          },
          {
            id: "html-q2",
            type: "fill-blank",
            question: {
              pt: "Complete a tag para criar um botão com o texto 'Enviar':",
              en: "Complete the tag to create a button with the text 'Submit':"
            },
            codeSnippet: "<_BLANK_>Enviar</button>",
            options: ["button", "btn", "click", "input"],
            correctAnswer: "button",
            explanation: {
              pt: "A tag correta para criar um botão clicável nativo é <button>.",
              en: "The correct tag to create a native clickable button is <button>."
            }
          },
          {
            id: "html-q3",
            type: "order-code",
            question: {
              pt: "Ordene os blocos de tags para formar uma estrutura HTML básica válida:",
              en: "Order the blocks to form a valid basic HTML structure:"
            },
            options: ["<html>", "<body>", "<h1>Olá Mundo</h1>", "</body>", "</html>"],
            correctAnswer: "<html>,<body>,<h1>Olá Mundo</h1>,</body>,</html>",
            correctOrder: ["<html>", "<body>", "<h1>Olá Mundo</h1>", "</body>", "</html>"],
            explanation: {
              pt: "A tag <html> engloba todo o documento, o <body> contém os elementos visuais e as tags de conteúdo ficam dentro dele.",
              en: "The <html> tag wraps the entire document, <body> contains the visual elements, and content tags go inside."
            }
          }
        ]
      },
      {
        id: "css-basics",
        trackId: "html-css",
        title: {
          pt: "Estilo & Cores",
          en: "Style & Colors"
        },
        description: {
          pt: "Aprenda a aplicar cores, bordas, fontes e sombras usando seletores CSS.",
          en: "Learn to apply colors, borders, fonts and shadows using CSS selectors."
        },
        icon: "Palette",
        xpReward: 25,
        coinReward: 12,
        exercises: [
          {
            id: "css-q1",
            type: "multiple-choice",
            question: {
              pt: "Qual propriedade CSS muda a cor de fundo de um elemento?",
              en: "Which CSS property changes the background color of an element?"
            },
            options: ["color", "bg-color", "background-color", "border-color"],
            correctAnswer: "background-color",
            explanation: {
              pt: "A propriedade CSS 'background-color' é usada para pintar o fundo do elemento, enquanto 'color' muda a cor do texto.",
              en: "The CSS 'background-color' property is used to paint the element's background, while 'color' changes text color."
            }
          },
          {
            id: "css-q2",
            type: "find-error",
            question: {
              pt: "Encontre o erro de sintaxe nesta regra CSS:",
              en: "Find the syntax error in this CSS rule:"
            },
            codeSnippet: "p {\n  color: red\n  font-size: 16px;\n}",
            options: ["p {", "color: red", "font-size: 16px;", "}"],
            correctAnswer: "color: red",
            explanation: {
              pt: "Faltou um ponto-e-vírgula (;) no final da declaração 'color: red'. No CSS, todas as declarações devem ser terminadas por ponto-e-vírgula.",
              en: "A semicolon (;) is missing at the end of the 'color: red' declaration. In CSS, declarations must terminate with a semicolon."
            }
          },
          {
            id: "css-q3",
            type: "fill-blank",
            question: {
              pt: "Para aplicar estilos a um elemento que possui a classe 'destaque', qual caractere de seletor você deve usar?",
              en: "To apply styles to an element with class 'destaque', which selector character do you use?"
            },
            codeSnippet: "<_BLANK_>destaque {\n  font-weight: bold;\n}",
            options: [".", "#", "*", "@"],
            correctAnswer: ".",
            explanation: {
              pt: "O caractere ponto '.' é usado para selecionar classes. O caractere '#' é usado para IDs.",
              en: "The dot '.' character is used to select classes. The '#' character is used for IDs."
            }
          }
        ]
      }
    ]
  },
  {
    id: "javascript",
    title: "JavaScript & TS",
    description: "Crie inteligência e interatividade dinâmica.",
    color: "from-yellow-400 to-amber-500",
    icon: "Cpu",
    lessons: [
      {
        id: "js-vars",
        trackId: "javascript",
        title: {
          pt: "Constantes e Variáveis",
          en: "Variables & Constants"
        },
        description: {
          pt: "Domine a diferença entre let, const e tipos básicos de dados.",
          en: "Master the difference between let, const, and basic data types."
        },
        icon: "Variable",
        xpReward: 30,
        coinReward: 15,
        exercises: [
          {
            id: "js-v1",
            type: "multiple-choice",
            question: {
              pt: "Qual palavra-chave declara uma variável que não pode ser reatribuída no JavaScript?",
              en: "Which keyword declares a variable that cannot be reassigned in JavaScript?"
                },
            options: ["let", "const", "var", "immutable"],
            correctAnswer: "const",
            explanation: {
              pt: "'const' cria uma constante de escopo de bloco, cujo valor não pode ser alterado por reatribuição.",
              en: "'const' creates a block-scoped constant whose value cannot be changed via reassignment."
            }
          },
          {
            id: "js-v2",
            type: "fill-blank",
            question: {
              pt: "Complete a declaração para retornar a soma dos dois números:",
              en: "Complete the statement to return the sum of the two numbers:"
            },
            codeSnippet: "function somar(a, b) {\n  <_BLANK_> a + b;\n}",
            options: ["return", "get", "send", "give"],
            correctAnswer: "return",
            explanation: {
              pt: "A palavra-chave 'return' finaliza a execução de uma função e retorna um valor para quem a chamou.",
              en: "The 'return' keyword terminates function execution and returns a value to the caller."
            }
          },
          {
            id: "js-v3",
            type: "find-error",
            question: {
              pt: "Encontre a linha que causará um erro devido à reatribuição proibida:",
              en: "Find the line that causes an error due to prohibited reassignment:"
            },
            codeSnippet: "const nome = 'Dev';\nlet idade = 20;\nnome = 'Duolingo';\nidade = 21;",
            options: ["const nome = 'Dev';", "let idade = 20;", "nome = 'Duolingo';", "idade = 21;"],
            correctAnswer: "nome = 'Duolingo';",
            explanation: {
              pt: "Como 'nome' foi declarado com 'const', reatribuir um novo valor para ele causará um TypeError.",
              en: "Since 'nome' was declared with 'const', reassigning a new value to it will cause a TypeError."
            }
          }
        ]
      },
      {
        id: "js-arrays",
        trackId: "javascript",
        title: {
          pt: "Coleções de Dados (Arrays)",
          en: "Data Collections (Arrays)"
        },
        description: {
          pt: "Aprenda a agrupar dados em listas de forma organizada.",
          en: "Learn to group data in organized lists."
        },
        icon: "ListFilter",
        xpReward: 35,
        coinReward: 18,
        exercises: [
          {
            id: "js-a1",
            type: "multiple-choice",
            question: {
              pt: "Como se acessa o primeiro elemento de um array chamado 'linguagens'?",
              en: "How do you access the first element of an array named 'linguagens'?"
            },
            options: ["linguagens[0]", "linguagens[1]", "linguagens.first()", "linguagens.get(1)"],
            correctAnswer: "linguagens[0]",
            explanation: {
              pt: "No JavaScript e na maioria das linguagens, os arrays possuem índices baseados em zero. Portanto, o primeiro elemento fica no índice 0.",
              en: "In JavaScript and most languages, arrays are zero-indexed. Thus, the first element sits at index 0."
            }
          },
          {
            id: "js-a2",
            type: "fill-blank",
            question: {
              pt: "Complete para descobrir o tamanho de uma lista usando JavaScript:",
              en: "Complete to find out the size of a list using JavaScript:"
            },
            codeSnippet: "const linguagens = ['JS', 'Python'];\nconst total = linguagens.<_BLANK_>;",
            options: ["length", "size", "count", "length()"],
            correctAnswer: "length",
            explanation: {
              pt: "A propriedade '.length' retorna o número de elementos de um array.",
              en: "The '.length' property returns the number of elements in an array."
            }
          }
        ]
      }
    ]
  },
  {
    id: "python",
    title: "Python 🐍",
    description: "Sintaxe limpa, scripts e ciência de dados.",
    color: "from-blue-500 to-emerald-500",
    icon: "Binary",
    lessons: [
      {
        id: "py-intro",
        trackId: "python",
        title: {
          pt: "O Toque da Serpente",
          en: "The Snake's Touch"
        },
        description: {
          pt: "Aprenda indentação correta, o comando print e tipos em Python.",
          en: "Learn correct indentation, the print command and types in Python."
        },
        icon: "Terminal",
        xpReward: 30,
        coinReward: 15,
        exercises: [
          {
            id: "py-i1",
            type: "multiple-choice",
            question: {
              pt: "Como se define uma função em Python?",
              en: "How is a function defined in Python?"
            },
            options: ["function minha_funcao():", "def minha_funcao():", "void minha_funcao()", "create minha_funcao():"],
            correctAnswer: "def minha_funcao():",
            explanation: {
              pt: "Em Python, usamos a palavra-chave 'def' para definir funções, seguidas de parênteses e dois pontos (:).",
              en: "In Python, we use the 'def' keyword to define functions, followed by parentheses and a colon (:)."
            }
          },
          {
            id: "py-i2",
            type: "fill-blank",
            question: {
              pt: "Complete o comando para exibir 'Hello Dev' na tela:",
              en: "Complete the command to output 'Hello Dev' to screen:"
            },
            codeSnippet: "<_BLANK_>('Hello Dev')",
            options: ["print", "echo", "console.log", "printf"],
            correctAnswer: "print",
            explanation: {
              pt: "O comando nativo do Python para saídas de console é 'print()'.",
              en: "The native Python command for console outputs is 'print()'."
            }
          },
          {
            id: "py-i3",
            type: "order-code",
            question: {
              pt: "Ordene o bloco condicional obedecendo à indentação correta em Python:",
              en: "Order the conditional block obeying proper indentation in Python:"
            },
            options: ["if nota >= 7:", "    print('Aprovado')", "else:", "    print('Estude mais')"],
            correctAnswer: "if nota >= 7:,    print('Aprovado'),else:,    print('Estude mais')",
            correctOrder: ["if nota >= 7:", "    print('Aprovado')", "else:", "    print('Estude mais')"],
            explanation: {
              pt: "Em Python, blocos de código são definidos pelo nível de recuo (indentação), geralmente 4 espaços.",
              en: "In Python, code blocks are defined by their indentation level, typically 4 spaces."
            }
          }
        ]
      }
    ]
  },
  {
    id: "sql",
    title: "SQL",
    description: "Comande e extraia dados como um cientista.",
    color: "from-purple-500 to-indigo-600",
    icon: "Database",
    lessons: [
      {
        id: "sql-select",
        trackId: "sql",
        title: {
          pt: "Consultas SELECT",
          en: "SELECT Queries"
        },
        description: {
          pt: "Aprenda a pesquisar, filtrar e ordenar tabelas inteiras de dados.",
          en: "Learn to query, filter and order entire database tables."
        },
        icon: "Search",
        xpReward: 35,
        coinReward: 20,
        exercises: [
          {
            id: "sql-s1",
            type: "multiple-choice",
            question: {
              pt: "Qual cláusula SQL é usada para filtrar linhas de um resultado?",
              en: "Which SQL clause is used to filter rows of a result set?"
            },
            options: ["FILTER", "WHERE", "HAVING", "LIMIT"],
            correctAnswer: "WHERE",
            explanation: {
              pt: "A cláusula 'WHERE' filtra registros de acordo com uma condição lógica específica.",
              en: "The 'WHERE' clause filters records based on a specific logical condition."
            }
          },
          {
            id: "sql-s2",
            type: "fill-blank",
            question: {
              pt: "Selecione todas as colunas da tabela 'usuarios':",
              en: "Select all columns from the 'usuarios' table:"
            },
            codeSnippet: "SELECT <_BLANK_> FROM usuarios;",
            options: ["*", "ALL", "colunas", "rows"],
            correctAnswer: "*",
            explanation: {
              pt: "O asterisco '*' é um atalho que significa 'todas as colunas' no padrão SQL.",
              en: "The asterisk '*' is a wildcard meaning 'all columns' in the SQL standard."
            }
          }
        ]
      }
    ]
  }
];

export const BADGES_DATA: Badge[] = [
  {
    id: "badge-first",
    title: { pt: "Primeira Compilação 🚀", en: "First Compile 🚀" },
    description: { pt: "Completou a primeira lição com sucesso.", en: "Completed the first lesson successfully." },
    icon: "Zap",
    unlockedAtXp: 10
  },
  {
    id: "badge-streak-3",
    title: { pt: "Comprometimento Cósmico 🔥", en: "Cosmic Commitment 🔥" },
    description: { pt: "Manteve 3 dias seguidos de ofensiva de estudos.", en: "Maintained a 3-day study streak." },
    icon: "Flame",
    unlockedAtXp: 50
  },
  {
    id: "badge-fullstack",
    title: { pt: "Mestre Fullstack 👑", en: "Fullstack Master 👑" },
    description: { pt: "Alcançou mais de 150 XP acumulados de puro código.", en: "Gained over 150 accumulated XP." },
    icon: "Award",
    unlockedAtXp: 150
  },
  {
    id: "shield-buyer",
    title: { pt: "Escudo Blindado 🛡️", en: "Armored Shield 🛡️" },
    description: { pt: "Comprou um escudo de proteção na loja virtual.", en: "Purchased a streak freeze from the store." },
    icon: "ShieldAlert"
  },
  {
    id: "badge-night-owl",
    title: { pt: "Hacker da Noite 🦉", en: "Night Owl Hacker 🦉" },
    description: { pt: "Comprou a skin Cyberpunk para a interface.", en: "Purchased the Cyberpunk interface skin." },
    icon: "Moon"
  }
];

export const LEADERBOARD_MOCKS: Record<string, LeaderboardUser[]> = {
  bronze: [
    { rank: 1, name: "Lucas Dev", avatar: "👤", xp: 120, title: "HTML Padawan" },
    { rank: 2, name: "Mariana JS", avatar: "👩‍💻", xp: 95, title: "CSS Stylist" },
    { rank: 3, name: "Estudante Código", avatar: "🤖", xp: 75, isCurrentUser: true, title: "Iniciante" },
    { rank: 4, name: "TechGuru", avatar: "👾", xp: 60, title: "Bug Finder" },
    { rank: 5, name: "Alex Python", avatar: "🐍", xp: 40, title: "Script Kid" }
  ],
  silver: [
    { rank: 1, name: "Nerd dos Dados", avatar: "🤓", xp: 250, title: "SQL Specialist" },
    { rank: 2, name: "Ana Lovelace", avatar: "🧙‍♀️", xp: 210, title: "Algorithmist" },
    { rank: 3, name: "Estudante Código", avatar: "🤖", xp: 175, isCurrentUser: true, title: "JS Scribbler" },
    { rank: 4, name: "GigaByte", avatar: "💾", xp: 140, title: "Bit Shifter" },
    { rank: 5, name: "Gabriel CSS", avatar: "🎨", xp: 110, title: "Flexbox Lord" }
  ],
  gold: [
    { rank: 1, name: "Stack Overflow Fan", avatar: "🚀", xp: 450, title: "Senior Copy Paster" },
    { rank: 2, name: "Bora Codar", avatar: "🔥", xp: 400, title: "No Sleep Dev" },
    { rank: 3, name: "Estudante Código", avatar: "🤖", xp: 350, isCurrentUser: true, title: "React Sorcerer" },
    { rank: 4, name: "C-Sharp Shooter", avatar: "🎯", xp: 300, title: "Pointer Pointer" }
  ],
  diamond: [
    { rank: 1, name: "Linus Torvalds Junior", avatar: "👑", xp: 820, title: "Kernel Builder" },
    { rank: 2, name: "Satoshi Code", avatar: "🪙", xp: 780, title: "Block Miner" },
    { rank: 3, name: "Estudante Código", avatar: "🤖", xp: 520, isCurrentUser: true, title: "Software Architect" },
    { rank: 4, name: "Ada Lovelace clone", avatar: "🌌", xp: 490, title: "Mathematician" }
  ]
};

export const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: "post-1",
    author: "Alice Code",
    avatar: "👩‍🚀",
    title: "Como funciona um loop 'for' no JavaScript na prática?",
    content: "Eu sempre confundo as três partes do loop: `for(let i=0; i<10; i++)`. Alguém pode me explicar o que acontece em cada passo com uma metáfora do mundo real?",
    category: "JS",
    upvotes: 32,
    commentsCount: 2,
    createdAt: "há 2 horas",
    comments: [
      {
        id: "c1",
        author: "Hacker Sênior",
        avatar: "👴",
        content: "Imagine que você é um atleta correndo voltas em uma pista! 🏃‍♂️\n1. `let i = 0` é você se preparando na largada (sua volta é 0).\n2. `i < 10` é o juiz olhando e dizendo: 'Você ainda não deu 10 voltas? Se sim, continue correndo!'.\n3. `i++` é você cruzando a linha e adicionando 1 volta no seu marcador. Simples assim!",
        createdAt: "há 1 hora"
      },
      {
        id: "c2",
        author: "Ana Lovelace",
        avatar: "🧙‍♀️",
        content: "Excelente analogia! Salvou meus estudos!",
        createdAt: "há 30 minutos"
      }
    ]
  },
  {
    id: "post-2",
    author: "SQL Ninja",
    avatar: "🥷",
    title: "Dica de SQL: Qual a diferença de INNER JOIN e LEFT JOIN?",
    content: "Muitos iniciantes quebram a cabeça nisso. Em suma:\n- **INNER JOIN**: Traz apenas os registros que batem em AMBAS as tabelas.\n- **LEFT JOIN**: Traz TUDO da tabela da esquerda, e os dados que coincidirem da direita (se não bater, vem NULL). Espero ter ajudado!",
    category: "SQL",
    upvotes: 45,
    commentsCount: 1,
    createdAt: "há 5 horas",
    comments: [
      {
        id: "c3",
        author: "Gabriel CSS",
        avatar: "🎨",
        content: "Muito esclarecedor! Esse diagrama mental de Venn ajuda demais.",
        createdAt: "há 3 horas"
      }
    ]
  }
];

export const MOCK_FRIENDS_ACTIVITIES: FriendActivity[] = [
  {
    id: "act-1",
    name: "Lucas Dev",
    avatar: "👤",
    achievement: {
      pt: "Completou a lição de 'Esqueleto da Web' no HTML!",
      en: "Completed the 'Skeleton of the Web' lesson in HTML!"
    },
    time: "há 12m"
  },
  {
    id: "act-2",
    name: "Ana Lovelace",
    avatar: "🧙‍♀️",
    achievement: {
      pt: "Alcançou uma ofensiva de estudos de 7 dias!",
      en: "Reached a 7-day study streak!"
    },
    time: "há 1h"
  },
  {
    id: "act-3",
    name: "TechGuru",
    avatar: "👾",
    achievement: {
      pt: "Ficou em 1º lugar na Liga de Bronze!",
      en: "Won 1st place in the Bronze League!"
    },
    time: "há 3h"
  }
];
