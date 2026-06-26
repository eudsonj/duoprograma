import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Heart, Coins, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Trophy, Sparkles } from "lucide-react";
import { Lesson, Exercise, UserProgress, AppLanguage } from "../types";
import { playSound } from "../utils/audio";
import { APP_TRANSLATIONS } from "../data";

interface ActiveLessonProps {
  lesson: Lesson;
  userProgress: UserProgress;
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  language: AppLanguage;
  onFinish: (gainedXp: number, gainedCoins: number) => void;
  onClose: () => void;
}

export const ActiveLesson: React.FC<ActiveLessonProps> = ({
  lesson,
  userProgress,
  setUserProgress,
  language,
  onFinish,
  onClose,
}) => {
  const t = APP_TRANSLATIONS[language];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [orderedBlocks, setOrderedBlocks] = useState<string[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [livesState, setLivesState] = useState(userProgress.lives);
  const [lessonFinished, setLessonFinished] = useState(false);
  const [showOutOfLives, setShowOutOfLives] = useState(false);

  const currentExercise: Exercise = lesson.exercises[currentIndex];

  // Reset answer states when question changes
  useEffect(() => {
    setSelectedOption(null);
    setOrderedBlocks([]);
    setIsAnswerChecked(false);
    setIsCorrect(false);
  }, [currentIndex]);

  const handleOptionSelect = (option: string) => {
    if (isAnswerChecked) return;
    playSound("click");
    setSelectedOption(option);
  };

  const handleBlockClick = (block: string) => {
    if (isAnswerChecked) return;
    playSound("click");
    if (orderedBlocks.includes(block)) {
      setOrderedBlocks(orderedBlocks.filter((b) => b !== block));
    } else {
      setOrderedBlocks([...orderedBlocks, block]);
    }
  };

  const checkAnswer = () => {
    if (isAnswerChecked) return;
    let correct = false;

    if (currentExercise.type === "multiple-choice" || currentExercise.type === "fill-blank" || currentExercise.type === "find-error") {
      correct = selectedOption === currentExercise.correctAnswer;
    } else if (currentExercise.type === "order-code") {
      // Compare arrays
      const targetStr = currentExercise.correctOrder?.join(",") || "";
      const currentStr = orderedBlocks.join(",");
      correct = targetStr === currentStr;
    }

    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      playSound("success");
    } else {
      playSound("error");
      const nextLives = Math.max(0, livesState - 1);
      setLivesState(nextLives);
      setUserProgress((prev) => ({ ...prev, lives: nextLives }));

      if (nextLives === 0) {
        setTimeout(() => {
          setShowOutOfLives(true);
        }, 1200);
      }
    }
  };

  const handleNext = () => {
    playSound("click");
    if (currentIndex < lesson.exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Completed last exercise!
      setLessonFinished(true);
      playSound("level-up");
    }
  };

  const handleRefillLives = () => {
    if (userProgress.coins >= 100) {
      playSound("coin");
      setUserProgress((prev) => ({
        ...prev,
        coins: prev.coins - 100,
        lives: prev.maxLives,
      }));
      setLivesState(userProgress.maxLives);
      setShowOutOfLives(false);
    } else {
      playSound("error");
      alert(language === "pt" ? "Moedas insuficientes!" : "Insufficient coins!");
    }
  };

  // Final submit to commit progress
  const finishLesson = () => {
    playSound("click");
    onFinish(lesson.xpReward, lesson.coinReward);
  };

  const renderExerciseContent = () => {
    if (!currentExercise) return null;

    switch (currentExercise.type) {
      case "multiple-choice":
      case "find-error":
        return (
          <div className="space-y-4">
            {/* Syntax snippet if exists */}
            {currentExercise.codeSnippet && (
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-sm text-indigo-400 overflow-x-auto select-text leading-relaxed">
                <code>{currentExercise.codeSnippet}</code>
              </pre>
            )}

            {/* Options grid */}
            <div className="grid grid-cols-1 gap-2.5">
              {currentExercise.options.map((opt) => {
                const isSelected = selectedOption === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleOptionSelect(opt)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? "bg-indigo-500/15 border-indigo-500 text-indigo-400 font-bold shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                        : "bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-300"
                    }`}
                  >
                    <span className="font-mono text-sm">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "fill-blank":
        return (
          <div className="space-y-4">
            {currentExercise.codeSnippet && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-sm text-slate-300 select-text leading-relaxed">
                {currentExercise.codeSnippet.split("<_BLANK_>").map((part, index, arr) => (
                  <React.Fragment key={index}>
                    {part}
                    {index < arr.length - 1 && (
                      <span className={`inline-block px-3 py-1 mx-1.5 font-bold rounded-lg border min-w-[70px] text-center ${
                        selectedOption 
                          ? "bg-indigo-500/20 border-indigo-500 text-indigo-400" 
                          : "bg-slate-800 border-slate-700 text-slate-500 border-dashed"
                      }`}>
                        {selectedOption || "____"}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Drag options to fill blank */}
            <div className="flex flex-wrap gap-2.5 justify-center py-2">
              {currentExercise.options.map((opt) => {
                const isSelected = selectedOption === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleOptionSelect(opt)}
                    className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-500 text-white border-indigo-400 font-bold"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "order-code":
        return (
          <div className="space-y-4">
            {/* Dynamic visual slot space for compiled code */}
            <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl min-h-[100px] flex flex-col gap-2 justify-center">
              {orderedBlocks.length === 0 ? (
                <span className="text-xs text-slate-500 font-medium text-center italic select-none">
                  {language === "pt" ? "Toque nos blocos abaixo para ordenar o código..." : "Tap the blocks below to order the code..."}
                </span>
              ) : (
                <div className="flex flex-col gap-1.5 select-text">
                  {orderedBlocks.map((block, i) => (
                    <motion.div
                      layout
                      key={i}
                      onClick={() => handleBlockClick(block)}
                      className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-sm font-mono text-indigo-400 font-bold w-fit cursor-pointer hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-all"
                    >
                      {block}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Word bank blocks */}
            <div className="flex flex-wrap gap-2 justify-center py-2">
              {currentExercise.options.map((opt) => {
                const isUsed = orderedBlocks.includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => handleBlockClick(opt)}
                    className={`px-3 py-2 border rounded-xl font-mono text-sm transition-all cursor-pointer ${
                      isUsed
                        ? "bg-slate-800 border-slate-700/50 text-slate-600 cursor-not-allowed opacity-40 scale-95"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Screen 1: Out of Lives
  if (showOutOfLives) {
    return (
      <div className="flex-1 bg-[#050614] flex flex-col justify-center items-center p-6 text-center">
        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 shadow-xl mb-4">
          <Heart className="w-10 h-10 fill-rose-500 animate-pulse" />
        </div>
        <h2 className="text-xl font-black text-white">{t.outOfLives}</h2>
        <p className="text-xs text-slate-400 mt-2 max-w-xs">
          {language === "pt" 
            ? "O aprendizado exige energia! Recarregue suas vidas por 100 moedas agora para continuar estudando!" 
            : "Learning takes energy! Refill your hearts for 100 coins to keep playing!"}
        </p>

        <div className="bg-[#090b23] border border-indigo-900/30 p-3 rounded-2xl w-full max-w-xs flex justify-around text-xs mt-6">
          <span className="font-bold text-slate-300 flex items-center gap-1">
            <Coins className="w-4 h-4 text-yellow-400" /> {userProgress.coins} Moedas
          </span>
          <span className="text-slate-500">|</span>
          <span className="font-bold text-slate-300">Custo: 100 Moedas</span>
        </div>

        <div className="flex flex-col gap-2.5 w-full max-w-xs mt-6">
          <button
            onClick={handleRefillLives}
            disabled={userProgress.coins < 100}
            className="w-full py-3 bg-indigo-500 disabled:opacity-40 hover:bg-indigo-400 text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-500/10 text-sm"
          >
            {t.refillLives}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 font-semibold rounded-xl text-xs transition-all cursor-pointer"
          >
            Voltar para o caminho
          </button>
        </div>
      </div>
    );
  }

  // Screen 2: Finished Summary Screen
  if (lessonFinished) {
    return (
      <div className="flex-1 bg-[#050614] flex flex-col justify-center items-center p-6 text-center select-none">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-full flex items-center justify-center text-slate-950 shadow-2xl shadow-yellow-500/15 mb-4">
            <Trophy className="w-12 h-12 stroke-[2.5]" />
          </div>
          <Sparkles className="w-6 h-6 text-yellow-400 absolute top-[-5px] right-[-5px] animate-bounce" />
        </div>

        <h2 className="text-2xl font-black text-white">{t.correct}</h2>
        <p className="text-sm text-indigo-400 font-bold mt-1">
          {language === "pt" ? "Lição concluída com sucesso!" : "Lesson successfully completed!"}
        </p>

        {/* Gained stats dashboard row */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-8">
          <div className="bg-[#090b23] border border-indigo-900/30 p-4 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Ganho</span>
            <span className="text-lg font-black text-indigo-400 mt-1">+{lesson.xpReward} XP</span>
          </div>
          <div className="bg-[#090b23] border border-indigo-900/30 p-4 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Moedas Ganhas</span>
            <span className="text-lg font-black text-yellow-400 mt-1">+{lesson.coinReward} 🪙</span>
          </div>
        </div>

        {/* Accuracy badge card */}
        <div className="mt-4 p-4 bg-[#090b23]/60 border border-indigo-900/40 rounded-2xl w-full max-w-sm flex justify-between items-center text-xs text-slate-300 font-semibold">
          <span>{language === "pt" ? "Precisão recomendada" : "Accuracy Target"}:</span>
          <span className="text-indigo-400 font-black">100% (Impecável)</span>
        </div>

        <button
          onClick={finishLesson}
          className="w-full max-w-sm py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white font-black rounded-xl shadow-xl shadow-indigo-500/15 cursor-pointer transition-all mt-8 text-sm"
        >
          {t.continue}
        </button>
      </div>
    );
  }

  // Active exercises completion calculation
  const totalExercises = lesson.exercises.length;
  const progressPercent = ((currentIndex) / totalExercises) * 100;

  return (
    <div className="flex-1 bg-[#090b23] flex flex-col relative h-full">
      {/* Header Bar */}
      <header className="px-4 py-3 bg-[#07091d] border-b border-indigo-900/30 flex items-center justify-between gap-4">
        {/* Close Button */}
        <button
          onClick={() => {
            playSound("click");
            onClose();
          }}
          className="p-1.5 bg-slate-900 text-slate-400 hover:text-white rounded-lg border border-slate-800 cursor-pointer transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Progress bar indicator */}
        <div className="flex-1 h-3 bg-indigo-950 rounded-full overflow-hidden border border-indigo-900/30">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300 shadow-[0_0_8px_#6366f1]"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Lives state indicator */}
        <div className="flex items-center gap-1.5 text-rose-500 font-bold" title={t.lives}>
          <Heart className="w-4 h-4 fill-rose-500/20" />
          <span className="text-xs">{livesState}</span>
        </div>
      </header>

      {/* Main interactive workout zone */}
      <main className="flex-1 p-5 overflow-y-auto space-y-4 flex flex-col justify-center">
        <div>
          <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase">
            {language === "pt" ? `Exercício ${currentIndex + 1} de ${totalExercises}` : `Exercise ${currentIndex + 1} of ${totalExercises}`}
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-white mt-1 leading-tight select-text">
            {currentExercise.question[language]}
          </h2>
        </div>

        {/* Core dynamic body of exercise content */}
        {renderExerciseContent()}
      </main>

      {/* Slide-up Instant Verification Footer panel */}
      <footer className="p-4 bg-[#07091d] border-t border-indigo-900/30 sticky bottom-0 z-10">
        <AnimatePresence mode="wait">
          {!isAnswerChecked ? (
            /* Idle "Check Answer" state button footer */
            <motion.div
              key="idle-footer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-end"
            >
              <button
                disabled={
                  (currentExercise.type !== "order-code" && !selectedOption) ||
                  (currentExercise.type === "order-code" && orderedBlocks.length === 0)
                }
                onClick={checkAnswer}
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 text-white font-black rounded-xl shadow-lg transition-all cursor-pointer text-sm"
              >
                {t.check}
              </button>
            </motion.div>
          ) : (
            /* Result Slide Up (Success or Error Banner) */
            <motion.div
              key="result-footer"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 ${
                isCorrect ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-rose-500/10 border border-rose-500/20"
              }`}
            >
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="select-text">
                  <h4 className={`font-extrabold text-sm ${isCorrect ? "text-emerald-400" : "text-rose-400"}`}>
                    {isCorrect ? t.correct : t.incorrect}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                    <span className="font-bold">{t.explanation}:</span> {currentExercise.explanation[language]}
                  </p>
                </div>
              </div>

              <button
                onClick={handleNext}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-1.5 text-xs tracking-tight transition-all cursor-pointer ${
                  isCorrect
                    ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                    : "bg-rose-500 text-slate-100 hover:bg-rose-400"
                }`}
              >
                <span>{t.continue}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>
    </div>
  );
};
