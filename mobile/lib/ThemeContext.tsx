import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export type ColorTheme = {
  primary: string;
  onPrimary: string;
  secondary: string;
  onSecondary: string;
  tertiary: string;
  onTertiary: string;
  neutral: string;
  background: string;
  surface: string;
  surfaceDim: string;
  onSurface: string;
  onSurfaceVariant: string;
  outline: string;
  error: string;
  errorContainer: string;
  onErrorContainer: string;
  scrim: string;
};

const lightColors: ColorTheme = {
  primary: '#2563eb',
  onPrimary: '#ffffff',
  secondary: '#6b7280',
  onSecondary: '#ffffff',
  tertiary: '#bc4b00',
  onTertiary: '#ffffff',
  neutral: '#757681',
  background: '#f9fafb',
  surface: '#ffffff',
  surfaceDim: '#f3f4f6',
  onSurface: '#111827',
  onSurfaceVariant: '#6b7280',
  outline: '#e5e7eb',
  error: '#dc2626',
  errorContainer: '#fee2e2',
  onErrorContainer: '#b91c1c',
  scrim: 'rgba(0, 0, 0, 0.4)',
};

const darkColors: ColorTheme = {
  primary: '#3b82f6',
  onPrimary: '#ffffff',
  secondary: '#9ca3af',
  onSecondary: '#ffffff',
  tertiary: '#f97316',
  onTertiary: '#ffffff',
  neutral: '#9ca3af',
  background: '#111827', // dark background
  surface: '#1f2937',    // dark surface
  surfaceDim: '#374151',
  onSurface: '#f9fafb',  // light text
  onSurfaceVariant: '#d1d5db',
  outline: '#374151',
  error: '#ef4444',
  errorContainer: '#7f1d1d',
  onErrorContainer: '#fca5a5',
  scrim: 'rgba(0, 0, 0, 0.6)',
};

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: ColorTheme;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync('theme').then((theme) => {
      if (theme === 'dark') {
        setIsDarkMode(true);
      }
      setIsLoaded(true);
    });
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      SecureStore.setItemAsync('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  if (!isLoaded) return null; // wait until theme is resolved to avoid flashing

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
