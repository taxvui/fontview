import React from 'react';
import { Sun, Moon, Laptop, KeyRound, Type, Sparkles } from 'lucide-react';
import { useTheme, ACCENT_PALETTES } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { AccentColor, Language, ThemeMode } from '../types/font';

interface HeaderProps {
  totalFonts: number;
  onOpenApiSettings: () => void;
  favoritesCount: number;
  isFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalFonts,
  onOpenApiSettings,
  favoritesCount,
  isFavoritesOnly,
  onToggleFavoritesOnly,
}) => {
  const { theme, effectiveTheme, setTheme, accent, setAccent, accentClasses } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const accentKeys: AccentColor[] = ['indigo', 'emerald', 'rose', 'amber', 'cyan', 'violet'];
  const languages: { code: Language; label: string }[] = [
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'en', label: 'English' },
    { code: 'zh', label: '中文' },
  ];

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 liquid-glass transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark / Brand */}
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md bg-gradient-to-br ${accentClasses.gradient}`}
          >
            <Type className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                {t('appTitle')}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                <Sparkles className="w-3 h-3 text-amber-500" />
                {totalFonts} fonts
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400 truncate max-w-sm">
              {t('appSubtitle')}
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Favorites quick toggle */}
          <button
            type="button"
            onClick={onToggleFavoritesOnly}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isFavoritesOnly
                ? `${accentClasses.bg} text-white border-transparent shadow-sm`
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
            title={t('filterFavorites')}
            aria-label={t('filterFavorites')}
          >
            <span className={isFavoritesOnly ? 'text-white' : 'text-rose-500'}>♥</span>
            <span className="hidden xs:inline">{t('filterFavorites')}</span>
            <span className="text-[11px] opacity-80 tabular-nums">({favoritesCount})</span>
          </button>

          {/* 6 Accent Color Dots Picker */}
          <div className="hidden lg:flex items-center gap-1 p-1 bg-slate-100/90 dark:bg-slate-800/90 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
            {accentKeys.map((accKey) => {
              const pal = ACCENT_PALETTES[accKey];
              const isSelected = accent === accKey;
              return (
                <button
                  key={accKey}
                  type="button"
                  onClick={() => setAccent(accKey)}
                  className={`w-5 h-5 rounded-full transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-900 ${
                    isSelected ? 'scale-115 ring-2 ring-slate-900 dark:ring-white shadow-sm' : 'hover:scale-110 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: pal.colorHex }}
                  title={`${pal.name}`}
                  aria-label={`Select accent color ${pal.name}`}
                />
              );
            })}
          </div>

          {/* Language Switcher */}
          <div className="relative inline-flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-700/80 text-xs font-medium">
            {languages.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => setLanguage(item.code)}
                className={`px-2 py-1 rounded-md transition-all ${
                  language === item.code
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
                aria-label={`Switch to ${item.label}`}
              >
                {item.code.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={cycleTheme}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            title={`${t('theme')}: ${theme === 'system' ? t('systemMode') : theme === 'dark' ? t('darkMode') : t('lightMode')}`}
            aria-label="Toggle theme mode"
          >
            {theme === 'system' ? (
              <Laptop className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            ) : effectiveTheme === 'dark' ? (
              <Moon className="w-4 h-4 text-amber-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>

          {/* API Key Settings Button */}
          <button
            type="button"
            onClick={onOpenApiSettings}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            title={t('apiSettings')}
            aria-label={t('apiSettings')}
          >
            <KeyRound className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
