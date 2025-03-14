import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { PaintBucket, Check, AlertCircle } from 'lucide-react';

const ThemeVerification = () => {
  const { currentTheme, changeTheme, allThemes, isThemeUnlocked } = useTheme();
  
  // List of components to check for theme compatibility
  const componentsToCheck = [
    'LandingPage',
    'Game',
    'Banner',
    'Footer',
    'DailyChallenge',
    'LearnMore',
    'Login/Register',
    'ThemeSettings',
    'PasswordReset',
    'GameHistory'
  ];
  
  // Define what theme properties should be used in each component
  const themePropertiesUsage = {
    'background': ['LandingPage', 'Game', 'LearnMore', 'Login/Register', 'ThemeSettings'],
    'cardBg': ['Game', 'ThemeSettings', 'Login/Register', 'LearnMore', 'GameHistory'],
    'buttonBg': ['All components with buttons'],
    'primary': ['Icons, accents, highlights in all components'],
    'secondary': ['Gradients, secondary accents'],
    'accent': ['Special highlights, badges']
  };
  
  return (
    <div className={`${currentTheme.cardBg} backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 max-w-lg mx-auto my-8`}>
      <div className="flex items-center space-x-3 mb-4">
        <PaintBucket className={`w-6 h-6 text-${currentTheme.primary}-500`} />
        <h2 className="text-xl font-bold text-white">Theme Verification</h2>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-300 mb-2">Current Theme: <span className="font-bold text-white">{currentTheme.name}</span></p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className={`h-6 rounded bg-${currentTheme.primary}-600`}></div>
          <div className={`h-6 rounded bg-${currentTheme.secondary}-600`}></div>
          <div className={`h-6 rounded bg-${currentTheme.accent}-500`}></div>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-white font-medium mb-2">Component Checklist:</h3>
        <div className="space-y-2">
          {componentsToCheck.map(component => (
            <div key={component} className="flex items-center justify-between">
              <span className="text-gray-300">{component}</span>
              <Check className="w-5 h-5 text-green-500" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-gray-700 pt-4 mt-4">
        <div className="flex items-center mb-2">
          <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
          <h3 className="text-white font-medium">Common Theme Issues:</h3>
        </div>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Check for hardcoded color classes in components</li>
          <li>• Ensure gradients use theme colors</li>
          <li>• Verify hover/focus states respect the theme</li>
          <li>• Test all pages with both themes</li>
        </ul>
      </div>
      
      <div className="mt-6 flex flex-wrap gap-2">
        {Object.entries(allThemes)
          .filter(([id]) => isThemeUnlocked(id))
          .map(([id, theme]) => (
            <button
              key={id}
              onClick={() => changeTheme(id)}
              className={`px-3 py-1.5 rounded-lg text-white text-sm ${
                currentTheme.id === id 
                  ? `bg-${theme.primary}-600 font-bold` 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {theme.name}
            </button>
          ))}
      </div>
    </div>
  );
};

export default ThemeVerification;
