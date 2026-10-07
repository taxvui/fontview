import React from 'react';
import { Sun, Moon, Laptop, KeyRound, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { GlassButton } from './ui/glass-button';
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
          <div className="w-10 h-10 rounded-xl flex items-center justify-center liquid-glass shadow-sm p-1.5 border border-white/80 dark:border-white/10 group">
            <BrandLogo className="w-7 h-7" />
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
          <GlassButton
            variant="glass"
            size="sm"
            onClick={onToggleFavoritesOnly}
            isActive={isFavoritesOnly}
            className={`text-xs h-9 ${isFavoritesOnly ? `${accentClasses.bg} text-white` : ''}`}
            title={t('filterFavorites')}
            aria-label={t('filterFavorites')}
          >
            <span className={isFavoritesOnly ? 'text-white' : 'text-rose-500'}>♥</span>
            <span className="hidden xs:inline">{t('filterFavorites')}</span>
            <span className="text-[11px] opacity-80 tabular-nums">({favoritesCount})</span>
          </GlassButton>

          {/* 6 Accent Color Dots Picker */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 liquid-glass rounded-xl shadow-xs">
            {accentKeys.map((accKey) => {
              const pal = ACCENT_PALETTES[accKey];
              const isSelected = accent === accKey;
              return (
                <button
                  key={accKey}
                  type="button"
                  onClick={() => setAccent(accKey)}
                  className={`w-5 h-5 rounded-full transition-transform cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-900 ${
                    isSelected ? 'scale-115 ring-2 ring-slate-900 dark:ring-white shadow-sm' : 'hover:scale-110 opacity-75 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: pal.colorHex }}
                  title={`${pal.name}`}
                  aria-label={`Select accent color ${pal.name}`}
                />
              );
            })}
          </div>

          {/* Language Switcher */}
          <div className="relative inline-flex items-center p-0.5 rounded-xl liquid-glass text-xs font-medium shadow-xs">
            {languages.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => setLanguage(item.code)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  language === item.code
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
                aria-label={`Switch to ${item.label}`}
              >
                {item.code.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme Mode Switcher */}
          <div className="flex items-center p-1 rounded-2xl liquid-glass text-xs shadow-xs border border-white/70 dark:border-white/10">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-white text-amber-500 shadow-xs font-semibold border border-amber-200/50'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title={t('lightMode')}
              aria-label="Light mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-800 text-indigo-300 shadow-xs font-semibold border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title={t('darkMode')}
              aria-label="Dark mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                theme === 'system'
                  ? 'bg-white/90 dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold border border-slate-200/60 dark:border-white/10'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title={t('systemMode')}
              aria-label="System mode"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* API Key Settings Button */}
          <GlassButton
            variant="glass"
            size="icon"
            onClick={onOpenApiSettings}
            title={t('apiSettings')}
            aria-label={t('apiSettings')}
          >
            <KeyRound className="w-4 h-4" />
          </GlassButton>
        </div>
      </div>
    </header>
  );
};
