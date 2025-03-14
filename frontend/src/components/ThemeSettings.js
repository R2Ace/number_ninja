import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Palette, Lock, Check, Info, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeCard = ({ theme, isSelected, isUnlocked, isComingSoon, onSelect }) => {
  return (
    <div 
      className={`relative rounded-lg p-4 border transition-all ${
        isSelected 
          ? `border-${theme.primary}-500 ring-2 ring-${theme.primary}-500/50` 
          : 'border-gray-700 hover:border-gray-600'} 
        ${theme.cardBg} ${!isUnlocked || isComingSoon ? 'opacity-70' : ''}`}
      onClick={() => isUnlocked && !isComingSoon && onSelect(theme.id)}
    >
      {/* Coming Soon badge */}
      {isComingSoon && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-xs text-black font-bold px-2 py-1 rounded-full">
          Coming Soon
        </div>
      )}
      
      {/* Lock overlay for locked themes */}
      {(!isUnlocked || isComingSoon) && (
        <div className="absolute inset-0 bg-black/70 rounded-lg flex flex-col items-center justify-center">
          <Lock className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-gray-300 text-sm text-center px-2">
            {isComingSoon ? "Coming Soon" : "Premium Theme"}
          </p>
        </div>
      )}
      
      <div className="flex items-center space-x-3 mb-2">
        <div className={`w-4 h-4 rounded-full bg-${theme.primary}-500`}></div>
        <h3 className="text-white font-medium">{theme.name}</h3>
        {isSelected && <Check className={`w-4 h-4 text-${theme.primary}-500 ml-auto`} />}
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className={`h-6 rounded bg-${theme.primary}-600`}></div>
        <div className={`h-6 rounded bg-${theme.secondary}-600`}></div>
        <div className={`h-6 rounded bg-${theme.accent}-500`}></div>
      </div>
    </div>
  );
};

const ThemeSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTheme, changeTheme, allThemes, isThemeUnlocked } = useTheme();
  const [infoMessage, setInfoMessage] = useState('');
  
  // Determine where to navigate back to
  const handleBack = () => {
    // Try to go back to the referring page
    if (location.state?.from) {
      navigate(location.state.from);
    } else if (location.state?.returnToGame) {
      navigate('/game');
    } else {
      // Default to game page if no specific return path
      navigate('/game');
    }
  };
  
  const handleSelect = (themeId) => {
    const success = changeTheme(themeId);
    if (success) {
      setInfoMessage(`Theme changed to ${allThemes[themeId].name}`);
      setTimeout(() => setInfoMessage(''), 2000);
    }
  };
  
  const showComingSoonMessage = () => {
    setInfoMessage('More themes will be available in future updates. Stay tuned!');
    setTimeout(() => setInfoMessage(''), 3000);
  };
  
  // Determine which themes to show as available vs coming soon
  const availableThemes = ['classic', 'emerald']; // Only these two themes are initially available
  
  return (
    <div className={`bg-gradient-to-b ${currentTheme.background} min-h-screen pt-16 pb-20 px-4`}>
      <div className="max-w-4xl mx-auto">
        <div className={`${currentTheme.cardBg} backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8`}>
          {/* Header with back button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Palette className={`w-6 h-6 text-${currentTheme.primary}-500`} />
              <h2 className="text-2xl font-bold text-white">Theme Settings</h2>
            </div>
            <button 
              onClick={handleBack}
              className={`flex items-center text-${currentTheme.primary}-400 hover:text-${currentTheme.primary}-300 transition-colors`}
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span>Back to Game</span>
            </button>
          </div>
          
          <p className="text-gray-300 mb-6">
            Customize your Number Ninja experience with different color themes.
            Additional themes will be available in future updates!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {Object.values(allThemes).map((theme) => (
              <ThemeCard 
                key={theme.id}
                theme={theme}
                isSelected={currentTheme.id === theme.id}
                isUnlocked={isThemeUnlocked(theme.id)}
                isComingSoon={!availableThemes.includes(theme.id) && theme.id !== 'classic'}
                onSelect={handleSelect}
              />
            ))}
          </div>
          
          {infoMessage && (
            <div className="mt-4 p-3 bg-blue-900/30 border border-blue-800 rounded-lg flex items-center">
              <Info className="w-5 h-5 text-blue-400 mr-2" />
              <p className="text-blue-300 text-sm">{infoMessage}</p>
            </div>
          )}
          
          <div className="mt-8 flex justify-center">
            <button
              onClick={showComingSoonMessage}
              className={`${currentTheme.buttonBg} text-white px-6 py-3 rounded-lg font-medium transition-all`}
            >
              <span>More Themes Coming Soon!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;