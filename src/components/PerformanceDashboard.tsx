import React from "react";
import { Award, Zap, Heart, Calendar, FileSpreadsheet, FileText, CheckCircle2, ChevronRight, Clock, Star } from "lucide-react";
import { UserProgress, Badge, AppLanguage } from "../types";
import { BADGES_DATA, APP_TRANSLATIONS } from "../data";
import { playSound } from "../utils/audio";

interface PerformanceDashboardProps {
  userProgress: UserProgress;
  language: AppLanguage;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ userProgress, language }) => {
  const t = APP_TRANSLATIONS[language];

  // Simulated Weekly XP data
  const weeklyXp = [
    { day: "Seg", xp: 30 },
    { day: "Ter", xp: 45 },
    { day: "Qua", xp: 10 },
    { day: "Qui", xp: 0 },
    { day: "Sex", xp: 60 },
    { day: "Sáb", xp: 25 },
    { day: "Dom", xp: Math.min(100, userProgress.xp % 100) }, // link to user progress
  ];

  const maxVal = Math.max(...weeklyXp.map((w) => w.xp)) || 60;

  // CSV Exporter
  const handleExportCSV = () => {
    playSound("click");
    try {
      const csvContent = "data:text/csv;charset=utf-8," + [
        ["Metrica", "Valor"],
        ["XP Total", userProgress.xp],
        ["Moedas de Ouro", userProgress.coins],
        ["Ofensiva de Estudos (Dias)", userProgress.streak],
        ["Recorde de Ofensiva (Dias)", userProgress.maxStreak],
        ["Vidas Atuais", `${userProgress.lives}/${userProgress.maxLives}`],
        ["Escudo de Proteção Ativo", userProgress.hasShield ? "Sim" : "Não"],
        ["Cursos Baixados Offline", userProgress.offlineCoursesDownloaded.length],
        ["Tema de Interface Ativo", userProgress.theme],
        ["Título de Perfil", userProgress.title || "Junior Developer"],
        ["Horário de Lembrete Diário", userProgress.reminderTime || "19:00"]
      ].map(e => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `devlingo_progresso_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert("Falha ao exportar CSV.");
    }
  };

  // PDF Exporter (Simulated trigger PDF print layout or beautiful visual preview)
  const handleExportPDF = () => {
    playSound("click");
    window.print(); // Native print trigger which parses page layout beautifully for PDF export!
  };

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6 pb-20 select-none">
      {/* Dynamic Header Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total XP Card */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 shadow-md">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Zap className="w-5 h-5 fill-emerald-500/10" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">XP Acumulado</span>
            <p className="text-xl font-black text-white mt-0.5">{userProgress.xp} XP</p>
          </div>
        </div>

        {/* Current streak card */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 shadow-md">
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{t.activeStreak}</span>
            <p className="text-xl font-black text-white mt-0.5">{userProgress.streak} {language === "pt" ? "Dias" : "Days"}</p>
          </div>
        </div>

        {/* Study Time */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 shadow-md">
          <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{t.timeSpent}</span>
            <p className="text-xl font-black text-white mt-0.5">
              {Math.max(5, Math.floor(userProgress.xp / 4))} {t.minutes}
            </p>
          </div>
        </div>

        {/* Average Accuracy */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 shadow-md">
          <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{t.accuracy}</span>
            <p className="text-xl font-black text-white mt-0.5">
              {userProgress.xp > 0 ? "92%" : "0%"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Chart Container (2/3 width) */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-sm text-white">{t.weeklyProgress}</h3>
              <p className="text-[10px] text-slate-400">XP obtido nos últimos 7 dias de estudo</p>
            </div>

            <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400 font-bold uppercase">
              Semana Atual
            </span>
          </div>

          {/* Handcrafted fluid Vector SVG Chart */}
          <div className="h-44 flex items-end justify-between gap-2.5 px-2.5 pt-4">
            {weeklyXp.map((item, idx) => {
              const barHeightPercent = (item.xp / maxVal) * 80 + 10; // offset
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  {/* Floating value tag on hover */}
                  <span className="text-[9px] font-extrabold text-emerald-400 opacity-90">{item.xp}</span>

                  {/* Render dynamic SVG rectangle block bar */}
                  <div className="w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-800/60 flex items-end h-full">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all duration-500"
                      style={{ height: `${barHeightPercent}%` }}
                    ></div>
                  </div>

                  <span className="text-[10px] text-slate-500 font-semibold">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements list sidebar (1/3 width) */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5 mb-3">
              <Star className="w-4 h-4 text-yellow-400" />
              {t.badges}
            </h3>

            <div className="space-y-2.5">
              {BADGES_DATA.map((badge) => {
                const isXpUnlocked = badge.unlockedAtXp ? userProgress.xp >= badge.unlockedAtXp : false;
                const isManuallyOwned = userProgress.badges.includes(badge.id);
                const isUnlocked = isXpUnlocked || isManuallyOwned;

                return (
                  <div
                    key={badge.id}
                    className={`p-2.5 rounded-xl border flex items-center gap-3 transition-all ${
                      isUnlocked
                        ? "bg-slate-900/40 border-slate-800"
                        : "bg-slate-900/10 border-slate-900 opacity-50"
                    }`}
                  >
                    <span className="text-xl p-1 bg-slate-950 rounded-lg">{badge.icon === "Zap" ? "⚡" : badge.icon === "Flame" ? "🔥" : badge.icon === "Award" ? "👑" : badge.icon === "ShieldAlert" ? "🛡️" : "🦉"}</span>
                    <div className="min-w-0">
                      <span className={`text-[11px] font-bold block truncate ${isUnlocked ? "text-slate-100" : "text-slate-500"}`}>
                        {badge.title[language]}
                      </span>
                      <span className="text-[9px] text-slate-500 block truncate">
                        {badge.description[language]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Export Data buttons bottom */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-900">
            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-1 px-2.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-slate-300 hover:text-white rounded-lg cursor-pointer transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="flex items-center justify-center gap-1 px-2.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-slate-300 hover:text-white rounded-lg cursor-pointer transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
