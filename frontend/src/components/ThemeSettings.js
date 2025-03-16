import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Palette, Lock, Check, Info, ArrowLeft, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import StripeCheckout from './StripeCheckout';

const ThemeCard = ({ theme, isSelected, isUnlocked, isComingSoon, onSelect, onUnlock }) => {
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
          {isComingSoon ? (
            <>
              <Sparkles className="w-8 h-8 text-yellow-400 mb-2" />
              <p className="text-gray-300 text-sm text-center px-2">
                Coming Soon
              </p>
            </>
          ) : (
            <>
              <Lock className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-gray-300 text-sm text-center px-2">
                Premium Theme
              </p>
            </>
          )}
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
  const { currentTheme, changeTheme, allThemes, isThemeUnlocked, hasPurchasedThemes } = useTheme();
  const [infoMessage, setInfoMessage] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Check for payment success URL parameters
  useEffect(() => {
    const url = new URL(window.location.href);
    const paymentSuccess = url.searchParams.get('payment_success');
    
    if (paymentSuccess === 'true') {
      setInfoMessage('Payment successful! All premium themes unlocked.');
      setTimeout(() => setInfoMessage(''), 5000);
      
      // Clean URL without reloading
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  
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
    } else {
      // If theme is premium and not unlocked
      setInfoMessage('This is a premium theme. Unlock all premium themes for $0.99');
      setTimeout(() => setInfoMessage(''), 3000);
    }
  };
  
  const handleUnlock = () => {
    setShowCheckout(true);
  };
  
  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    setInfoMessage('All premium themes unlocked! Enjoy your new look.');
    setTimeout(() => setInfoMessage(''), 3000);
  };
  
  const handleCheckoutClose = () => {
    setShowCheckout(false);
  };
  
  // Determine which themes to show as available vs coming soon
  const availableThemes = ['classic', 'emerald', 'amethyst', 'sunset', 'midnight']; // All themes are available, some may be premium
  const comingSoonThemes = []; // No coming soon themes for now
  
  return (
    <div className={`bg-gradient-to-b ${currentTheme.background} min-h-screen pt-16 pb-20 px-4`}>
      <div className="max-w-4xl mx-auto">
        {showCheckout ? (
          <StripeCheckout 
            onSuccess={handleCheckoutSuccess} 
            onClose={handleCheckoutClose} 
          />
        ) : (
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
            
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-300">
                Customize your Number Ninja experience with different color themes.
              </p>
              
              {!hasPurchasedThemes && (
                <button 
                  onClick={handleUnlock}
                  className={`flex items-center text-${currentTheme.primary}-400 hover:text-${currentTheme.primary}-300 bg-${currentTheme.primary}-900/30 px-3 py-1.5 rounded-lg transition-colors`}
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  <span>Unlock All for $0.99</span>
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {Object.values(allThemes).map((theme) => (
                <ThemeCard 
                  key={theme.id}
                  theme={theme}
                  isSelected={currentTheme.id === theme.id}
                  isUnlocked={isThemeUnlocked(theme.id)}
                  isComingSoon={comingSoonThemes.includes(theme.id)}
                  onSelect={handleSelect}
                  onUnlock={handleUnlock}
                />
              ))}
            </div>
            
            {infoMessage && (
              <div className="mt-4 p-3 bg-blue-900/30 border border-blue-800 rounded-lg flex items-center">
                <Info className="w-5 h-5 text-blue-400 mr-2" />
                <p className="text-blue-300 text-sm">{infoMessage}</p>
              </div>
            )}
            
            {!hasPurchasedThemes && (
              <div className="mt-8 p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                <div className="flex items-center mb-2">
                  <Sparkles className={`w-5 h-5 text-${currentTheme.primary}-400 mr-2`} />
                  <h3 className="text-white font-medium">Premium Themes</h3>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Unlock all premium themes and future theme updates for just $0.99.
                </p>
                <button
                  onClick={handleUnlock}
                  className={`${currentTheme.buttonBg} text-white px-6 py-2 rounded-lg font-medium transition-all text-sm`}
                >
                  Unlock All Themes
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSettings;