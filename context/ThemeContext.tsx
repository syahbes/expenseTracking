// context/ThemeContext.tsx
import { initializeDatabase } from '@/database/database';
import { getSetting, updateSetting } from '@/database/settingsService';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => Promise<void>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from database on app start
  useEffect(() => {
    loadThemeFromDatabase();
  }, []);

  const loadThemeFromDatabase = async () => {
    try {
      setIsLoading(true);

      // Initialize database first
      await initializeDatabase();

      // Load theme from database
      const savedTheme = await getSetting('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme);
      } else {
        // Default to light theme if no theme is saved
        setThemeState('light');
      }
    } catch (error) {
      console.error('Error loading theme from database:', error);
      // Fallback to light theme
      setThemeState('light');
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      // Save to database first
      await updateSetting('theme', newTheme);

      // Then update state
      setThemeState(newTheme);
    } catch (error) {
      console.error('Error saving theme to database:', error);
      // Still update the state for immediate UI feedback
      setThemeState(newTheme);
    }
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    isLoading,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
