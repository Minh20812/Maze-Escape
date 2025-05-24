import React from "react";
import { Button } from "@/components/ui/button";

const GameUI = ({
  level,
  moves,
  totalLevels,
  isCompleted,
  goalsCompleted = 0,
  totalGoals = 0,
  onNextLevel,
  onPrevLevel,
  onUndo,
  onReset,
  canUndo,
  onBackToMenu,
}) => {
  return (
    <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 mb-4 shadow-lg border border-slate-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
        {/* Level Info */}
        <div className="text-white">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Level {level}
            </h2>
            <div className="text-sm text-slate-400">
              ({level}/{totalLevels})
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-slate-300">Moves: </span>
              <span className="font-semibold text-white">{moves}</span>
            </div>

            {totalGoals > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span className="text-slate-300">Goals: </span>
                <span
                  className={`font-semibold ${
                    goalsCompleted === totalGoals
                      ? "text-green-400"
                      : "text-amber-400"
                  }`}
                >
                  {goalsCompleted}/{totalGoals}
                </span>
              </div>
            )}

            {isCompleted && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-semibold">Completed!</span>
              </div>
            )}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-2">
          {onBackToMenu && (
            <Button
              variant="outline"
              onClick={onBackToMenu}
              className="bg-slate-700/80 border-slate-600 text-white hover:bg-slate-600 hover:border-slate-500 transition-all duration-200 shadow-md"
            >
              <span className="hidden sm:inline">Back to </span>Menu
            </Button>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onPrevLevel}
              disabled={level === 1}
              className="bg-slate-700/80 border-slate-600 text-white hover:bg-slate-600 hover:border-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
            >
              <span className="hidden sm:inline">← </span>Prev
            </Button>
            <Button
              variant="outline"
              onClick={onNextLevel}
              disabled={!isCompleted || level === totalLevels}
              className="bg-slate-700/80 border-slate-600 text-white hover:bg-slate-600 hover:border-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
            >
              Next<span className="hidden sm:inline"> →</span>
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onUndo}
              disabled={!canUndo}
              className="bg-amber-700/20 border-amber-600/50 text-amber-300 hover:bg-amber-600/30 hover:border-amber-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
              title="Undo last move"
            >
              <span className="hidden sm:inline">Undo </span>
              <span className="text-xs">(U)</span>
            </Button>
            <Button
              variant="outline"
              onClick={onReset}
              className="bg-red-700/20 border-red-600/50 text-red-300 hover:bg-red-600/30 hover:border-red-500 transition-all duration-200 shadow-md"
              title="Reset level"
            >
              <span className="hidden sm:inline">Reset </span>
              <span className="text-xs">(R)</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="border-t border-slate-700 pt-3">
        <div className="text-center">
          <p className="text-slate-400 text-sm hidden lg:block">
            🎮 Use{" "}
            <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">
              WASD
            </kbd>{" "}
            or
            <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs ml-1">
              Arrow Keys
            </kbd>{" "}
            to move • 📦 Push blocks to goals • 🚪 Reach the green exit when it
            opens
          </p>
          <p className="text-slate-400 text-sm lg:hidden">
            📦 Push blocks to goals • 🚪 Reach the exit when it opens
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameUI;
