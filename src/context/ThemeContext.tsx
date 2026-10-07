import React, { createContext, useContext, useEffect, useState } from 'react';
import { AccentColor, ThemeMode } from '../types/font';

interface ThemeContextType {
  theme: ThemeMode;
  effectiveTheme: 'light' | 'dark';
  setTheme: (mode: ThemeMode) => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  accentClasses: {
    bg: string;
    text: string;
    border: string;
    ring: string;
    hoverBg: string;
    gradient: string;
    badge: string;
  };
}

const STORAGE_THEME_KEY = 'gfonts_theme_mode_v1';
const STORAGE_ACCENT_KEY = 'gfonts_theme_accent_v1';

export const ACCENT_PALETTES: Record<
  AccentColor,
  {
    name: string;
    colorHex: string;
    bg: string;
    text: string;
    border: string;
    ring: string;
    hoverBg: string;
    gradient: string;
    badge: string;
  }
> = {
  indigo: {
    name: 'Sapphire Indigo',
    colorHex: '#6366f1',
    bg: 'bg-indigo-600',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-500/30',
    ring: 'focus-visible:ring-indigo-500',
    hoverBg: 'hover:bg-indigo-700',
    gradient: 'from-indigo-600 to-blue-600',
    badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
  },
  emerald: {
    name: 'Emerald Jade',
    colorHex: '#10b981',
    bg: 'bg-emerald-600',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/30',
    ring: 'focus-visible:ring-emerald-500',
    hoverBg: 'hover:bg-emerald-700',
    gradient: 'from-emerald-600 to-teal-600',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
  },
  rose: {
    name: 'Crimson Rose',
    colorHex: '#f43f5e',
    bg: 'bg-rose-600',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/30',
    ring: 'focus-visible:ring-rose-500',
    hoverBg: 'hover:bg-rose-700',
    gradient: 'from-rose-600 to-pink-600',
    badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
  },
  amber: {
    name: 'Amber Sunset',
    colorHex: '#f59e0b',
    bg: 'bg-amber-600',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/30',
    ring: 'focus-visible:ring-amber-500',
    hoverBg: 'hover:bg-amber-700',
    gradient: 'from-amber-600 to-orange-600',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  },
  cyan: {
    name: 'Cyan Sky',
    colorHex: '#06b6d4',
    bg: 'bg-cyan-600',
    text: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-500/30',
    ring: 'focus-visible:ring-cyan-500',
    hoverBg: 'hover:bg-cyan-700',
    gradient: 'from-cyan-600 to-blue-600',
    badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20',
  },
  violet: {
    name: 'Amethyst Violet',
    colorHex: '#8b5cf6',
    bg: 'bg-violet-600',
    text: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-500/30',
    ring: 'focus-visible:ring-violet-500',
    hoverBg: 'hover:bg-violet-700',
    gradient: 'from-violet-600 to-purple-600',
    badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem(STORAGE_THEME_KEY) as ThemeMode) || 'system';
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    return (localStorage.getItem(STORAGE_ACCENT_KEY) as AccentColor) || 'indigo';
  });

  const [systemDark, setSystemDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const effectiveTheme: 'light' | 'dark' =
    theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  useEffect(() => {
    const root = document.documentElement;
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [effectiveTheme]);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem(STORAGE_THEME_KEY, mode);
  };

  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent);
    localStorage.setItem(STORAGE_ACCENT_KEY, newAccent);
  };

  const currentPalette = ACCENT_PALETTES[accent];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        effectiveTheme,
        setTheme,
        accent,
        setAccent,
        accentClasses: currentPalette,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
