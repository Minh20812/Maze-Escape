import React from "react";
import { Button } from "@/components/ui/button";

const GameModeSelector = ({ onModeSelect }) => {
  return (
    <div className="text-center space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-4">Chọn chế độ chơi</h2>
        <p className="text-slate-300 text-lg">
          Chọn chế độ chơi một mình hoặc thi đua với bạn bè
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          onClick={() => onModeSelect("single")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold min-w-48"
        >
          🎮 Chơi một mình
        </Button>

        <Button
          onClick={() => onModeSelect("multiplayer")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg font-semibold min-w-48"
        >
          👥 Chơi 2 người
        </Button>
      </div>

      <div className="text-slate-400 text-sm max-w-2xl mx-auto">
        <p className="mb-2">
          <strong>Chế độ một mình:</strong> Chơi theo tốc độ của bạn, có thể
          undo và reset
        </p>
        <p>
          <strong>Chế độ 2 người:</strong> Thi đua với bạn bè trên cùng một
          level, ai hoàn thành trước thắng!
        </p>
      </div>
    </div>
  );
};

export default GameModeSelector;
