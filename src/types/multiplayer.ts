import { GameState } from "./game";

export interface MultiplayerGameState {
  player1: GameState;
  player2: GameState;
  gameStatus: "waiting" | "playing" | "finished";
  winner: 1 | 2 | null;
  currentLevel: number;
}

export interface PlayerControls {
  up: string;
  down: string;
  left: string;
  right: string;
  undo: string;
  reset: string;
}
