import React, { useState } from "react";
import { Globe, Volume2, VolumeX, ShieldCheck, CloudLightning, Calendar, RefreshCw, Check, Link, Sparkles } from "lucide-react";
import { UserProgress, AppLanguage } from "../types";
import { playSound } from "../utils/audio";
import { APP_TRANSLATIONS } from "../data";

interface SettingsProps {
  userProgress: UserProgress;
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  userProgress,
  setUserProgress,
  language,
  setLanguage,
  soundEnabled,
  setSoundEnabled,
}) => {
  const t = APP_TRANSLATIONS[language];

  const [reminderTime, setReminderTime] = useState(userProgress.reminderTime || "19:00");
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [backingUp, setBackingUp] = useState(false);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);

  const handleReminderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setReminderTime(val);
    setUserProgress((prev) => ({ ...prev, reminderTime: val }));
  };

  const handleBiometricToggle = () => {
    playSound("click");
    setBiometricEnabled(!biometricEnabled);
  };

  const handleCloudBackup = () => {
    playSound("click");
    setBackingUp(true);
    setBackupMessage(null);

    setTimeout(() => {
      playSound("level-up");
      setBackingUp(false);
      setBackupMessage(t.backupSuccess);
      // Save current state as backup cache
      localStorage.setItem("devlingo_cloud_backup_sim", JSON.stringify(userProgress));
      setTimeout(() => setBackupMessage(null), 3000);
    }, 1500);
  };

  // Google Calendar Integration URL generator
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent("Praticar Código - DevLingo 💻");
    const details = encodeURIComponent(
      "Hora de codar e progredir no DevLingo! Acesse e complete seu módulo diário para não perder suas vidas ou quebrar sua ofensiva de estudos."
    );
    // Pre-filled daily recurring event URL
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&recur=RRULE:FREQ=DAILY&dates=20260624T190000Z/20260624T191500Z`;
  };

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6 pb-20 select-none">
      {/* General Configuration */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Geral & Idioma</h3>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl divide-y divide-slate-900">
          {/* Language Switch */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="font-extrabold text-sm text-white">{t.chooseLanguage}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Mude o idioma principal de exercícios e textos.</p>
              </div>
            </div>

            <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-0.5 select-none">
              <button
                onClick={() => {
                  playSound("click");
                  setLanguage("pt");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  language === "pt" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                Português
              </button>
              <button
                onClick={() => {
                  playSound("click");
                  setLanguage("en");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  language === "en" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Sound Effects Switch */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
              <div>
                <h4 className="font-extrabold text-sm text-white">{t.soundEffects}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Sons de retro acertos, erros e cliques.</p>
              </div>
            </div>

            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playSound("click");
              }}
              className={`w-11 h-6 rounded-full p-1 transition-all cursor-pointer ${
                soundEnabled ? "bg-emerald-500 flex justify-end" : "bg-slate-800 flex justify-start"
              }`}
            >
              <span className="w-4 h-4 bg-slate-950 rounded-full shadow-md"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Google Calendar studies Organizer integration */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Agendador de Estudos</h3>

        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="font-extrabold text-sm text-white">{t.reminderTitle}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Agende o melhor horário para praticar seus códigos.</p>
              </div>
            </div>

            <input
              type="time"
              value={reminderTime}
              onChange={handleReminderChange}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-white font-bold rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
            />
          </div>

          {/* Google Agenda link */}
          <div className="pt-4 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">
              Sincronize com sua agenda oficial para nunca esquecer de estudar!
            </span>

            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSound("click")}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer"
            >
              <Link className="w-4 h-4 text-emerald-400" />
              <span>{t.addGoogleCalendar}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Security & Backup settings */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Segurança & Nuvem</h3>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl divide-y divide-slate-900">
          {/* Biometrics */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="font-extrabold text-sm text-white">{t.biometricTitle}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{t.biometricDesc}</p>
              </div>
            </div>

            <button
              onClick={handleBiometricToggle}
              className={`w-11 h-6 rounded-full p-1 transition-all cursor-pointer ${
                biometricEnabled ? "bg-emerald-500 flex justify-end" : "bg-slate-800 flex justify-start"
              }`}
            >
              <span className="w-4 h-4 bg-slate-950 rounded-full shadow-md"></span>
            </button>
          </div>

          {/* Cloud backup */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CloudLightning className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="font-extrabold text-sm text-white">{t.cloudBackup}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{t.cloudBackupDesc}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCloudBackup}
                disabled={backingUp}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/10"
              >
                {backingUp ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sincronizando...</span>
                  </>
                ) : (
                  <>
                    <CloudLightning className="w-3.5 h-3.5" />
                    <span>Fazer Backup</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sync backup messages banner */}
        {backupMessage && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2 select-text font-semibold">
            <Check className="w-4 h-4" />
            <span>{backupMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
