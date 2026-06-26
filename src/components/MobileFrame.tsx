import React from "react";
import { motion } from "motion/react";
import { Smartphone, RotateCw, Monitor, CheckCircle2, Volume2, VolumeX, RefreshCw } from "lucide-react";
import { AppLanguage } from "../types";
import { APP_TRANSLATIONS } from "../data";

interface MobileFrameProps {
  children: React.ReactNode;
  isMobileSimulated: boolean;
  setIsMobileSimulated: (val: boolean) => void;
  isPortrait: boolean;
  setIsPortrait: (val: boolean) => void;
  language: AppLanguage;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  onReset: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  isMobileSimulated,
  setIsMobileSimulated,
  isPortrait,
  setIsPortrait,
  language,
  soundEnabled,
  setSoundEnabled,
  onReset,
}) => {
  const t = APP_TRANSLATIONS[language];

  return (
    <div className="min-h-screen bg-[#050614] text-slate-100 flex flex-col font-sans transition-all duration-300">
      {/* Top Simulator Control Bar */}
      <header className="bg-[#07091d]/90 border-b border-indigo-900/40 px-4 py-3 flex flex-wrap gap-3 items-center justify-between sticky top-0 z-50 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Smartphone className="w-6 h-6 text-indigo-400" />
          <h1 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
            DevLingo <span className="text-xs font-normal text-indigo-400">Simulator v1.5</span>
          </h1>
        </div>

        {/* Info label for responsiveness */}
        <p className="hidden md:block text-xs text-slate-400 max-w-sm">
          {t.mobileGuide}
        </p>

        {/* Controls */}
        <div className="flex items-center gap-2.5">
          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              soundEnabled ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30" : "bg-slate-850 text-slate-400 border border-transparent"
            }`}
            title={t.soundEffects}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? "On" : "Off"}</span>
          </button>

          {/* Reset progress */}
          <button
            onClick={onReset}
            className="p-2 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            title={t.resetProgress}
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">{t.resetProgress}</span>
          </button>

          {/* Toggle Simulator Device */}
          <div className="flex bg-slate-850 rounded-lg p-0.5 border border-indigo-950/55">
            <button
              onClick={() => setIsMobileSimulated(false)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                !isMobileSimulated ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.desktopMode}</span>
            </button>
            <button
              onClick={() => setIsMobileSimulated(true)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                isMobileSimulated ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.mobileMode}</span>
            </button>
          </div>

          {/* Orientation control (Only active when mobile simulation is on) */}
          {isMobileSimulated && (
            <motion.button
              layout
              onClick={() => setIsPortrait(!isPortrait)}
              className="p-2 bg-slate-850 hover:bg-slate-800 text-indigo-400 border border-indigo-950/40 rounded-lg flex items-center gap-1.5 text-xs font-semibold shadow-md cursor-pointer"
              title={t.orientationToggle}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCw className="w-4 h-4" />
              <span>{isPortrait ? "Retrato" : "Paisagem"}</span>
            </motion.button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-3 md:p-6 overflow-auto bg-[#050614]">
        {isMobileSimulated ? (
          /* Smartphone Outer Frame */
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className={`relative bg-[#090b23] border-[10px] border-[#1e1b4b] shadow-2xl rounded-[40px] flex flex-col overflow-hidden ring-4 ring-indigo-950/30 ${
              isPortrait ? "w-[385px] h-[780px]" : "w-[780px] h-[410px]"
            } transition-all duration-300`}
          >
            {/* Speaker & Sensor Notch */}
            <div className={`absolute bg-[#1e1b4b] z-50 flex justify-center items-center ${
              isPortrait 
                ? "top-0 left-1/2 -translate-x-1/2 w-40 h-6 rounded-b-2xl" 
                : "left-0 top-1/2 -translate-y-1/2 h-40 w-6 rounded-r-2xl"
            }`}>
              <div className="w-12 h-1 bg-slate-900 rounded-full mb-1"></div>
              <div className="w-2.5 h-2.5 bg-slate-900 rounded-full absolute right-6"></div>
            </div>

            {/* Mobile StatusBar Simulation */}
            <div className="bg-[#07091d] text-slate-300 text-[11px] px-6 py-2 flex justify-between items-center z-40 select-none border-b border-indigo-950/40">
              <span className="font-semibold">09:41</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 fill-indigo-500/10" />
                <span>DevLingo</span>
                <span className="text-[10px]">5G</span>
                {/* Simulated Battery */}
                <div className="w-5 h-2.5 border border-slate-400 rounded-sm p-0.5 flex items-center">
                  <div className="h-full w-4/5 bg-indigo-400 rounded-2xs"></div>
                </div>
              </div>
            </div>

            {/* Simulated Webpage Container inside Phone */}
            <div className="flex-1 overflow-y-auto bg-[#090b23] flex flex-col relative">
              {children}
            </div>

            {/* Home indicator bar */}
            <div className="bg-[#07091d] py-1.5 flex justify-center items-center z-40">
              <div className="w-28 h-1 bg-slate-600 rounded-full"></div>
            </div>
          </motion.div>
        ) : (
          /* Normal Desktop App Container */
          <div className="w-full max-w-6xl h-[calc(100vh-100px)] flex flex-col rounded-2xl bg-[#090b23] border border-indigo-900/30 shadow-[0_0_50px_rgba(99,102,241,0.15)] overflow-hidden">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
