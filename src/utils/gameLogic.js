import { TileType } from "@/types/game";

export const movePlayer = (gameState, direction) => {
  const { grid, playerPosition, moves, goalsCompleted } = gameState;
  const newPosition = getNewPosition(playerPosition, direction);

  // Check if new position is valid
  if (!isValidPosition(grid, newPosition)) {
    return null;
  }

  const targetTile = grid[newPosition.y][newPosition.x];

  // If target is a wall or closed exit, can't move
  if (targetTile === TileType.WALL || targetTile === TileType.CLOSED_EXIT) {
    return null;
  }

  // If target is a block, try to push it
  if (targetTile === TileType.BLOCK) {
    const blockNewPosition = getNewPosition(newPosition, direction);

    // Check if block can be pushed
    if (!canPushBlock(grid, blockNewPosition)) {
      return null;
    }

    // Create new grid with moved block
    const newGrid = grid.map((row) => [...row]);
    newGrid[newPosition.y][newPosition.x] = TileType.FLOOR;

    // Check if block is being pushed onto a goal
    let newGoalsCompleted = goalsCompleted;
    if (newGrid[blockNewPosition.y][blockNewPosition.x] === TileType.GOAL) {
      newGoalsCompleted++;
    }

    // Check if block is being pushed off a goal
    if (
      targetTile === TileType.BLOCK &&
      grid[newPosition.y][newPosition.x] === TileType.GOAL
    ) {
      newGoalsCompleted--;
    }

    newGrid[blockNewPosition.y][blockNewPosition.x] = TileType.BLOCK;

    // Check if all goals are completed and update exit state
    const totalGoals = countGoals(newGrid) + newGoalsCompleted;

    // Open exit if all goals are completed
    if (newGoalsCompleted === totalGoals) {
      for (let y = 0; y < newGrid.length; y++) {
        for (let x = 0; x < newGrid[y].length; x++) {
          if (newGrid[y][x] === TileType.CLOSED_EXIT) {
            newGrid[y][x] = TileType.EXIT;
          }
        }
      }
    }

    return {
      ...gameState,
      grid: newGrid,
      playerPosition: newPosition,
      moves: moves + 1,
      goalsCompleted: newGoalsCompleted,
      totalGoals,
    };
  }

  // Normal move (to floor, goal or exit)
  return {
    ...gameState,
    playerPosition: newPosition,
    moves: moves + 1,
  };
};

export const canPushBlock = (grid, position) => {
  if (!isValidPosition(grid, position)) {
    return false;
  }

  const targetTile = grid[position.y][position.x];
  return (
    targetTile === TileType.FLOOR ||
    targetTile === TileType.GOAL ||
    targetTile === TileType.EXIT
  );
};

export const isValidPosition = (grid, position) => {
  return (
    position.y >= 0 &&
    position.y < grid.length &&
    position.x >= 0 &&
    position.x < grid[0].length
  );
};

export const getNewPosition = (position, direction) => {
  switch (direction) {
    case "up":
      return { x: position.x, y: position.y - 1 };
    case "down":
      return { x: position.x, y: position.y + 1 };
    case "left":
      return { x: position.x - 1, y: position.y };
    case "right":
      return { x: position.x + 1, y: position.y };
    default:
      return position;
  }
};

export const checkWinCondition = (gameState) => {
  const { grid, playerPosition } = gameState;
  const currentTile = grid[playerPosition.y][playerPosition.x];
  return currentTile === TileType.EXIT;
};

export const countGoals = (grid) => {
  let count = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === TileType.GOAL) {
        count++;
      }
    }
  }
  return count;
};

export const countInitialGoalsCompleted = (grid) => {
  let count = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      // If there's a block on a goal, count it as completed
      if (grid[y][x] === TileType.BLOCK) {
        // Check all adjacent cells for a goal
        if (
          (y > 0 && grid[y - 1][x] === TileType.GOAL) ||
          (y < grid.length - 1 && grid[y + 1][x] === TileType.GOAL) ||
          (x > 0 && grid[y][x - 1] === TileType.GOAL) ||
          (x < grid[y].length - 1 && grid[y][x + 1] === TileType.GOAL)
        ) {
          count++;
        }
      }
    }
  }
  return count;
};
