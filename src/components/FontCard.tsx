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
    <article className="liquid-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between relative group">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate">
                {font.family}
              </h3>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 capitalize">
                {font.category}
              </span>
              {font.isVariable && (
                <button
                  type="button"
                  onClick={() => setShowAxes(!showAxes)}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 ${
                    showAxes
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100'
                  }`}
                  title={t('axesControl')}
                >
                  <Sliders className="w-3 h-3" />
                  <span>{t('variableBadge')}</span>
                </button>
              )}
            </div>
            {font.designer && (
              <span className="text-[11px] text-slate-400 truncate block mt-0.5">
                {font.designer}
              </span>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Copy CSS Button */}
            <button
              type="button"
              onClick={handleCopyCss}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t('copyCss')}
              aria-label={`${t('copyCss')} for ${font.family}`}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Favorite Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(font.family);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                isFavorite
                  ? 'text-rose-500 hover:text-rose-600'
                  : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
              aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
            >
              <Heart
                className="w-4 h-4"
                fill={isFavorite ? 'currentColor' : 'none'}
              />
            </button>

            {/* Open Google Fonts External */}
            <a
              href={`https://fonts.google.com/specimen/${encodeURIComponent(font.family)}`}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t('openGoogleFonts')}
              aria-label={`${t('openGoogleFonts')} ${font.family}`}
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Info / Embed details */}
            <button
              type="button"
              onClick={() => onOpenDetails(font)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t('details')}
              aria-label={`${t('details')} for ${font.family}`}
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Typography Preview Area */}
        <div className="my-3 min-h-[90px] flex items-center rounded-xl p-2.5 transition-colors overflow-hidden">
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
              className="w-full break-words select-text transition-all leading-normal"
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
    </article>
  );
};
