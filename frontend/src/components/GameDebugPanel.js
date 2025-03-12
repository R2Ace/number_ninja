// This component will display some debug information about the game state
// and allow you to force reset the game in development mode.
import React from 'react';
import { Bug, RefreshCw } from 'lucide-react';

const GameDebugPanel = ({ 
  sessionId, 
  difficulty, 
  maxNumber, 
  maxAttempts,
  onResetGame 
}) => {
  return (
    <div className="mt-4 p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Bug className="w-3 h-3 text-red-400 mr-1" />
          <span className="text-gray-400 font-medium">Debug Info</span>
        </div>
        <button 
          onClick={onResetGame}
          className="text-blue-400 hover:text-blue-300 flex items-center"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          <span>Force Reset</span>
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-1">
        <div className="text-gray-500">Session ID:</div>
        <div className="text-gray-300 truncate" title={sessionId}>{sessionId || 'None'}</div>
        
        <div className="text-gray-500">Difficulty:</div>
        <div className="text-gray-300">{difficulty}</div>
        
        <div className="text-gray-500">Max Number:</div>
        <div className="text-gray-300">{maxNumber}</div>
        
        <div className="text-gray-500">Max Attempts:</div>
        <div className="text-gray-300">{maxAttempts}</div>
      </div>
    </div>
  );
};

export default GameDebugPanel;

// Then in Game.js, import and add this component:
// At the top of Game.js:
import GameDebugPanel from './GameDebugPanel';

// Add this function to Game.js:
const forceResetGame = () => {
  // Generate a completely new session ID
  const newSessionId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log("Force resetting game with new session ID:", newSessionId);
  
  // Reset all game state
  setSessionId(newSessionId);
  setAttempts(0);
  setGameOver(false);
  setScore(0);
  setFeedback('');
  setFeedbackType('');
  
  // Start a new game with current settings
  startGame(newSessionId, { 
    difficulty, 
    maxNumber, 
    maxAttempts 
  })
  .then(() => {
    console.log("Game force reset successful");
  })
  .catch(error => {
    console.error("Error force resetting game:", error);
    setFeedback("There was an error resetting the game. Please reload the page.");
    setFeedbackType("error");
  });
};

// Then add the debug panel at the bottom of your game section
// (Only during development - you can remove this for production)
{process.env.NODE_ENV !== 'production' && (
  <GameDebugPanel
    sessionId={sessionId}
    difficulty={difficulty}
    maxNumber={maxNumber}
    maxAttempts={maxAttempts}
    onResetGame={forceResetGame}
  />
)}