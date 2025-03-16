import React from 'react';
import { Shield, Target, Zap, Award, Flame, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Explicitly defined class maps that won't get purged by Tailwind
const colorClasses = {
  lime: {
    gradient: 'from-lime-400 to-lime-600',
    border: 'border-lime-400',
    ring: 'ring-lime-400/50',
    text: 'text-lime-100',
  },
  blue: {
    gradient: 'from-blue-400 to-blue-600',
    border: 'border-blue-400',
    ring: 'ring-blue-400/50',
    text: 'text-blue-100',
  },
  purple: {
    gradient: 'from-purple-400 to-purple-600',
    border: 'border-purple-400',
    ring: 'ring-purple-400/50', 
    text: 'text-purple-100',
  },
  amber: {
    gradient: 'from-amber-400 to-amber-600',
    border: 'border-amber-400',
    ring: 'ring-amber-400/50',
    text: 'text-amber-100',
  },
  red: {
    gradient: 'from-red-400 to-red-600',
    border: 'border-red-400',
    ring: 'ring-red-400/50',
    text: 'text-red-100',
  }
};

export const difficultyLevels = {
  rookie: {
    id: 'rookie',
    name: 'Rookie',
    icon: Shield,
    range: '1-100',
    attempts: 10,
    description: 'Perfect for beginners. Guess a number between 1 and 100 with 10 attempts.',
    color: 'lime' // Changed from 'green' to 'lime'
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
  const { currentTheme } = useTheme();
  
  // Function to safely get color classes
  const getColorClasses = (difficulty, isSelected) => {
    const classes = colorClasses[difficulty.color] || colorClasses.blue;
    
    const baseClasses = `
      w-[200px]
      flex-shrink-0
      flex flex-col items-center justify-between
      p-6 rounded-xl text-white font-bold
      transition-all duration-200 shadow-lg
      bg-gradient-to-b ${classes.gradient}
    `;
    
    const selectedClasses = `
      border-2 ${classes.border} ring-2 ${classes.ring}
      ring-offset-1 ring-offset-gray-900
    `;
    
    const unselectedClasses = 'hover:scale-105';
    
    return `${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`;
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm pt-20">
      <div
        className="
          w-full 
          max-w-[95vw]
          sm:max-w-3xl
          md:max-w-4xl
          lg:max-w-5xl
          xl:max-w-6xl
          2xl:max-w-7xl
          mx-auto
          bg-gradient-to-b from-gray-900 to-gray-800
          rounded-2xl 
          overflow-hidden 
          shadow-2xl 
          border 
          border-gray-700 
          max-h-[80vh] 
          overflow-y-auto
        "
      >
        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-700 bg-gray-900 z-10">
          <h1 className="text-2xl font-bold text-white">Select Difficulty Level</h1>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-10 overflow-x-auto">
          <div className="flex gap-10 min-w-max justify-center">
            {Object.values(difficultyLevels).map((difficulty) => {
              const isSelected = selectedDifficulty === difficulty.id;
              const colorClass = colorClasses[difficulty.color] || colorClasses.blue;
              
              return (
                <button
                  key={difficulty.id}
                  onClick={() => onSelectDifficulty(difficulty.id)}
                  className={getColorClasses(difficulty, isSelected)}
                >
                  <difficulty.icon
                    className={`
                      w-12 h-12 mb-6
                      ${isSelected ? colorClass.text : 'text-gray-100'}
                    `}
                  />
                  <div className="text-center w-full space-y-3">
                    <div className="text-xl mb-2">{difficulty.name}</div>
                    <div className="text-sm rounded-full py-1.5 px-3 bg-black/30">
                      {difficulty.range}
                    </div>
                    <div className="text-sm rounded-full py-1.5 px-3 bg-black/30">
                      {difficulty.attempts} attempts
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-4 text-white text-sm font-normal px-4 py-1 rounded-full bg-black/20">
                      Selected
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              {selectedDifficulty && difficultyLevels[selectedDifficulty]?.description}
            </p>
          </div>
        </div>
          
        <div className="sticky bottom-0 p-6 bg-gray-900/90 backdrop-blur-sm flex justify-end space-x-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          
          {selectedDifficulty && (
            <button
              onClick={() => {
                onSelectDifficulty(selectedDifficulty);
                onClose();
              }}
              className={`
                ${currentTheme.buttonBg} 
                text-white px-8 py-3 rounded-lg font-medium transition-colors
              `}
            >
              Start Game
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DifficultySelector;