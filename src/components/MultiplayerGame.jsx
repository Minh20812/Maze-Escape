import React, { useState, useEffect, useCallback } from "react";
import GameGrid from "./GameGrid";
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

const MultiplayerGame = ({ onBackToMenu }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [multiplayerState, setMultiplayerState] = useState({
    player1: {
      grid: [],
      playerPosition: { x: 0, y: 0 },
      moves: 0,
      isCompleted: false,
      goalsCompleted: 0,
      totalGoals: 0,
    },
    player2: {
      grid: [],
      playerPosition: { x: 0, y: 0 },
      moves: 0,
      isCompleted: false,
      goalsCompleted: 0,
      totalGoals: 0,
    },
    gameStatus: "waiting",
    winner: null,
    currentLevel: 0,
  });

  const player1Controls = {
    up: "w",
    down: "s",
    left: "a",
    right: "d",
    undo: "q",
    reset: "e",
  };

  const player2Controls = {
    up: "arrowup",
    down: "arrowdown",
    left: "arrowleft",
    right: "arrowright",
    undo: "p",
    reset: "o",
  };

  const createPlayerState = useCallback(() => {
    const level = LEVELS[currentLevel];
    if (!level)
      return {
        grid: [],
        playerPosition: { x: 0, y: 0 },
        moves: 0,
        isCompleted: false,
        goalsCompleted: 0,
        totalGoals: 0,
      };

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

    return {
      grid,
      playerPosition,
      moves: 0,
      isCompleted: false,
      goalsCompleted,
      totalGoals,
    };
  }, [currentLevel]);

  const initializeLevel = useCallback(
    (levelIndex) => {
      setCurrentLevel(levelIndex);
      setMultiplayerState({
        player1: createPlayerState(),
        player2: createPlayerState(),
        gameStatus: "playing",
        winner: null,
        currentLevel: levelIndex,
      });
    },
    [createPlayerState]
  );

  const handlePlayerReset = useCallback(
    (player) => {
      const playerKey = player === 1 ? "player1" : "player2";
      const newPlayerState = createPlayerState();

      setMultiplayerState((prev) => ({
        ...prev,
        [playerKey]: newPlayerState,
        gameStatus: "playing",
        winner: null,
      }));
    },
    [createPlayerState]
  );

  useEffect(() => {
    initializeLevel(currentLevel);
  }, [currentLevel, initializeLevel]);

  // ... keep existing code (handlePlayerMove, handleNextLevel, handleReset functions)

  const handlePlayerMove = useCallback(
    (player, direction) => {
      if (multiplayerState.gameStatus !== "playing") return;

      const playerKey = player === 1 ? "player1" : "player2";
      const currentPlayerState = multiplayerState[playerKey];

      if (currentPlayerState.isCompleted) return;

      const newState = movePlayer(currentPlayerState, direction);
      if (newState) {
        const updatedMultiplayerState = {
          ...multiplayerState,
          [playerKey]: newState,
        };

        if (checkWinCondition(newState)) {
          updatedMultiplayerState.gameStatus = "finished";
          updatedMultiplayerState.winner = player;
          updatedMultiplayerState[playerKey] = {
            ...newState,
            isCompleted: true,
          };

          toast.success(`Hoàn thành trong ${newState.moves} nước đi!`);
        }

        setMultiplayerState(updatedMultiplayerState);
      }
    },
    [multiplayerState, toast]
  );

  const handleNextLevel = useCallback(() => {
    if (currentLevel < LEVELS.length - 1) {
      setCurrentLevel((prev) => prev + 1);
    } else {
      toast.success("Bạn đã hoàn thành tất cả các level!");
    }
  }, [currentLevel, toast]);

  const handleReset = useCallback(() => {
    initializeLevel(currentLevel);
  }, [currentLevel, initializeLevel]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key.toLowerCase();

      // Player 1 controls
      if (key === player1Controls.up) {
        event.preventDefault();
        handlePlayerMove(1, "up");
      } else if (key === player1Controls.down) {
        event.preventDefault();
        handlePlayerMove(1, "down");
      } else if (key === player1Controls.left) {
        event.preventDefault();
        handlePlayerMove(1, "left");
      } else if (key === player1Controls.right) {
        event.preventDefault();
        handlePlayerMove(1, "right");
      } else if (key === player1Controls.reset) {
        event.preventDefault();
        handlePlayerReset(1);
      }

      // Player 2 controls
      if (key === player2Controls.up) {
        event.preventDefault();
        handlePlayerMove(2, "up");
      } else if (key === player2Controls.down) {
        event.preventDefault();
        handlePlayerMove(2, "down");
      } else if (key === player2Controls.left) {
        event.preventDefault();
        handlePlayerMove(2, "left");
      } else if (key === player2Controls.right) {
        event.preventDefault();
        handlePlayerMove(2, "right");
      } else if (key === player2Controls.reset) {
        event.preventDefault();
        handlePlayerReset(2);
      }

      // Global reset
      if (key === "r") {
        event.preventDefault();
        handleReset();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handlePlayerMove, handleReset, handlePlayerReset]);

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col justify-between items-center mb-6">
        <div className=" flex justify-between items-center w-full mb-4">
          <h2 className="text-3xl font-bold text-white mb-2">
            Level {currentLevel + 1} - Chế độ 2 người
          </h2>
          <div className="flex gap-2">
            <Button
              onClick={onBackToMenu}
              variant="outline"
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              Quay lại menu
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              Reset tất cả (R)
            </Button>
          </div>
        </div>
      </div>

      {/* Game grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        <div className="text-center">
          <div className="flex justify-around items-center mb-4">
            <h3 className="text-xl font-semibold text-blue-400">
              Người chơi 1
            </h3>
            <Button
              onClick={() => handlePlayerReset(1)}
              variant="outline"
              size="sm"
              className="bg-blue-600 border-blue-500 text-white hover:bg-blue-700"
            >
              Reset (E)
            </Button>
          </div>
          <div className="flex justify-center items-center">
            <div className="text-blue-400">
              <span className="font-semibold">Người chơi 1:</span>{" "}
              {multiplayerState.player1.moves} nước đi
            </div>
          </div>
          <div className="flex justify-center">
            <GameGrid
              grid={multiplayerState.player1.grid}
              playerPosition={multiplayerState.player1.playerPosition}
              imagePlayer="/player1.png"
            />
          </div>
        </div>

        <div className="text-center">
          <div className="flex justify-around items-center mb-4">
            <h3 className="text-xl font-semibold text-purple-400">
              Người chơi 2
            </h3>
            <Button
              onClick={() => handlePlayerReset(2)}
              variant="outline"
              size="sm"
              className="bg-purple-600 border-purple-500 text-white hover:bg-purple-700"
            >
              Reset (O)
            </Button>
          </div>
          <div className="flex justify-center items-center">
            <div className="text-purple-400">
              <span className="font-semibold">Người chơi 2:</span>{" "}
              {multiplayerState.player2.moves} nước đi
            </div>
          </div>
          <div className="flex justify-center">
            <GameGrid
              grid={multiplayerState.player2.grid}
              playerPosition={multiplayerState.player2.playerPosition}
              imagePlayer="/player2.png"
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-center text-sm text-slate-400">
        <div>
          <h4 className="text-blue-400 font-semibold mb-2">
            Điều khiển Người chơi 1
          </h4>
          <p>WASD để di chuyển • E để reset</p>
        </div>
        <div>
          <h4 className="text-purple-400 font-semibold mb-2">
            Điều khiển Người chơi 2
          </h4>
          <p>Phím mũi tên để di chuyển • O để reset</p>
        </div>
      </div>

      {/* Winner dialog */}
      <Dialog
        open={multiplayerState.gameStatus === "finished"}
        onOpenChange={() => {}}
      >
        <DialogContent className="sm:max-w-md flex flex-col items-center">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl text-green-400">
              Người chơi {multiplayerState.winner} thắng! 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              Hoàn thành trong{" "}
              {multiplayerState.winner === 1
                ? multiplayerState.player1.moves
                : multiplayerState.player2.moves}{" "}
              nước đi!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center gap-2">
            <Button
              onClick={handleNextLevel}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={currentLevel >= LEVELS.length - 1}
            >
              Level tiếp theo
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              Chơi lại level này
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MultiplayerGame;
