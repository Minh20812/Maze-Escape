import React, { useState, useEffect, useCallback } from "react";
import GameGrid from "./GameGrid";
import GameControls from "./GameControls";
import GameUI from "./GameUI";
import { toast } from "sonner";
import { TileType } from "@/types/game";
import { LEVELS } from "@/data/levels";
import {
  movePlayer,
  checkWinCondition,
  countGoals,
  countInitialGoalsCompleted,
} from "@/utils/gameLogic";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";

const Game = ({ onBackToMenu }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameState, setGameState] = useState({
    grid: [],
    playerPosition: { x: 0, y: 0 },
    moves: 0,
    isCompleted: false,
    goalsCompleted: 0,
    totalGoals: 0,
  });
  const [history, setHistory] = useState([]);
  const [showLevelCompleteDialog, setShowLevelCompleteDialog] = useState(false);

  const initializeLevel = useCallback((levelIndex) => {
    const level = LEVELS[levelIndex];
    if (!level) return;

    const grid = level.grid.map((row) => [...row]);
    let playerPosition = { x: 0, y: 0 };

    // Find player starting position
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === TileType.PLAYER) {
          playerPosition = { x, y };
          grid[y][x] = TileType.FLOOR;
          break;
        }
      }
    }

    const totalGoals = countGoals(grid);
    const goalsCompleted = countInitialGoalsCompleted(grid);

    const newState = {
      grid,
      playerPosition,
      moves: 0,
      isCompleted: false,
      goalsCompleted,
      totalGoals,
    };

    setGameState(newState);
    setHistory([newState]);
    setShowLevelCompleteDialog(false);
  }, []);

  useEffect(() => {
    initializeLevel(currentLevel);
  }, [currentLevel, initializeLevel]);

  const handleMove = useCallback(
    (direction) => {
      if (gameState.isCompleted) return;

      const newState = movePlayer(gameState, direction);
      if (newState) {
        setHistory((prev) => [...prev, newState]);
        setGameState(newState);

        if (checkWinCondition(newState)) {
          setGameState((prev) => ({ ...prev, isCompleted: true }));
          setShowLevelCompleteDialog(true);
          toast.success(`You escaped in ${newState.moves} moves!`);
        } else if (newState.goalsCompleted > gameState.goalsCompleted) {
          // Show toast when a goal is completed
          toast.success(
            `${newState.goalsCompleted}/${newState.totalGoals} blocks in place`
          );
        } else if (newState.goalsCompleted < gameState.goalsCompleted) {
          // Notify when a block is removed from goal
          toast.info(
            `${newState.goalsCompleted}/${newState.totalGoals} blocks in place`
          );
        }
      }
    },
    [gameState, toast]
  );

  const handleUndo = useCallback(() => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setGameState(newHistory[newHistory.length - 1]);
    }
  }, [history]);

  const handleReset = useCallback(() => {
    initializeLevel(currentLevel);
  }, [currentLevel, initializeLevel]);

  const handleNextLevel = useCallback(() => {
    if (currentLevel < LEVELS.length - 1) {
      setCurrentLevel((prev) => prev + 1);
    } else {
      toast.success("You've completed all levels!");
    }
    setShowLevelCompleteDialog(false);
  }, [currentLevel, toast]);

  const handlePrevLevel = useCallback(() => {
    if (currentLevel > 0) {
      setCurrentLevel((prev) => prev - 1);
    }
  }, [currentLevel]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key.toLowerCase()) {
        case "w":
        case "arrowup":
          event.preventDefault();
          handleMove("up");
          break;
        case "s":
        case "arrowdown":
          event.preventDefault();
          handleMove("down");
          break;
        case "a":
        case "arrowleft":
          event.preventDefault();
          handleMove("left");
          break;
        case "d":
        case "arrowright":
          event.preventDefault();
          handleMove("right");
          break;
        case "u":
          event.preventDefault();
          handleUndo();
          break;
        case "r":
          event.preventDefault();
          handleReset();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleMove, handleUndo, handleReset]);

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-4 md:p-6 max-w-4xl mx-auto">
      <GameUI
        level={currentLevel + 1}
        moves={gameState.moves}
        totalLevels={LEVELS.length}
        isCompleted={gameState.isCompleted}
        goalsCompleted={gameState.goalsCompleted}
        totalGoals={gameState.totalGoals}
        onNextLevel={handleNextLevel}
        onPrevLevel={handlePrevLevel}
        onUndo={handleUndo}
        onReset={handleReset}
        canUndo={history.length > 1}
        onBackToMenu={onBackToMenu}
      />

      <div className="flex justify-center my-4">
        <GameGrid
          grid={gameState.grid}
          playerPosition={gameState.playerPosition}
        />
      </div>

      <GameControls onMove={handleMove} />

      <Dialog
        open={showLevelCompleteDialog}
        onOpenChange={setShowLevelCompleteDialog}
      >
        <DialogContent className="sm:max-w-md flex flex-col items-center">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl text-green-400">
              Level Complete! 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              You escaped in {gameState.moves} moves!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col items-center w-full pt-4">
            <Button
              onClick={handleNextLevel}
              className="w-40 bg-green-600 hover:bg-green-700 text-white"
              disabled={currentLevel >= LEVELS.length - 1}
            >
              Next Level
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Game;
