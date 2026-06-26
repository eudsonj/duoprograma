import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Lock, CheckCircle2, Award, Download, DownloadCloud, Sparkles, Check, Info, FileCode, Palette, Variable, ListFilter, Terminal, Search, Database, Layout, Cpu, Binary } from "lucide-react";
import { Track, Lesson, UserProgress, AppLanguage } from "../types";
import { TRACKS_DATA, APP_TRANSLATIONS } from "../data";
import { playSound } from "../utils/audio";

interface LessonsPathProps {
  userProgress: UserProgress;
  onStartLesson: (lesson: Lesson) => void;
  language: AppLanguage;
  onDownloadCourse: (trackId: string) => void;
  isOfflineMode: boolean;
}

// Map string representation to Lucide Icons dynamically
const iconMap: Record<string, any> = {
  FileCode, Palette, Variable, ListFilter, Terminal, Search, Database, Layout, Cpu, Binary
};

export const LessonsPath: React.FC<LessonsPathProps> = ({
  userProgress,
  onStartLesson,
  language,
  onDownloadCourse,
  isOfflineMode,
}) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>(userProgress.activeTrackId || TRACKS_DATA[0]?.id || "");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const t = APP_TRANSLATIONS[language];
  const activeTrack = TRACKS_DATA.find((tr) => tr.id === selectedTrackId) || TRACKS_DATA[0];

  const handleLessonNodeClick = (lesson: Lesson, isLocked: boolean) => {
    playSound("click");
    if (isLocked && !isOfflineMode) {
      return; // Can't open locked lessons unless offline offers downloaded ones
    }
    // If offline, check if this course is downloaded
    if (isOfflineMode && !userProgress.offlineCoursesDownloaded.includes(activeTrack.id)) {
      return; // Offline and not downloaded
    }
    setSelectedLesson(lesson);
  };

  const startDownloading = (trackId: string) => {
    playSound("click");
    setDownloadingId(trackId);
    setTimeout(() => {
      onDownloadCourse(trackId);
      setDownloadingId(null);
      playSound("level-up");
    }, 1500);
  };

  // Chest Click Reward Simulation
  const [chestOpened, setChestOpened] = useState(false);
  const claimChestReward = () => {
    if (chestOpened) return;
    playSound("coin");
    setChestOpened(true);
    userProgress.coins += 50; // Triggers coins increase
  };

  // Get alternating margin alignments for the zig-zag path nodes
  const getAlternatingAlignment = (index: number) => {
    const sequence = ["items-center", "items-start pl-8 sm:pl-16", "items-center", "items-end pr-8 sm:pr-16"];
    return sequence[index % sequence.length];
  };

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6 pb-20 relative">
      {/* Offline Alert Banner */}
      {isOfflineMode && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-3.5 rounded-xl flex items-center gap-3 text-xs md:text-sm animate-pulse shadow-sm">
          <Info className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold">{t.offlineActive}</p>
            <p className="text-[10px] opacity-85">
              Apenas os cursos listados como baixados podem ser estudados no momento.
            </p>
          </div>
        </div>
      )}

      {/* Curriculum Track Switcher */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
          Trilha de Aprendizado / Learning Track
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {TRACKS_DATA.map((track) => {
            const isSelected = track.id === selectedTrackId;
            const isDownloaded = userProgress.offlineCoursesDownloaded.includes(track.id);
            return (
              <button
                key={track.id}
                onClick={() => {
                  playSound("click");
                  setSelectedTrackId(track.id);
                }}
                className={`relative p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? `bg-gradient-to-br ${track.color} text-slate-950 border-white/20 shadow-lg font-bold`
                    : "bg-[#0c0f33] text-slate-300 border-indigo-900/30 hover:border-indigo-500/40 hover:bg-indigo-950/40"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-sm font-bold block truncate max-w-[120px]">{track.title}</span>
                  {isDownloaded && (
                    <span className="text-[10px] bg-slate-800 text-emerald-400 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> DL
                    </span>
                  )}
                </div>
                <p className={`text-[10px] mt-1 line-clamp-1 opacity-80 ${isSelected ? "text-slate-900" : "text-slate-400"}`}>
                  {track.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Track Stats Card and Offline Downloader */}
      <div className="bg-[#0c0f33]/80 border border-indigo-900/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
        {/* Subtle glow circle */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full"></div>
        <div>
          <h3 className="font-extrabold text-base text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            {activeTrack.title} Basics
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeTrack.lessons.length} {language === "pt" ? "módulos interativos disponíveis." : "interactive modules available."}
          </p>
        </div>

        {/* Course Download Button */}
        <div>
          {userProgress.offlineCoursesDownloaded.includes(activeTrack.id) ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.downloadSuccess}</span>
            </div>
          ) : (
            <button
              onClick={() => startDownloading(activeTrack.id)}
              disabled={downloadingId !== null}
              className="flex items-center gap-2 px-4 py-2 bg-[#07091d] hover:bg-indigo-950/40 border border-indigo-900/40 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            >
              {downloadingId === activeTrack.id ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <DownloadCloud className="w-4 h-4 text-emerald-400" />
                  </motion.div>
                  <span>Baixando...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{t.downloadCourse}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Vertically Scrolling Zig-Zag Duolingo Path Map */}
      <div className="flex flex-col items-center py-6 min-h-[450px]">
        {/* Dynamic Curved Path SVG Line */}
        <div className="relative w-full max-w-md flex flex-col items-center gap-8">
          {activeTrack.lessons.map((lesson, idx) => {
            // A lesson is unlocked if it is the first, or if the previous lesson is in completed list
            const previousLessonCompleted = idx === 0 || userProgress.completedLessons.includes(activeTrack.lessons[idx - 1]?.id || "");
            const isCompleted = userProgress.completedLessons.includes(lesson.id);
            const isUnlocked = idx === 0 || previousLessonCompleted;
            const isLocked = !isUnlocked;

            // Resolve proper lesson icon
            const LessonIcon = iconMap[lesson.icon] || FileCode;

            // Offline restriction check
            const offlineBlocked = isOfflineMode && !userProgress.offlineCoursesDownloaded.includes(activeTrack.id);
            const actualLocked = isLocked || offlineBlocked;

            return (
              <div
                key={lesson.id}
                className={`flex flex-col ${getAlternatingAlignment(idx)} w-full relative group`}
              >
                {/* Node with Ring */}
                <div className="relative z-10">
                  {/* Glowing Pulse Ring for active unlocked lesson */}
                  {!actualLocked && !isCompleted && (
                    <span className="absolute -inset-2.5 bg-indigo-500/30 rounded-full animate-ping opacity-60"></span>
                  )}

                  {/* Circular Button */}
                  <motion.button
                    whileHover={{ scale: actualLocked ? 1 : 1.08 }}
                    whileTap={{ scale: actualLocked ? 1 : 0.95 }}
                    onClick={() => handleLessonNodeClick(lesson, actualLocked)}
                    className={`w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-lg cursor-pointer transition-all ${
                      isCompleted
                        ? "bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 border-yellow-500 shadow-yellow-500/10"
                        : actualLocked
                        ? "bg-[#1e1b4b] text-slate-500 border-[#312e81]/40 cursor-not-allowed"
                        : "bg-indigo-500 text-white border-indigo-600 shadow-indigo-500/20 node-glow"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-7 h-7 stroke-[3px]" />
                    ) : actualLocked ? (
                      <Lock className="w-5 h-5 opacity-70" />
                    ) : (
                      <LessonIcon className="w-7 h-7 stroke-[2.5]" />
                    )}
                  </motion.button>

                  {/* Lesson Level Badge indicator */}
                  <span className={`absolute -bottom-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    isCompleted 
                      ? "bg-yellow-500 text-slate-950" 
                      : actualLocked 
                      ? "bg-[#312e81] text-slate-400" 
                      : "bg-indigo-600 text-slate-100"
                  }`}>
                    {idx + 1}
                  </span>
                </div>

                {/* Floating Tooltip Hover Banner */}
                <div className="mt-2 text-center select-none">
                  <span className="text-xs font-bold text-slate-300 block">
                    {lesson.title[language]}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {isCompleted ? "Completo (+100% XP)" : actualLocked ? "Bloqueado" : "Praticar (+20 XP)"}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Golden Treasure Chest at the end of Path */}
          <div className="flex flex-col items-center mt-10 relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={claimChestReward}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center border-3 cursor-pointer shadow-lg transition-all ${
                chestOpened
                  ? "bg-[#1e1b4b] border-[#312e81]/40 text-slate-500"
                  : "bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-600 border-yellow-300 shadow-yellow-500/20 animate-bounce"
              }`}
            >
              <Award className={`w-8 h-8 ${chestOpened ? "opacity-40" : "text-slate-950"}`} />
            </motion.div>
            <span className="text-xs font-bold text-slate-300 mt-2">
              {chestOpened ? "Baú Reivindicado! 🎉" : "Recompensa de Ouro"}
            </span>
            <span className="text-[10px] text-yellow-400 font-semibold">
              {chestOpened ? "+50 Moedas resgatadas" : "Toque para abrir (+50 moedas)"}
            </span>
          </div>
        </div>
      </div>

      {/* Popover overlay for starting selected module */}
      <AnimatePresence>
        {selectedLesson && (
          <div className="fixed inset-0 bg-[#050614]/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#090b23] border border-indigo-500/30 rounded-3xl p-6 max-w-sm w-full shadow-[0_0_40px_rgba(99,102,241,0.25)] relative"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Visual Circle */}
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
                  <Sparkles className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                    Módulo {activeTrack.lessons.indexOf(selectedLesson) + 1}
                  </span>
                  <h3 className="font-extrabold text-lg text-white mt-1">
                    {selectedLesson.title[language]}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {selectedLesson.description[language]}
                  </p>
                </div>

                {/* Reward details banner */}
                <div className="bg-[#07091d]/90 border border-indigo-900/40 rounded-2xl w-full py-3.5 px-4 flex justify-around text-xs font-bold text-slate-300 select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="text-indigo-400">+{selectedLesson.xpReward}</span>
                    <span>XP</span>
                  </div>
                  <div className="w-px bg-indigo-900/30 h-4"></div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-yellow-400">+{selectedLesson.coinReward}</span>
                    <span>Moedas</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2.5 w-full pt-2">
                  <button
                    onClick={() => {
                      playSound("click");
                      onStartLesson(selectedLesson);
                      setSelectedLesson(null);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 cursor-pointer transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{t.startLesson}</span>
                  </button>

                  <button
                    onClick={() => {
                      playSound("click");
                      setSelectedLesson(null);
                    }}
                    className="w-full py-2.5 bg-[#07091d] hover:bg-indigo-950/40 border border-indigo-900/30 text-slate-300 hover:text-white font-semibold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
