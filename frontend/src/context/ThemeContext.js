import React, { createContext, useState, useContext, useEffect } from 'react';

// Define available themes
export const themes = {
  classic: {
    id: 'classic',
    name: 'Classic Blue',
    primary: 'blue',
    secondary: 'purple',
    accent: 'yellow',
    background: 'from-gray-900 to-gray-800',
    cardBg: 'bg-gray-800/50',
    buttonBg: 'bg-blue-600 hover:bg-blue-700',
    isDefault: true,
    isPremium: false
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Ninja',
    primary: 'emerald',
    secondary: 'teal',
    accent: 'amber',
    background: 'from-gray-900 to-emerald-900',
    cardBg: 'bg-emerald-900/50',
    buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
    isDefault: false,
    isPremium: false
  },
  amethyst: {
    id: 'amethyst',
    name: 'Amethyst',
    primary: 'purple',
    secondary: 'indigo',
    accent: 'pink',
    background: 'from-gray-900 to-purple-900',
    cardBg: 'bg-purple-900/40',
    buttonBg: 'bg-purple-600 hover:bg-purple-700',
    isDefault: false,
    isPremium: true
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Warrior',
    primary: 'orange',
    secondary: 'red',
    accent: 'yellow',
    background: 'from-gray-900 to-orange-900',
    cardBg: 'bg-orange-900/30',
    buttonBg: 'bg-orange-600 hover:bg-orange-700',
    isDefault: false,
    isPremium: true
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Gold',
    primary: 'yellow',
    secondary: 'amber',
    accent: 'white',
    background: 'from-black to-gray-900',
    cardBg: 'bg-black/50',
    buttonBg: 'bg-yellow-600 hover:bg-yellow-700',
    isDefault: false,
    isPremium: true
  }
};

// Create the context
const ThemeContext = createContext();

// Create hook for easy usage
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Initialize with saved theme or default
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('numberNinjaTheme');
    return savedTheme && themes[savedTheme] ? themes[savedTheme] : themes.classic;
  });
  
  // Track unlocked themes
  const [unlockedThemes, setUnlockedThemes] = useState(() => {
    const saved = localStorage.getItem('unlockedThemes');
    return saved ? JSON.parse(saved) : ['classic', 'emerald']; // Default unlocked themes
  });

  // Save theme changes to localStorage
  useEffect(() => {
    localStorage.setItem('numberNinjaTheme', currentTheme.id);
  }, [currentTheme]);

  // Save unlocked themes to localStorage
  useEffect(() => {
    localStorage.setItem('unlockedThemes', JSON.stringify(unlockedThemes));
  }, [unlockedThemes]);

  // Set a new theme
  const changeTheme = (themeId) => {
    if (themes[themeId] && unlockedThemes.includes(themeId)) {
      setCurrentTheme(themes[themeId]);
      return true;
    }
    return false;
  };

  // Unlock a new theme
  const unlockTheme = (themeId) => {
    if (themes[themeId] && !unlockedThemes.includes(themeId)) {
      setUnlockedThemes([...unlockedThemes, themeId]);
      return true;
    }
    return false;
  };

  // Unlock all themes (e.g., after purchase)
  const unlockAllThemes = () => {
    setUnlockedThemes(Object.keys(themes));
  };

  // Check if a theme is unlocked
  const isThemeUnlocked = (themeId) => {
    return unlockedThemes.includes(themeId);
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      changeTheme,
      allThemes: themes,
      unlockedThemes,
      unlockTheme,
      unlockAllThemes,
      isThemeUnlocked
    }}>
      {children}
    </ThemeContext.Provider>
  );
};