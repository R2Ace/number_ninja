import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Shield, Target, Zap, Award, Flame } from 'lucide-react';

// Define difficulty levels
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

const DifficultyCard = ({ difficulty, isSelected, onSelect }) => {
  const { currentTheme } = useTheme();
  const Icon = difficulty.icon;
  
  return (
    <button
      onClick={() => onSelect(difficulty.id)}
      className={`w-full text-left border p-4 rounded-lg transition-all
        ${isSelected 
          ? `border-${difficulty.color}-500 bg-${difficulty.color}-500/10` 
          : `border-gray-700 hover:border-${difficulty.color}-500/50 ${currentTheme.cardBg}`}`}
    >
      <div className="flex items-center space-x-3 mb-2">
        <Icon className={`w-5 h-5 text-${difficulty.color}-500`} />
        <h3 className="font-bold text-white">{difficulty.name}</h3>
      </div>
      
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-400">Range: {difficulty.range}</span>
        <span className="text-gray-400">Attempts: {difficulty.attempts}</span>
      </div>
      
      <p className="text-gray-300 text-sm">{difficulty.description}</p>
    </button>
  );
};

const DifficultySelector = ({ selectedDifficulty, onSelectDifficulty }) => {
  const { currentTheme } = useTheme();
  
  const handleSelect = (difficultyId) => {
    onSelectDifficulty(difficultyId);
  };
  
  return (
    <div className={`${currentTheme.cardBg} backdrop-blur-sm border border-gray-700/50 rounded-xl p-6`}>
      <h2 className={`text-xl font-bold text-white mb-4 flex items-center`}>
        <Target className={`w-5 h-5 text-${currentTheme.primary}-500 mr-2`} />
        Difficulty Level
      </h2>
      
      <div className="space-y-3">
        {Object.values(difficultyLevels).map((difficulty) => (
          <DifficultyCard 
            key={difficulty.id}
            difficulty={difficulty}
            isSelected={selectedDifficulty === difficulty.id}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;