// context/ThemeContext.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// You'll need to replace this with your actual database service
// import { DatabaseService } from '@/services/database';

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
      // Replace this with your actual database call
      // const savedTheme = await DatabaseService.getTheme();
      // if (savedTheme) {
      //   setThemeState(savedTheme);
      // }
      
      // Temporary placeholder - replace with your DB call
      const savedTheme = 'light'; // This should come from your SQLite database
      setThemeState(savedTheme);
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
      // await DatabaseService.saveTheme(newTheme);
      
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

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
