import React, { useState } from "react";
import Game from "@/components/Game";
import MultiplayerGame from "@/components/MultiplayerGame";
import GameModeSelector from "@/components/GameModeSelector";

const Index = () => {
  const [gameMode, setGameMode] = useState("menu");
  // "menu" | "single" | "multiplayer"

  const handleModeSelect = (mode) => {
    setGameMode(mode);
  };

  const handleBackToMenu = () => {
    setGameMode("menu");
  };

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center p-4 overflow-hidden relative"
      style={{
        backgroundImage: "url('/background2.png')", // Đường dẫn tới hình ảnh trong public
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay để làm tối background và tăng độ tương phản */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="w-full max-w-7xl relative z-10">
        {gameMode === "menu" && (
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
              Maze Escape
            </h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto mb-8">
              Đẩy các khối để mở đường và thoát khỏi mê cung thử thách.
            </p>
            <GameModeSelector onModeSelect={handleModeSelect} />
          </div>
        )}

        {gameMode === "single" && <Game onBackToMenu={handleBackToMenu} />}
        {gameMode === "multiplayer" && (
          <MultiplayerGame onBackToMenu={handleBackToMenu} />
        )}
      </div>
    </div>
  );
};

export default Index;
