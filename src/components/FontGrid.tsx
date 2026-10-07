import React from 'react';
import { GoogleFont, PreviewSettings } from '../types/font';
import { FontCard } from './FontCard';
import { useFontLoader } from '../hooks/useFontLoader';
import { useLanguage } from '../context/LanguageContext';
import { GlassCard } from './ui/glass-card';
import { BrandLogo } from './BrandLogo';

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
      <GlassCard variant="elevated" className="w-full py-16 px-4 text-center flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl liquid-glass flex items-center justify-center mb-3 shadow-sm border border-white/80 dark:border-white/10 p-2.5">
          <BrandLogo className="w-9 h-9" />
        </div>
        <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
          {t('noFontsFound')}
        </h4>
        <p className="text-xs text-slate-500 max-w-sm">
          Try adjusting your search query, selecting different categories, or clearing active filters.
        </p>
      </GlassCard>
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
