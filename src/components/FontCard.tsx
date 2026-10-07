import React, { useState, useMemo } from 'react';
import {
  Heart,
  Copy,
  ExternalLink,
  Sliders,
  RotateCw,
  Info,
  Check,
} from 'lucide-react';
import { GoogleFont, ParsedVariant, PreviewSettings } from '../types/font';
import { getSortedVariants } from '../services/googleFontsService';
import { FontWeightPreview } from './FontWeightPreview';
import { VariableAxesControl } from './VariableAxesControl';
import { FontLoadStatus } from '../hooks/useFontLoader';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from './Toast';
import { GlassCard } from './ui/glass-card';
import { GlassBadge } from './ui/glass-badge';
import { GlassButton } from './ui/glass-button';

interface FontCardProps {
  font: GoogleFont;
  previewSettings: PreviewSettings;
  isFavorite: boolean;
  onToggleFavorite: (family: string) => void;
  loadStatus: FontLoadStatus;
  onRetry: (font: GoogleFont) => void;
  onOpenDetails: (font: GoogleFont) => void;
}

export const FontCard: React.FC<FontCardProps> = ({
  font,
  previewSettings,
  isFavorite,
  onToggleFavorite,
  loadStatus,
  onRetry,
  onOpenDetails,
}) => {
  const { t } = useLanguage();
  const { showToast } = useToast();

  const sortedVariants = useMemo(() => getSortedVariants(font.variants), [font.variants]);

  // Selected weight override for this individual card preview
  const [selectedVariant, setSelectedVariant] = useState<ParsedVariant | null>(null);

  // Variable axes state if variable font
  const [axisValues, setAxisValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    if (font.isVariable && font.axes) {
      font.axes.forEach((ax) => {
        initial[ax.tag] = ax.default;
      });
    }
    return initial;
  });

  const [showAxes, setShowAxes] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCss = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fallbackCategory =
      font.category === 'serif'
        ? 'serif'
        : font.category === 'monospace'
        ? 'monospace'
        : font.category === 'handwriting'
        ? 'cursive'
        : 'sans-serif';
    const cssText = `font-family: '${font.family}', ${fallbackCategory};`;
    navigator.clipboard.writeText(cssText);
    setCopied(true);
    showToast(`${t('copiedCssToast')} (${font.family})`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAxisChange = (tag: string, val: number) => {
    setAxisValues((prev) => ({ ...prev, [tag]: val }));
  };

  const handleResetAxes = () => {
    if (font.axes) {
      const reset: Record<string, number> = {};
      font.axes.forEach((ax) => {
        reset[ax.tag] = ax.default;
      });
      setAxisValues(reset);
    }
  };

  // Build variation settings string for variable font
  const fontVariationSettings = useMemo(() => {
    if (!font.isVariable || !font.axes || Object.keys(axisValues).length === 0) {
      return undefined;
    }
    return Object.entries(axisValues)
      .map(([tag, val]) => `"${tag}" ${val}`)
      .join(', ');
  }, [font.isVariable, font.axes, axisValues]);

  // Weight and style computation
  const activeWeight = selectedVariant
    ? selectedVariant.weight
    : axisValues['wght'] ?? (sortedVariants.find((v) => v.weight === 400)?.weight || sortedVariants[0]?.weight || 400);

  const activeFontStyle = selectedVariant ? (selectedVariant.isItalic ? 'italic' : 'normal') : 'normal';

  const previewStyle: React.CSSProperties = {
    fontFamily: loadStatus === 'loaded' ? `"${font.family}", -apple-system, sans-serif` : 'sans-serif',
    fontSize: `${previewSettings.fontSize}px`,
    lineHeight: previewSettings.lineHeight,
    letterSpacing: `${previewSettings.letterSpacing}px`,
    color: previewSettings.textColor || undefined,
    backgroundColor:
      previewSettings.bgColor && previewSettings.bgColor !== 'transparent'
        ? previewSettings.bgColor
        : undefined,
    textAlign: previewSettings.textAlign,
    textTransform: previewSettings.textTransform,
    fontWeight: activeWeight,
    fontStyle: activeFontStyle,
    fontVariationSettings,
  };

  return (
    <GlassCard variant="interactive" className="p-5 sm:p-6 flex flex-col justify-between group">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate">
                {font.family}
              </h3>
              <GlassBadge variant="default" className="capitalize text-[11px]">
                {font.category}
              </GlassBadge>
              {font.isVariable && (
                <button
                  type="button"
                  onClick={() => setShowAxes(!showAxes)}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                    showAxes
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 border border-indigo-200/50 dark:border-indigo-800/40'
                  }`}
                  title={t('axesControl')}
                >
                  <Sliders className="w-3 h-3" />
                  <span>{t('variableBadge')}</span>
                </button>
              )}
            </div>
            {font.designer && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate block mt-0.5 font-normal">
                {font.designer}
              </span>
            )}
          </div>

          {/* Action Icons with Apple Glass Tactile Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Copy CSS Button */}
            <GlassButton
              variant="glass"
              size="icon"
              onClick={handleCopyCss}
              title={t('copyCss')}
              aria-label={`${t('copyCss')} for ${font.family}`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />}
            </GlassButton>

            {/* Favorite Button */}
            <GlassButton
              variant="glass"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(font.family);
              }}
              title={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
              aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
            >
              <Heart
                className={`w-3.5 h-3.5 transition-colors ${
                  isFavorite ? 'text-rose-500 fill-rose-500' : 'text-slate-500 dark:text-slate-400 hover:text-rose-500'
                }`}
              />
            </GlassButton>

            {/* Open Google Fonts External */}
            <a
              href={`https://fonts.google.com/specimen/${encodeURIComponent(font.family)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-white/70 dark:bg-slate-800/60 border border-white/70 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-xs transition-all hover:scale-105"
              title={t('openGoogleFonts')}
              aria-label={`${t('openGoogleFonts')} ${font.family}`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Info / Embed details */}
            <GlassButton
              variant="glass"
              size="icon"
              onClick={() => onOpenDetails(font)}
              title={t('details')}
              aria-label={`${t('details')} for ${font.family}`}
            >
              <Info className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            </GlassButton>
          </div>
        </div>

        {/* Live Typography Preview Area - Apple Frosted Inset Specimen Plate */}
        <div className="my-3 min-h-[96px] flex items-center rounded-2xl p-3.5 bg-slate-50/50 dark:bg-slate-950/40 backdrop-blur-md border border-white/80 dark:border-white/5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)] transition-colors overflow-hidden">
          {loadStatus === 'loading' && (
            <div className="w-full flex items-center justify-center py-6 text-xs text-slate-400 animate-pulse gap-2">
              <RotateCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
              <span>{t('loadingFont')}</span>
            </div>
          )}

          {loadStatus === 'error' && (
            <div className="w-full flex flex-col items-center justify-center py-4 text-xs text-slate-400 gap-2">
              <span className="text-rose-500">{t('fontLoadError')}</span>
              <button
                type="button"
                onClick={() => onRetry(font)}
                className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-medium"
              >
                {t('retry')}
              </button>
            </div>
          )}

          {loadStatus !== 'loading' && loadStatus !== 'error' && (
            <div
              style={previewStyle}
              className="w-full break-words select-text transition-all leading-normal text-slate-900 dark:text-slate-100"
            >
              {previewSettings.text || t('defaultPreviewText')}
            </div>
          )}
        </div>
      </div>

      {/* Footer: Variable Axes & Font Variants */}
      <div>
        {showAxes && font.axes && (
          <VariableAxesControl
            axes={font.axes}
            currentValues={axisValues}
            onChange={handleAxisChange}
            onReset={handleResetAxes}
          />
        )}

        <FontWeightPreview
          fontFamily={font.family}
          variants={sortedVariants}
          selectedVariant={selectedVariant}
          onSelectVariant={(v) => {
            if (selectedVariant?.raw === v.raw) {
              setSelectedVariant(null); // toggle off to reset to default
            } else {
              setSelectedVariant(v);
            }
          }}
          previewText={previewSettings.text}
          fontSize={previewSettings.fontSize}
        />
      </div>
    </GlassCard>
  );
};
