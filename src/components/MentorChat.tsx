import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, Sparkles, AlertCircle, Copy, Check, Terminal, Cpu } from "lucide-react";
import { ChatMessage, UserProgress, AppLanguage } from "../types";
import { playSound } from "../utils/audio";
import { APP_TRANSLATIONS } from "../data";

interface MentorChatProps {
  userProgress: UserProgress;
  language: AppLanguage;
  isOfflineMode: boolean;
}

const STARTER_PROMPTS = {
  pt: [
    "Explique o que é um array no JavaScript",
    "Me dê um minidesafio em Python!",
    "Como funciona a cláusula SELECT WHERE no SQL?",
    "Me dê dicas para não esquecer sintaxe",
  ],
  en: [
    "Explain what an array is in JavaScript",
    "Give me a quick Python mini-challenge!",
    "How does SELECT WHERE clause work in SQL?",
    "Give me tips to remember code syntax",
  ],
};

export const MentorChat: React.FC<MentorChatProps> = ({ userProgress, language, isOfflineMode }) => {
  const t = APP_TRANSLATIONS[language];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with greeting if empty
  useEffect(() => {
    // Try to load from localStorage
    const cached = localStorage.getItem("devlingo_mentor_chat");
    if (cached) {
      try {
        setMessages(JSON.parse(cached));
        return;
      } catch (e) {
        console.warn("Stale mentor chat cache.");
      }
    }

    const greeting = language === "pt"
      ? "Olá! Eu sou o **DevBot**, seu mentor de programação! 🚀 Estou pronto para te dar superpoderes em JavaScript, Python, SQL ou HTML/CSS.\n\nDiga-me: qual conceito você quer dominar hoje ou quer que eu te mande um minidesafio?"
      : "Hello! I'm **DevBot**, your coding mentor! 🚀 I'm ready to grant you superpowers in JavaScript, Python, SQL, or HTML/CSS.\n\nTell me: what concept do you want to master today, or should I send you a mini-challenge?";

    setMessages([
      {
        id: "greet",
        role: "model",
        content: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [language]);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // Cache chat history
    if (messages.length > 0) {
      localStorage.setItem("devlingo_mentor_chat", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    playSound("click");

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Call server API route `/api/gemini/mentor`
    try {
      const response = await fetch("/api/gemini/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          userProgress: userProgress,
        }),
      });

      const data = await response.json();
      setIsTyping(false);

      if (data && data.content) {
        playSound("notification");
        const botMsg: ChatMessage = {
          id: `msg-${Date.now()}-model`,
          role: "model",
          content: data.content,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error("No response content");
      }
    } catch (err) {
      console.error("AI Mentor api failed:", err);
      setIsTyping(false);
      playSound("error");

      // Appending a helpful offline message if they are offline or API crashed
      const errMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        role: "model",
        content: language === "pt"
          ? "Ops! Meu processador de inteligência artificial falhou ou você está offline. 🔌 Vamos focar no modo de contingência local!\n\nPratique as lições do mapa para ganhar mais XP e volte a falar comigo assim que estiver conectado!"
          : "Oops! My AI processor failed or you are offline. 🔌 Let's focus on local contingency!\n\nPractice lessons on the path to gain more XP and chat with me again as soon as you're connected!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errMsg]);
    }
  };

  // Quick helper to copy code blocks
  const copyToClipboard = (text: string, id: string) => {
    playSound("click");
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to render chat blocks with basic markdown formatting
  const renderMessageContent = (msg: ChatMessage) => {
    const parts = msg.content.split("```");
    return parts.map((part, index) => {
      const isCodeBlock = index % 2 === 1;

      if (isCodeBlock) {
        // Extract language if specified in first line
        const lines = part.split("\n");
        const codeLang = lines[0]?.trim() || "code";
        const codeText = lines.slice(1).join("\n").trim();

        return (
          <div key={index} className="my-3 border border-slate-800 rounded-xl overflow-hidden shadow-inner w-full">
            <div className="bg-slate-950/90 px-4 py-1.5 flex justify-between items-center text-[10px] text-slate-500 font-mono border-b border-slate-900 select-none">
              <span className="flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                {codeLang.toUpperCase()}
              </span>
              <button
                onClick={() => copyToClipboard(codeText, `${msg.id}-${index}`)}
                className="hover:text-emerald-400 cursor-pointer flex items-center gap-1 transition-all"
              >
                {copiedId === `${msg.id}-${index}` ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-slate-950 overflow-x-auto text-xs font-mono text-emerald-400 select-text leading-relaxed">
              <code>{codeText}</code>
            </pre>
          </div>
        );
      }

      // Format bold markdown **text**
      const textParts = part.split("**");
      return (
        <p key={index} className="whitespace-pre-wrap select-text leading-relaxed text-xs sm:text-sm">
          {textParts.map((tPart, tIdx) => {
            const isBold = tIdx % 2 === 1;
            return isBold ? <strong key={tIdx} className="text-emerald-300 font-extrabold">{tPart}</strong> : tPart;
          })}
        </p>
      );
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 h-full relative overflow-hidden">
      {/* Mentor header */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 shadow-md">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-1">
              DevBot
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/20" />
            </h3>
            <p className="text-[10px] text-slate-400">Mentor de Código Inteligente</p>
          </div>
        </div>

        {isOfflineMode && (
          <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold px-2.5 py-1 rounded-full animate-pulse">
            Local Contingency
          </span>
        )}
      </div>

      {/* Messages Scrolling Box */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 select-none">
        {messages.map((msg) => {
          const isModel = msg.role === "model";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isModel ? "justify-start" : "justify-end"}`}
            >
              {isModel && (
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">
                  🤖
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 border text-slate-100 ${
                  isModel
                    ? "bg-slate-900/60 border-slate-800"
                    : "bg-emerald-500 text-slate-950 border-emerald-400 font-medium"
                }`}
              >
                {renderMessageContent(msg)}
                <span
                  className={`text-[9px] block text-right mt-1.5 opacity-60 ${
                    isModel ? "text-slate-500" : "text-slate-900"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs shrink-0">
                🤖
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl px-4 py-3 flex items-center gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Footer input area */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-col gap-2 shrink-0 pb-16 sm:pb-3 select-none">
        {/* Starter suggestion chips (Show only when conversation is short) */}
        {messages.length < 5 && (
          <div className="flex gap-1.5 overflow-x-auto py-1 scrollbar-none no-scrollbar">
            {STARTER_PROMPTS[language].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-[10px] font-bold rounded-lg shrink-0 transition-all cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputText}
            disabled={isTyping}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.chatPlaceholder}
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="p-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl disabled:opacity-30 transition-all flex items-center justify-center cursor-pointer shadow-md shadow-emerald-500/10 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
