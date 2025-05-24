import React from "react";
import { TileType } from "@/types/game";

const GameGrid = ({ grid, playerPosition, imagePlayer }) => {
  const getTileClassName = (tileType) => {
    const baseClasses =
      "w-10 h-10 md:w-12 md:h-12 transition-all duration-200 border border-slate-600/30";

    switch (tileType) {
      case TileType.WALL:
        return `${baseClasses} bg-slate-700 shadow-inner`;
      case TileType.FLOOR:
        return `${baseClasses} bg-slate-200`;
      case TileType.BLOCK:
        return `${baseClasses} bg-amber-500 shadow-lg border-amber-600`;
      case TileType.EXIT:
        return `${baseClasses} bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg animate-pulse`;
      case TileType.GOAL:
        return `${baseClasses} bg-rose-300 border-rose-400 shadow-inner`;
      case TileType.CLOSED_EXIT:
        return `${baseClasses} bg-red-500 shadow-lg border-red-600`;
      default:
        return `${baseClasses} bg-slate-300`;
    }
  };

  return (
    <div className="inline-block bg-slate-900/50 p-4 rounded-xl border border-slate-600/50">
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${
            grid[0]?.length || 0
          }, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, y) =>
          row.map((tile, x) => (
            <div key={`${x}-${y}`} className="relative">
              <div className={getTileClassName(tile)} />
              {playerPosition.x === x && playerPosition.y === y && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full shadow-lg border-2 border-white">
                    <div className="absolute inset-1 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full">
                      <img
                        src={imagePlayer || "/player1.png"}
                        alt="player"
                        className=" rounded-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameGrid;
