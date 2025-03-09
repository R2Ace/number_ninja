import React, { useState } from 'react';
import { useTheme, themes } from '../context/ThemeContext';
import { Palette, Lock, Check, Crown } from 'lucide-react';

const ThemeCard = ({ theme, isSelected, isUnlocked, onSelect }) => {
  return (
    <div 
      className={`relative rounded-lg p-4 border transition-all cursor-pointer 
        ${isSelected 
          ? `border-${theme.primary}-500 ring-2 ring-${theme.primary}-500/50` 
          : 'border-gray-700 hover:border-gray-600'} 
        ${theme.cardBg}`}
      onClick={() => isUnlocked && onSelect(theme.id)}
    >
      {/* Premium badge */}
      {theme.isPremium && (
        <div className="absolute top-2 right-2">
          <Crown className={`w-4 h-4 text-${theme.accent}-500`} />
        </div>
      )}
      
      {/* Lock overlay for locked themes */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
          <Lock className="w-8 h-8 text-gray-400" />
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
  const { currentTheme, changeTheme, allThemes, isThemeUnlocked, unlockAllThemes } = useTheme();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  
  const handleSelect = (themeId) => {
    changeTheme(themeId);
  };
  
  const handlePurchase = () => {
    // This would connect to your payment processor in a real implementation
    // For now, we'll just simulate a successful purchase
    setTimeout(() => {
      unlockAllThemes();
      setShowPurchaseModal(false);
    }, 1500);
  };
  
  return (
    <div className={`bg-gradient-to-b ${currentTheme.background} min-h-screen pt-16 pb-20 px-4`}>
      <div className="max-w-4xl mx-auto">
        <div className={`${currentTheme.cardBg} backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8`}>
          <div className="flex items-center space-x-3 mb-8">
            <Palette className={`w-6 h-6 text-${currentTheme.primary}-500`} />
            <h2 className="text-2xl font-bold text-white">Theme Settings</h2>
          </div>
          
          <p className="text-gray-300 mb-6">
            Customize your Number Ninja experience with different color themes. 
            Premium themes can be unlocked with a one-time purchase.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {Object.values(allThemes).map((theme) => (
              <ThemeCard 
                key={theme.id}
                theme={theme}
                isSelected={currentTheme.id === theme.id}
                isUnlocked={isThemeUnlocked(theme.id)}
                onSelect={handleSelect}
              />
            ))}
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={() => setShowPurchaseModal(true)}
              className={`${currentTheme.buttonBg} text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all`}
            >
              <Crown className="w-5 h-5" />
              <span>Unlock All Themes ($5.00)</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className={`${currentTheme.cardBg} max-w-md w-full rounded-2xl p-8 backdrop-blur-sm`}>
            <h3 className="text-xl font-bold text-white mb-4">Unlock All Themes</h3>
            <p className="text-gray-300 mb-6">
              Get access to all current and future Number Ninja themes with a one-time purchase of $5.00.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handlePurchase}
                className={`w-full ${currentTheme.buttonBg} text-white py-3 rounded-lg font-medium`}
              >
                Complete Purchase
              </button>
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSettings;