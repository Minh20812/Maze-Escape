export enum TileType {
  WALL = "#",
  FLOOR = ".",
  BLOCK = "B",
  PLAYER = "P",
  EXIT = "E",
  GOAL = "G",
  CLOSED_EXIT = "C",
}

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  grid: TileType[][];
  playerPosition: Position;
  moves: number;
  isCompleted: boolean;
  goalsCompleted: number;
  totalGoals: number;
}

export interface Level {
  id: number;
  name: string;
  grid: TileType[][];
}
