import React, { useState } from "react";
import { Trophy, Timer, ArrowUp, ShieldAlert, Sparkles, Award } from "lucide-react";
import { LeaderboardUser, AppLanguage } from "../types";
import { LEADERBOARD_MOCKS, APP_TRANSLATIONS } from "../data";
import { playSound } from "../utils/audio";

interface LeaderboardProps {
  userXp: number;
  language: AppLanguage;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ userXp, language }) => {
  const t = APP_TRANSLATIONS[language];

  const leagues = [
    { id: "bronze", label: t.bronzeLeague, color: "from-amber-600 to-amber-800", icon: "🥉" },
    { id: "silver", label: t.silverLeague, color: "from-slate-400 to-slate-600", icon: "🥈" },
    { id: "gold", label: t.goldLeague, color: "from-yellow-400 to-amber-500", icon: "🥇" },
    { id: "diamond", label: t.diamondLeague, color: "from-cyan-400 to-teal-500", icon: "💎" },
  ];

  const [activeLeagueId, setActiveLeagueId] = useState<string>("bronze");

  const handleLeagueClick = (leagueId: string) => {
    playSound("click");
    setActiveLeagueId(leagueId);
  };

  // Get active league users and inject dynamic user score
  const getLeagueUsers = (): LeaderboardUser[] => {
    const defaultUsers = LEADERBOARD_MOCKS[activeLeagueId] || LEADERBOARD_MOCKS.bronze;
    return defaultUsers.map((user) => {
      if (user.isCurrentUser) {
        return { ...user, xp: userXp }; // Bind current state
      }
      return user;
    }).sort((a, b) => b.xp - a.xp) // Resort based on XP change
      .map((user, idx) => ({ ...user, rank: idx + 1 })); // Recalculate ranks
  };

  const currentUsers = getLeagueUsers();

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6 pb-20 select-none">
      {/* Timer Countdown Panel */}
      <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Timer className="w-5 h-5 text-emerald-400 animate-pulse" />
          <div>
            <p className="font-bold text-slate-100">{t.timerRanking}</p>
            <p className="text-[10px] text-slate-400">Pratique hoje para se classificar para a próxima liga!</p>
          </div>
        </div>

        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full font-bold uppercase text-[10px]">
          Fase de Grupos
        </span>
      </div>

      {/* League Selector Carousel */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar">
        {leagues.map((league) => {
          const isActive = league.id === activeLeagueId;
          return (
            <button
              key={league.id}
              onClick={() => handleLeagueClick(league.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl border cursor-pointer transition-all shrink-0 ${
                isActive
                  ? `bg-gradient-to-br ${league.color} text-slate-950 border-white/20 font-bold shadow-lg shadow-black/10`
                  : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white"
              }`}
            >
              <span className="text-base">{league.icon}</span>
              <span className="text-xs font-bold whitespace-nowrap">{league.label}</span>
            </button>
          );
        })}
      </div>

      {/* Leaderboard Rankings Table */}
      <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="bg-slate-950 border-b border-slate-800/80 px-4 py-3 grid grid-cols-12 gap-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
          <div className="col-span-2 text-center">Pos</div>
          <div className="col-span-7">Nome / Cargo</div>
          <div className="col-span-3 text-right">XP Acumulado</div>
        </div>

        {/* Table rows list */}
        <div className="divide-y divide-slate-900">
          {currentUsers.map((user, idx) => {
            const isCurrentUser = user.isCurrentUser;
            const rank = idx + 1;

            // Define custom medal badges for top ranks
            let rankSymbol: React.ReactNode = <span>{rank}</span>;
            if (rank === 1) rankSymbol = <span className="text-base">🥇</span>;
            else if (rank === 2) rankSymbol = <span className="text-base">🥈</span>;
            else if (rank === 3) rankSymbol = <span className="text-base">🥉</span>;

            // Zones
            const isPromoted = rank <= 3;
            const isDemoted = rank === currentUsers.length;

            return (
              <div
                key={user.name}
                className={`px-4 py-4 grid grid-cols-12 gap-2 items-center text-xs transition-all ${
                  isCurrentUser
                    ? "bg-emerald-500/10 border-y border-emerald-500/20 font-bold"
                    : "hover:bg-slate-900/40"
                }`}
              >
                {/* Pos */}
                <div className="col-span-2 text-center flex flex-col items-center gap-0.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    rank <= 3 ? "bg-slate-900 text-amber-500 border border-amber-500/20" : "text-slate-400"
                  }`}>
                    {rankSymbol}
                  </div>
                </div>

                {/* Name & Title info */}
                <div className="col-span-7 flex items-center gap-2.5 min-w-0">
                  <span className="text-lg bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/40 select-none">
                    {user.avatar}
                  </span>
                  <div className="truncate">
                    <div className="flex items-center gap-1">
                      <span className={`font-bold block truncate ${isCurrentUser ? "text-emerald-400" : "text-white"}`}>
                        {user.name}
                      </span>
                      {isCurrentUser && (
                        <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded-md font-bold">
                          VOCÊ
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">{user.title}</span>
                  </div>
                </div>

                {/* XP */}
                <div className="col-span-3 text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-extrabold text-white text-sm">
                      {user.xp} <span className="text-[10px] font-medium text-slate-500">{t.xp}</span>
                    </span>

                    {/* Zone indicators */}
                    {isPromoted && (
                      <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5 mt-0.5">
                        <ArrowUp className="w-2.5 h-2.5 stroke-[3px]" />
                        <span>Subindo</span>
                      </span>
                    )}

                    {isDemoted && (
                      <span className="text-[9px] text-rose-400 font-semibold flex items-center gap-0.5 mt-0.5">
                        <ShieldAlert className="w-2.5 h-2.5" />
                        <span>Risco</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Zone Descriptions Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 select-none">
        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex gap-3 text-xs items-start">
          <div className="bg-emerald-500/15 p-1.5 rounded-lg text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-white">{t.promotionZone}</h4>
            <p className="text-slate-400 mt-1 leading-relaxed">
              Os 3 primeiros colocados sobem para a próxima Liga de estudos no domingo!
            </p>
          </div>
        </div>

        <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex gap-3 text-xs items-start">
          <div className="bg-rose-500/15 p-1.5 rounded-lg text-rose-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-white">Recompensa da Liga</h4>
            <p className="text-slate-400 mt-1 leading-relaxed">
              O campeão de cada Liga recebe 100 Moedas extras e desbloqueia um emblema dourado exclusivo!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
