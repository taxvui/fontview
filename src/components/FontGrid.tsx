import React from 'react';
import { GoogleFont, PreviewSettings } from '../types/font';
import { FontCard } from './FontCard';
import { useFontLoader } from '../hooks/useFontLoader';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, HelpCircle } from 'lucide-react';

interface FontGridProps {
  fonts: GoogleFont[];
  previewSettings: PreviewSettings;
  favorites: string[];
  onToggleFavorite: (family: string) => void;
  onOpenDetails: (font: GoogleFont) => void;
}

export const FontGrid: React.FC<FontGridProps> = ({
  fonts,
  previewSettings,
  favorites,
  onToggleFavorite,
  onOpenDetails,
}) => {
  const { t } = useLanguage();
  const { statusMap, retry } = useFontLoader(fonts);

  if (fonts.length === 0) {
    return (
      <div className="w-full py-16 px-4 text-center liquid-glass rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
          {t('noFontsFound')}
        </h4>
        <p className="text-xs text-slate-500 max-w-sm">
          Try adjusting your search query, selecting different categories, or clearing active filters.
        </p>
      </div>
    );
  }

  return (
    <div id="font-grid-top" className="w-full scroll-mt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {fonts.map((font) => (
          <FontCard
            key={font.family}
            font={font}
            previewSettings={previewSettings}
            isFavorite={favorites.includes(font.family)}
            onToggleFavorite={onToggleFavorite}
            loadStatus={statusMap[font.family] || 'idle'}
            onRetry={retry}
            onOpenDetails={onOpenDetails}
          />
        ))}
      </div>
    </div>
  );
};
