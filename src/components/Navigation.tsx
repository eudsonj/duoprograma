import React from "react";
import { BookOpen, Trophy, MessageSquare, Users, ShoppingBag, BarChart2, Settings, Flame, Heart, Coins, Globe2 } from "lucide-react";
import { AppLanguage, UserProgress } from "../types";
import { APP_TRANSLATIONS } from "../data";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProgress: UserProgress;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  isMobileSimulated: boolean;
  isPortrait: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  userProgress,
  language,
  setLanguage,
  isMobileSimulated,
  isPortrait,
}) => {
  const t = APP_TRANSLATIONS[language];

  // Tab configurations
  const menuItems = [
    { id: "learn", label: t.title.split(" ")[0] || "Aprender", icon: BookOpen },
    { id: "dashboard", label: t.dashboard, icon: BarChart2 },
    { id: "rankings", label: t.rankings, icon: Trophy },
    { id: "mentor", label: t.aiMentor, icon: MessageSquare },
    { id: "forum", label: t.forum, icon: Users },
    { id: "shop", label: t.shop, icon: ShoppingBag },
    { id: "settings", label: t.settings, icon: Settings },
  ];

  // Helper to get active styles
  const getTabStyles = (id: string) => {
    if (activeTab === id) {
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30 font-bold shadow-[0_0_15px_rgba(99,102,241,0.15)]";
    }
    return "text-slate-400 hover:bg-white/5 hover:text-slate-200 border-transparent";
  };

  const isCompactMobile = isMobileSimulated && isPortrait;

  // Render Stats Header (lives, coins, streak, language switch)
  const renderStatsHeader = () => (
    <div className="flex items-center justify-between px-4 py-3 bg-[#07091d] border-b border-indigo-900/30 text-sm">
      {/* Language Toggle */}
      <button
        onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
        className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-950/40 hover:bg-indigo-900/50 text-slate-300 rounded-full border border-indigo-800/30 text-xs font-semibold cursor-pointer transition-all"
        title={t.chooseLanguage}
      >
        <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
        <span>{language === "pt" ? "BR" : "EN"}</span>
      </button>

      {/* Stats indicators */}
      <div className="flex items-center gap-3.5 font-bold">
        {/* Streak indicator */}
        <div className="flex items-center gap-1.5 text-amber-500" title={t.streak}>
          <Flame className="w-4 h-4 fill-amber-500/20" />
          <span>{userProgress.streak}</span>
        </div>

        {/* Coins indicator */}
        <div className="flex items-center gap-1.5 text-yellow-400" title={t.coins}>
          <Coins className="w-4 h-4 fill-yellow-500/20" />
          <span>{userProgress.coins}</span>
        </div>

        {/* Lives indicator */}
        <div className="flex items-center gap-1.5 text-red-500" title={t.lives}>
          <Heart className="w-4 h-4 fill-red-500/20 animate-pulse" />
          <span>{userProgress.lives}/{userProgress.maxLives}</span>
        </div>
      </div>
    </div>
  );

  if (isCompactMobile) {
    /* Compact Portrait Simulator Layout: Mobile bottom bar navigation & top stats header */
    return (
      <div className="flex flex-col border-b border-slate-800">
        {renderStatsHeader()}

        {/* Bottom tab bar (Will sit sticky at bottom of viewport) */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0f33]/95 backdrop-blur border-t border-indigo-900/30 flex justify-around py-1.5 px-2 select-none h-14">
          {menuItems.slice(0, 6).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition-all cursor-pointer ${
                  isActive ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "scale-110 text-indigo-400 fill-indigo-500/10" : ""}`} />
                <span className="text-[10px] mt-0.5 font-medium tracking-tight truncate max-w-[60px]">
                  {item.label}
                </span>
              </button>
            );
          })}
          {/* Settings Tab on mobile */}
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === "settings" ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <Settings className={`w-5 h-5 ${activeTab === "settings" ? "scale-110 text-indigo-400" : ""}`} />
            <span className="text-[10px] mt-0.5 font-medium tracking-tight">
              {t.settings}
            </span>
          </button>
        </div>
      </div>
    );
  }

  /* Desktop Sidebar (for non-simulated desktop or landscape simulation) */
  return (
    <div className="w-64 bg-[#07091d] border-r border-indigo-900/30 flex flex-col justify-between h-full select-none shrink-0">
      <div className="flex flex-col">
        {/* Brand Logo Header */}
        <div className="p-6 border-b border-indigo-900/20 flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-violet-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-white leading-tight tracking-tight">DevLingo</h2>
            <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">Code Academy</p>
          </div>
        </div>

        {/* User Stats Snapshot Widget */}
        <div className="p-4 mx-4 my-4 bg-indigo-950/20 border border-indigo-900/40 rounded-xl relative overflow-hidden">
          {/* Subtle glow sphere */}
          <div className="absolute -right-6 -top-6 w-16 h-16 bg-indigo-500/10 blur-xl rounded-full"></div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span>{userProgress.title || "Junior Developer"}</span>
            <span className="text-indigo-400">{userProgress.xp} XP</span>
          </div>
          {/* XP Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 shadow-[0_0_8px_#6366f1] rounded-full transition-all" 
              style={{ width: `${Math.min(100, (userProgress.xp % 100))}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between mt-3 text-sm">
            <div className="flex items-center gap-1 text-amber-500 font-bold" title={t.streak}>
              <Flame className="w-4 h-4 fill-amber-500/20" />
              <span>{userProgress.streak} d</span>
            </div>
            <div className="flex items-center gap-1 text-yellow-400 font-bold" title={t.coins}>
              <Coins className="w-4 h-4 fill-yellow-500/20" />
              <span>{userProgress.coins}</span>
            </div>
            <div className="flex items-center gap-1 text-red-500 font-bold" title={t.lives}>
              <Heart className="w-4 h-4 fill-red-500/20 animate-pulse" />
              <span>{userProgress.lives}/{userProgress.maxLives}</span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl border transition-all cursor-pointer ${getTabStyles(
                  item.id
                )}`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Language Switch Footer */}
      <div className="p-4 border-t border-indigo-900/20 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">Idioma / Language:</span>
        <button
          onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-950/40 hover:bg-indigo-900/50 text-white rounded-lg border border-indigo-800/40 font-bold cursor-pointer transition-all"
        >
          <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>{language === "pt" ? "Português" : "English"}</span>
        </button>
      </div>
    </div>
  );
};
