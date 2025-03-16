// Updated ThemeContext.js with Stripe integration

import React, { createContext, useState, useContext, useEffect } from 'react';

// Enhanced theme definitions with more style properties
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
    headingGradient: 'from-blue-400 to-purple-500',
    accentText: 'text-blue-400',
    highlightText: 'text-blue-500',
    bannerGradient: 'from-indigo-800 to-purple-800',
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
    cardBg: 'bg-emerald-900/30',
    buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
    headingGradient: 'from-emerald-400 to-teal-500',
    accentText: 'text-emerald-400',
    highlightText: 'text-emerald-500',
    bannerGradient: 'from-teal-800 to-emerald-800',
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
    headingGradient: 'from-purple-400 to-indigo-500',
    accentText: 'text-purple-400',
    highlightText: 'text-purple-500',
    bannerGradient: 'from-indigo-800 to-purple-800',
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
    headingGradient: 'from-orange-400 to-red-500',
    accentText: 'text-orange-400',
    highlightText: 'text-orange-500',
    bannerGradient: 'from-red-800 to-orange-800',
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
    headingGradient: 'from-yellow-400 to-amber-500',
    accentText: 'text-yellow-400',
    highlightText: 'text-yellow-500',
    bannerGradient: 'from-amber-800 to-yellow-800',
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
  
  // Initialize with saved purchase status
  const [hasPurchasedThemes, setHasPurchasedThemes] = useState(() => {
    return localStorage.getItem('numberNinjaPremiumThemes') === 'true';
  });

  // Define which themes are unlocked by default
  const defaultUnlockedThemes = ['classic', 'emerald'];

  // Save theme changes to localStorage
  useEffect(() => {
    localStorage.setItem('numberNinjaTheme', currentTheme.id);
  }, [currentTheme]);

  // Check purchase status on Stripe success URL
  useEffect(() => {
    const url = new URL(window.location.href);
    const paymentSuccess = url.searchParams.get('payment_success');
    
    if (paymentSuccess === 'true') {
      // Clean URL without reloading
      window.history.replaceState({}, document.title, window.location.pathname);
      // Store that themes have been purchased
      localStorage.setItem('numberNinjaPremiumThemes', 'true');
      setHasPurchasedThemes(true);
    }
  }, []);

  // Set a new theme
  const changeTheme = (themeId) => {
    if (themes[themeId]) {
      // Check if theme is premium and not purchased
      if (themes[themeId].isPremium && !hasPurchasedThemes) {
        return false;
      }
      
      setCurrentTheme(themes[themeId]);
      return true;
    }
    return false;
  };

  // Check if a theme is unlocked
  const isThemeUnlocked = (themeId) => {
    // Non-existent theme
    if (!themes[themeId]) return false;
    
    // Not premium theme
    if (!themes[themeId].isPremium) return true;
    
    // Premium theme - check if purchased
    return hasPurchasedThemes;
  };

  // Set purchase status (used after successful checkout)
  const setPurchaseStatus = (status) => {
    setHasPurchasedThemes(status);
    localStorage.setItem('numberNinjaPremiumThemes', status ? 'true' : 'false');
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      changeTheme,
      allThemes: themes,
      isThemeUnlocked,
      hasPurchasedThemes,
      setPurchaseStatus
    }}>
      {children}
    </ThemeContext.Provider>
  );
};