import React from "react";
import { Coins, Heart, ShieldAlert, Sparkles, Moon, Sun, Trees, Laptop, Check } from "lucide-react";
import { UserProgress, AppLanguage, AppTheme } from "../types";
import { playSound } from "../utils/audio";
import { APP_TRANSLATIONS } from "../data";

interface ShopProps {
  userProgress: UserProgress;
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  language: AppLanguage;
}

export const Shop: React.FC<ShopProps> = ({ userProgress, setUserProgress, language }) => {
  const t = APP_TRANSLATIONS[language];

  const handleRefillLives = () => {
    if (userProgress.lives >= userProgress.maxLives) {
      playSound("error");
      alert(language === "pt" ? "Suas vidas já estão cheias!" : "Your lives are already full!");
      return;
    }

    if (userProgress.coins >= 100) {
      playSound("coin");
      setUserProgress((prev) => ({
        ...prev,
        coins: prev.coins - 100,
        lives: prev.maxLives,
      }));
    } else {
      playSound("error");
      alert(language === "pt" ? "Moedas insuficientes!" : "Insufficient coins!");
    }
  };

  const handleBuyShield = () => {
    if (userProgress.hasShield) {
      playSound("error");
      alert(language === "pt" ? "Você já possui um escudo ativo!" : "You already have an active shield!");
      return;
    }

    if (userProgress.coins >= 150) {
      playSound("shield");
      setUserProgress((prev) => ({
        ...prev,
        coins: prev.coins - 150,
        hasShield: true,
        badges: prev.badges.includes("shield-buyer") ? prev.badges : [...prev.badges, "shield-buyer"],
      }));
    } else {
      playSound("error");
      alert(language === "pt" ? "Moedas insuficientes!" : "Insufficient coins!");
    }
  };

  const handleBuyTheme = (theme: AppTheme, cost: number) => {
    // If already owned / free, just select it
    if (userProgress.theme === theme) return;

    const ownedThemesKey = "owned_devlingo_themes";
    let ownedThemes = ["light", "dark"];
    const cached = localStorage.getItem(ownedThemesKey);
    if (cached) {
      ownedThemes = JSON.parse(cached);
    }

    if (ownedThemes.includes(theme)) {
      playSound("click");
      setUserProgress((prev) => ({ ...prev, theme }));
      return;
    }

    // Purchase
    if (userProgress.coins >= cost) {
      playSound("level-up");
      ownedThemes.push(theme);
      localStorage.setItem(ownedThemesKey, JSON.stringify(ownedThemes));

      setUserProgress((prev) => ({
        ...prev,
        coins: prev.coins - cost,
        theme: theme,
        badges: theme === "cyberpunk" && !prev.badges.includes("badge-night-owl") 
          ? [...prev.badges, "badge-night-owl"] 
          : prev.badges,
      }));
    } else {
      playSound("error");
      alert(language === "pt" ? "Moedas insuficientes!" : "Insufficient coins!");
    }
  };

  const checkThemeOwned = (theme: AppTheme) => {
    if (theme === "light" || theme === "dark") return true;
    const cached = localStorage.getItem("owned_devlingo_themes");
    if (cached) {
      const owned = JSON.parse(cached);
      return owned.includes(theme);
    }
    return false;
  };

  const themesList = [
    { id: "light" as AppTheme, name: t.themeClassic, cost: 0, icon: Sun, color: "bg-white text-slate-950 border-slate-300" },
    { id: "dark" as AppTheme, name: t.themeDark, cost: 0, icon: Moon, color: "bg-slate-900 text-slate-100 border-slate-800" },
    { id: "cyberpunk" as AppTheme, name: t.themeCyberpunk, cost: 200, icon: Laptop, color: "bg-black text-yellow-400 border-yellow-500/40" },
    { id: "forest" as AppTheme, name: t.themeForest, cost: 150, icon: Trees, color: "bg-emerald-950 text-emerald-100 border-emerald-800" },
  ];

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6 pb-20 select-none">
      {/* Coin Balance Banner */}
      <div className="bg-slate-950 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between shadow-md">
        <div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Seu Saldo / Balance</h3>
          <div className="flex items-center gap-2.5 mt-1">
            <Coins className="w-7 h-7 text-yellow-400 fill-yellow-400/20" />
            <span className="text-3xl font-black text-white">{userProgress.coins}</span>
            <span className="text-xs text-slate-400 font-semibold">Moedas ganhas programando</span>
          </div>
        </div>

        <span className="text-xs bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl font-bold text-slate-300">
          Super Loja
        </span>
      </div>

      {/* Interactive Powerups Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Powerups de Estudo</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Refill lives */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-rose-500/10 rounded-xl border border-rose-500/20 flex items-center justify-center text-rose-500">
                <Heart className="w-6 h-6 fill-rose-500/10 animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">{t.refillLives}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Preencha seus corações instantaneamente para estudar mais.
                </p>
              </div>
            </div>

            <button
              onClick={handleRefillLives}
              disabled={userProgress.lives >= userProgress.maxLives}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                userProgress.lives >= userProgress.maxLives
                  ? "bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed shadow-none"
                  : "bg-yellow-400 hover:bg-yellow-300 text-slate-950"
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>100</span>
            </button>
          </div>

          {/* Streak Freeze Shield */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-center justify-center text-amber-500">
                <ShieldAlert className="w-6 h-6 fill-amber-500/10" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">{t.buyShield}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Protege sua ofensiva diária se você esquecer de estudar amanhã.
                </p>
              </div>
            </div>

            <button
              onClick={handleBuyShield}
              disabled={userProgress.hasShield}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                userProgress.hasShield
                  ? "bg-slate-900 border border-slate-800 text-emerald-400 font-bold shadow-none"
                  : "bg-yellow-400 hover:bg-yellow-300 text-slate-950"
              }`}
            >
              {userProgress.hasShield ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{t.shieldActive}</span>
                </>
              ) : (
                <>
                  <Coins className="w-3.5 h-3.5" />
                  <span>150</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* App Skins / Customs themes store */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Skins de Interface (Temas)</h3>
          <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md text-emerald-400 font-semibold uppercase">
            Aplica-se Instantaneamente
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {themesList.map((themeItem) => {
            const ThemeIcon = themeItem.icon;
            const isOwned = checkThemeOwned(themeItem.id);
            const isActive = userProgress.theme === themeItem.id;

            return (
              <div
                key={themeItem.id}
                className={`border rounded-2xl p-4 flex flex-col justify-between h-[150px] relative transition-all ${
                  isActive ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-950" : ""
                } ${themeItem.color}`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <ThemeIcon className="w-6 h-6 stroke-[2.5]" />
                    {isActive && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full uppercase border border-emerald-500/20">
                        Ativo
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-sm mt-3.5">{themeItem.name}</h4>
                </div>

                <div className="pt-2 border-t border-current/10 flex justify-between items-center">
                  <span className="text-[10px] opacity-80 font-bold">
                    {isOwned ? "Liberado" : `Preço: ${themeItem.cost}`}
                  </span>

                  <button
                    onClick={() => handleBuyTheme(themeItem.id, themeItem.cost)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                      isActive
                        ? "bg-transparent border border-current/30 text-current cursor-not-allowed font-semibold opacity-50"
                        : isOwned
                        ? "bg-slate-950 text-white hover:bg-slate-900 border border-slate-800"
                        : "bg-yellow-400 hover:bg-yellow-300 text-slate-950"
                    }`}
                  >
                    {isActive ? (
                      "Ativado"
                    ) : isOwned ? (
                      "Aplicar"
                    ) : (
                      <span className="flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" />
                        {themeItem.cost}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Developer Titles Store section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Cargos / Títulos de Perfil</h3>

        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl divide-y divide-slate-900">
          <div className="p-4 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-sm text-white">Fullstack Wizard 🧙‍♂️</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Seu perfil será rotulado como um mago do código.</p>
            </div>
            <button
              onClick={() => {
                playSound("click");
                setUserProgress((prev) => ({ ...prev, title: "Fullstack Wizard 🧙‍♂️" }));
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                userProgress.title === "Fullstack Wizard 🧙‍♂️"
                  ? "bg-slate-900 border border-slate-800 text-emerald-400"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              {userProgress.title === "Fullstack Wizard 🧙‍♂️" ? "Selecionado" : "Equipar"}
            </button>
          </div>

          <div className="p-4 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-sm text-white">Pythonista Sênior 🐍</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Seu perfil será rotulado como mestre das serpentes Python.</p>
            </div>
            <button
              onClick={() => {
                playSound("click");
                setUserProgress((prev) => ({ ...prev, title: "Pythonista Sênior 🐍" }));
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                userProgress.title === "Pythonista Sênior 🐍"
                  ? "bg-slate-900 border border-slate-800 text-emerald-400"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              {userProgress.title === "Pythonista Sênior 🐍" ? "Selecionado" : "Equipar"}
            </button>
          </div>

          <div className="p-4 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-sm text-white">SQL Mastermind 🗄️</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Seu perfil será rotulado como o mestre supremo das consultas SQL.</p>
            </div>
            <button
              onClick={() => {
                playSound("click");
                setUserProgress((prev) => ({ ...prev, title: "SQL Mastermind 🗄️" }));
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                userProgress.title === "SQL Mastermind 🗄️"
                  ? "bg-slate-900 border border-slate-800 text-emerald-400"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              {userProgress.title === "SQL Mastermind 🗄️" ? "Selecionado" : "Equipar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
