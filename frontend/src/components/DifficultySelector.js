import React from 'react';
import { Shield, Target, Zap, Award, Flame } from 'lucide-react';

export const difficultyLevels = {
  rookie: {
    id: 'rookie',
    name: 'Rookie',
    icon: Shield,
    range: '1-100',
    attempts: 10,
    description: 'Perfect for beginners. Guess a number between 1 and 100 with 10 attempts.',
    color: 'green'
  },
  ninja: {
    id: 'ninja',
    name: 'Ninja',
    icon: Target,
    range: '1-1000',
    attempts: 5,
    description: 'The standard challenge. Guess a number between 1 and 1000 with 5 attempts.',
    color: 'blue'
  },
  master: {
    id: 'master',
    name: 'Master',
    icon: Zap,
    range: '1-10000',
    attempts: 5,
    description: 'For the skilled. Guess a number between 1 and 10000 with 5 attempts.',
    color: 'purple'
  },
  grandmaster: {
    id: 'grandmaster',
    name: 'Grandmaster',
    icon: Award,
    range: '1-1000',
    attempts: 3,
    description: 'A true test. Guess a number between 1 and 1000 with only 3 attempts.',
    color: 'amber'
  },
  legendary: {
    id: 'legendary',
    name: 'Legendary',
    icon: Flame,
    range: '1-10000',
    attempts: 3,
    description: 'The ultimate challenge. Guess a number between 1 and 10000 with only 3 attempts.',
    color: 'red'
  }
};

const DifficultySelector = ({ selectedDifficulty, onSelectDifficulty, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="max-w-2xl w-full mx-4 bg-gradient-to-b from-blue-900 to-blue-700 rounded-2xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white text-center mb-8">Select Difficulty Level</h1>
          
          <div className="flex flex-col space-y-3">
            {Object.values(difficultyLevels).map((difficulty) => (
              <button
                key={difficulty.id}
                onClick={() => onSelectDifficulty(difficulty.id)}
                className={`w-full py-4 px-6 rounded-lg text-white font-bold transition-all duration-200 flex items-center
                  ${selectedDifficulty === difficulty.id 
                    ? `bg-gradient-to-r from-${difficulty.color}-600 to-${difficulty.color}-800 border-2 border-${difficulty.color}-400` 
                    : 'bg-blue-800/80 hover:bg-blue-700 border border-blue-600/30 hover:border-blue-500'}`
                }
              >
                <difficulty.icon className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="text-lg">{difficulty.name}</div>
                  <div className="text-xs text-gray-300 mt-1">{difficulty.range} • {difficulty.attempts} attempts</div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-blue-200 max-w-lg mx-auto mb-6">
              {selectedDifficulty && difficultyLevels[selectedDifficulty]?.description}
            </p>
          </div>
          
          <div className="mt-8 flex justify-center space-x-4">
            {selectedDifficulty && (
              <button
                onClick={() => onSelectDifficulty(selectedDifficulty)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Start Game
              </button>
            )}
            
            <button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold transition-colors"
            >
              Back to Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DifficultySelector;