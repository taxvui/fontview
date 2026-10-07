import React, { useState } from 'react';
import { X, Copy, ExternalLink, Check, Code, Info } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { GoogleFont } from '../types/font';
import { buildGoogleFontUrl, getSortedVariants } from '../services/googleFontsService';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from './Toast';

interface FontDetailModalProps {
  font: GoogleFont | null;
  onClose: () => void;
  previewText: string;
}

export const FontDetailModal: React.FC<FontDetailModalProps> = ({
  font,
  onClose,
  previewText,
}) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [embedTab, setEmbedTab] = useState<'link' | 'import'>('link');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!font) return null;

  const fontUrl = buildGoogleFontUrl(font);
  const variants = getSortedVariants(font.variants);

  const htmlLinkCode = `<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="${fontUrl}" rel="stylesheet">`;
  const cssImportCode = `@import url('${fontUrl}');`;
  const cssRuleCode = `font-family: '${font.family}', ${
    font.category === 'serif'
      ? 'serif'
      : font.category === 'monospace'
      ? 'monospace'
      : font.category === 'handwriting'
      ? 'cursive'
      : 'sans-serif'
  };`;

  const handleCopy = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedType(type);
    showToast(t('copiedCssToast'));
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto liquid-glass rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="font-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2.5">
              <BrandLogo className="w-6 h-6" />
              <h2
                id="font-modal-title"
                className="text-2xl font-bold text-slate-900 dark:text-white"
              >
                {font.family}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium capitalize">
                {font.category}
              </span>
              {font.isVariable && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium">
                  Variable Font
                </span>
              )}
            </div>
            {font.designer && (
              <p className="text-xs text-slate-500 mt-1">Designed by {font.designer}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://fonts.google.com/specimen/${encodeURIComponent(font.family)}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t('openGoogleFonts')}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={t('close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Specimen Preview */}
        <div className="space-y-4 bg-slate-50 dark:bg-slate-950/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Specimen Preview
          </span>
          <div
            style={{ fontFamily: `"${font.family}", sans-serif` }}
            className="text-2xl sm:text-3xl text-slate-900 dark:text-white break-words"
          >
            {previewText || 'The quick brown fox jumps over the lazy dog'}
          </div>
          <div
            style={{ fontFamily: `"${font.family}", sans-serif` }}
            className="text-sm text-slate-600 dark:text-slate-400 tracking-wide break-words"
          >
            ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
            !@#$%^&amp;*()_+-=[]&#123;&#125;
          </div>
        </div>

        {/* Variants Matrix */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t('variantsLabel', { count: variants.length })}
          </span>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <span
                key={v.raw}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {v.label}
              </span>
            ))}
          </div>
        </div>

        {/* Embed Instructions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t('embedCode')}
            </span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setEmbedTab('link')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  embedTab === 'link'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                &lt;link&gt;
              </button>
              <button
                type="button"
                onClick={() => setEmbedTab('import')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  embedTab === 'import'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                @import
              </button>
            </div>
          </div>

          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
              {embedTab === 'link' ? htmlLinkCode : cssImportCode}
            </pre>
            <button
              type="button"
              onClick={() => handleCopy(embedTab === 'link' ? htmlLinkCode : cssImportCode, 'embed')}
              className="absolute top-3 right-3 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Copy embed code"
            >
              {copiedType === 'embed' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* CSS Rule */}
          <div className="relative">
            <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800">
              {cssRuleCode}
            </pre>
            <button
              type="button"
              onClick={() => handleCopy(cssRuleCode, 'rule')}
              className="absolute top-2.5 right-3 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Copy CSS Rule"
            >
              {copiedType === 'rule' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Subsets */}
        {font.subsets && font.subsets.length > 0 && (
          <div className="pt-2 text-xs text-slate-500">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {t('supportedSubsets')}:{' '}
            </span>
            <span>{font.subsets.join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
