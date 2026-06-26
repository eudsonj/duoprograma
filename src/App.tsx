import { useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { MobileFrame } from "./components/MobileFrame";
import { LessonsPath } from "./components/LessonsPath";
import { ActiveLesson } from "./components/ActiveLesson";
import { CommunityForum } from "./components/CommunityForum";
import { MentorChat } from "./components/MentorChat";
import { Leaderboard } from "./components/Leaderboard";
import { Shop } from "./components/Shop";
import { PerformanceDashboard } from "./components/PerformanceDashboard";
import { Settings } from "./components/Settings";
import { UserProgress, Lesson, AppLanguage, AppTheme } from "./types";
import { playSound } from "./utils/audio";
import { Wifi, WifiOff, RefreshCw, Zap, Bell, Check } from "lucide-react";

const LOCAL_STORAGE_KEY = "devlingo_user_progress_v2";

const DEFAULT_PROGRESS: UserProgress = {
  xp: 30,
  coins: 100,
  lives: 5,
  maxLives: 5,
  streak: 3,
  maxStreak: 3,
  lastActive: new Date().toISOString(),
  unlockedLessons: ["html-basics", "js-vars", "py-intro", "sql-select"],
  completedLessons: [],
  activeTrackId: "html-css",
  theme: "dark",
  title: "Dev Júnior 💻",
  badges: ["badge-first"],
  hasShield: false,
  offlineCoursesDownloaded: ["html-css"], // Default HTML downloaded offline
  reminderTime: "19:00",
};

export default function App() {
  const [userProgress, setUserProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [activeTab, setActiveTab] = useState<string>("learn");
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Layout configuration simulation state
  const [isMobileSimulated, setIsMobileSimulated] = useState<boolean>(true);
  const [isPortrait, setIsPortrait] = useState<boolean>(true);

  // App settings
  const [language, setLanguage] = useState<AppLanguage>("pt");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Offline Study connection mock mode
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // 1. Initial State Load
  useEffect(() => {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setUserProgress(parsed);
        if (parsed.theme) {
          // Sync language or theme if any
        }
      } catch (e) {
        console.warn("Failed parsing cached user progress. Restoring defaults.");
      }
    }
  }, []);

  // 2. Persist State Changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userProgress));
  }, [userProgress]);

  // Audio configuration sync
  useEffect(() => {
    (window as any).DEV_AUDIO_ENABLED = soundEnabled;
  }, [soundEnabled]);

  // Offline Toggle Alert Sound
  const toggleOfflineMode = () => {
    playSound("click");
    const nextOfflineState = !isOfflineMode;
    setIsOfflineMode(nextOfflineState);
    playSound(nextOfflineState ? "error" : "success");

    triggerInAppNotification(
      nextOfflineState 
        ? "Você entrou no Modo Offline! 🔌 Os rankings globais estão no modo leitura." 
        : "Você está Online! 🌐 Rankings e Chat IA reestabelecidos com a nuvem."
    );
  };

  const triggerInAppNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Callback to handle completing a downloaded offline lesson
  const handleDownloadCourse = (trackId: string) => {
    setUserProgress((prev) => {
      if (prev.offlineCoursesDownloaded.includes(trackId)) return prev;
      return {
        ...prev,
        offlineCoursesDownloaded: [...prev.offlineCoursesDownloaded, trackId],
      };
    });
    triggerInAppNotification("Curso baixado para estudos Offline! 💾");
  };

  // Reset Progress trigger
  const handleResetProgress = () => {
    if (window.confirm("Deseja realmente resetar todo o seu progresso? Esta ação é irreversível.")) {
      playSound("error");
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem("devlingo_mentor_chat");
      setUserProgress(DEFAULT_PROGRESS);
      setActiveTab("learn");
      setActiveLesson(null);
      setIsOfflineMode(false);
      triggerInAppNotification("Seu progresso foi resetado para o início! 🚀");
    }
  };

  // Callback once the active lesson is finished successfully
  const handleFinishLesson = (xpGain: number, coinsGain: number) => {
    if (!activeLesson) return;

    setUserProgress((prev) => {
      const isNewlyCompleted = !prev.completedLessons.includes(activeLesson.id);
      const nextCompleted = isNewlyCompleted 
        ? [...prev.completedLessons, activeLesson.id] 
        : prev.completedLessons;

      // Unlock next lessons dynamically
      const nextUnlocked = [...prev.unlockedLessons];
      if (activeLesson.id === "html-basics" && !nextUnlocked.includes("css-basics")) {
        nextUnlocked.push("css-basics");
      }
      if (activeLesson.id === "css-basics" && !nextUnlocked.includes("js-vars")) {
        nextUnlocked.push("js-vars");
      }
      if (activeLesson.id === "js-vars" && !nextUnlocked.includes("js-arrays")) {
        nextUnlocked.push("js-arrays");
      }

      // Streaks updates if last active was not today
      const todayIso = new Date().toISOString().split("T")[0];
      const lastActiveIso = prev.lastActive?.split("T")[0];
      let newStreak = prev.streak;
      if (lastActiveIso !== todayIso) {
        newStreak = prev.streak + 1;
      }

      return {
        ...prev,
        xp: prev.xp + xpGain,
        coins: prev.coins + coinsGain,
        completedLessons: nextCompleted,
        unlockedLessons: nextUnlocked,
        streak: newStreak,
        maxStreak: Math.max(prev.maxStreak, newStreak),
        lastActive: new Date().toISOString(),
      };
    });

    setActiveLesson(null);
    triggerInAppNotification(`Parabéns! Lição finalizada. Ganhou +${xpGain} XP e +${coinsGain} Moedas! 🎉`);
  };

  // Dynamic Theme Styling configuration values
  const getThemeWrapperClass = (theme: AppTheme) => {
    switch (theme) {
      case "light":
        return "bg-slate-50 text-slate-900 border-slate-300";
      case "cyberpunk":
        return "bg-zinc-950 text-yellow-400 border-yellow-500/30 font-mono";
      case "forest":
        return "bg-stone-100 text-emerald-950 border-emerald-800/20";
      default: // "dark"
        return "bg-[#090b23] text-slate-100 border-indigo-900/30";
    }
  };

  // Inner tab component router
  const renderTabContent = () => {
    switch (activeTab) {
      case "learn":
        return (
          <LessonsPath
            userProgress={userProgress}
            onStartLesson={(lesson) => setActiveLesson(lesson)}
            language={language}
            onDownloadCourse={handleDownloadCourse}
            isOfflineMode={isOfflineMode}
          />
        );
      case "dashboard":
        return <PerformanceDashboard userProgress={userProgress} language={language} />;
      case "rankings":
        return <Leaderboard userXp={userProgress.xp} language={language} />;
      case "mentor":
        return <MentorChat userProgress={userProgress} language={language} isOfflineMode={isOfflineMode} />;
      case "forum":
        return <CommunityForum language={language} />;
      case "shop":
        return <Shop userProgress={userProgress} setUserProgress={setUserProgress} language={language} />;
      case "settings":
        return (
          <Settings
            userProgress={userProgress}
            setUserProgress={setUserProgress}
            language={language}
            setLanguage={setLanguage}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
          />
        );
      default:
        return null;
    }
  };

  return (
    <MobileFrame
      isMobileSimulated={isMobileSimulated}
      setIsMobileSimulated={setIsMobileSimulated}
      isPortrait={isPortrait}
      setIsPortrait={setIsPortrait}
      language={language}
      soundEnabled={soundEnabled}
      setSoundEnabled={setSoundEnabled}
      onReset={handleResetProgress}
    >
      {/* Root Theme Outer Wrapper Container */}
      <div className={`flex flex-col md:flex-row h-full w-full overflow-hidden ${getThemeWrapperClass(userProgress.theme)}`}>
        {activeLesson ? (
          /* Fullscreen exercise active lesson workspace overlay */
          <ActiveLesson
            lesson={activeLesson}
            userProgress={userProgress}
            setUserProgress={setUserProgress}
            language={language}
            onFinish={handleFinishLesson}
            onClose={() => {
              playSound("click");
              setActiveLesson(null);
            }}
          />
        ) : (
          /* Main Application Frame with Nav bars & Screen Views */
          <>
            {/* Navigation (Either Sidebar on Desktop or bottom tab on simulated mobile) */}
            <Navigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              userProgress={userProgress}
              language={language}
              setLanguage={setLanguage}
              isMobileSimulated={isMobileSimulated}
              isPortrait={isPortrait}
            />

            {/* Dynamic View Area Screen */}
            <div className="flex-1 flex flex-col overflow-hidden min-h-0 relative">
              {/* Secondary Status Bar for Online/Offline toggling and Quick Reminders */}
              <div className="bg-[#07091d]/60 border-b border-indigo-900/30 px-4 py-2.5 flex items-center justify-between text-xs shrink-0 select-none">
                {/* Simulated Notification Alarm scheduler */}
                <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <Bell className="w-3.5 h-3.5 text-indigo-400 animate-swing" />
                  <span>
                    Reminder: <strong className="text-slate-300">{userProgress.reminderTime || "19:00"}</strong>
                  </span>
                </div>

                {/* Connection Toggle Switch Button */}
                <button
                  onClick={toggleOfflineMode}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black border flex items-center gap-1.5 transition-all cursor-pointer ${
                    isOfflineMode
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                  }`}
                  title={isOfflineMode ? "Modo Offline Ativo" : "Modo Online Ativo"}
                >
                  {isOfflineMode ? (
                    <>
                      <WifiOff className="w-3 h-3" />
                      <span>Modo Offline</span>
                    </>
                  ) : (
                    <>
                      <Wifi className="w-3 h-3" />
                      <span>Online</span>
                    </>
                  )}
                </button>
              </div>

              {/* In-app visual Toast overlay alerts */}
              {notification && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm pointer-events-none select-none">
                  <div className="bg-[#0c0f33]/95 text-slate-100 border border-indigo-500/30 p-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs text-center font-bold">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{notification}</span>
                  </div>
                </div>
              )}

              {/* Main routing tab content */}
              <div className="flex-1 overflow-y-auto relative bg-slate-950/20">
                {renderTabContent()}
              </div>
            </div>
          </>
        )}
      </div>
    </MobileFrame>
  );
}
