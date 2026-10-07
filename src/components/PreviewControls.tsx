import React, { useState } from 'react';
import {
  RotateCcw,
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PreviewSettings } from '../types/font';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { GlassCard } from './ui/glass-card';
import { GlassButton } from './ui/glass-button';

interface PreviewControlsProps {
  settings: PreviewSettings;
  onChange: (updated: Partial<PreviewSettings>) => void;
  onReset: () => void;
}

const QUICK_SIZES = [16, 24, 36, 48, 64, 72, 96];

const TEXT_COLOR_SWATCHES = [
  '#0f172a', // Slate 900
  '#f8fafc', // Slate 50
  '#2563eb', // Blue 600
  '#7c3aed', // Violet 600
  '#e11d48', // Rose 600
  '#d97706', // Amber 600
  '#059669', // Emerald 600
];

const BG_COLOR_SWATCHES = [
  'transparent',
  '#ffffff',
  '#0f172a',
  '#f1f5f9',
  '#1e293b',
  '#fef2f2',
  '#ecfdf5',
];

export const PreviewControls: React.FC<PreviewControlsProps> = ({
  settings,
  onChange,
  onReset,
}) => {
  const { t } = useLanguage();
  const { accentClasses } = useTheme();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const presets = [
    { label: 'Fox Pangram', text: t('pangramEn') },
    { label: 'VN Pangram', text: t('pangramVi') },
    { label: 'ZH Pangram', text: t('pangramZh') },
    { label: 'Alphabet & 0-9', text: t('alphabet') },
    { label: 'Design Quote', text: t('sampleHeadline') },
  ];

  return (
    <GlassCard variant="elevated" className="w-full p-4 sm:p-6 mb-6">
      {/* Primary Input Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label
            htmlFor="preview-text-input"
            className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400"
          >
            {t('previewTextPlaceholder')}
          </label>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 dark:text-slate-500 mr-1 hidden md:inline">
              {t('presets')}:
            </span>
            {presets.map((p, idx) => (
              <GlassButton
                key={idx}
                variant="pill"
                size="sm"
                onClick={() => onChange({ text: p.text })}
                className="text-[11px] h-6 px-2.5 font-normal"
              >
                {p.label}
              </GlassButton>
            ))}
          </div>
        </div>

        <div className="relative">
          <textarea
            id="preview-text-input"
            rows={2}
            value={settings.text}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder={t('previewTextPlaceholder')}
            className="w-full px-4 py-3 rounded-2xl liquid-input text-slate-900 dark:text-slate-100 placeholder-slate-400 focus-visible:outline-none text-base sm:text-lg resize-y min-h-[72px] transition-all"
          />
        </div>
      </div>

      {/* Main Adjustment Row: Font Size Slider + Quick Presets + Advanced Toggle */}
      <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Font Size controls */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center justify-between sm:justify-start gap-2 min-w-[130px]">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {t('fontSize')}:
            </span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={8}
                max={200}
                value={settings.fontSize}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (!isNaN(val)) onChange({ fontSize: Math.min(200, Math.max(8, val)) });
                }}
                className="w-16 px-2 py-1 rounded-xl text-xs font-semibold tabular-nums text-center liquid-input text-slate-900 dark:text-white focus-visible:outline-none"
                aria-label={t('fontSize')}
              />
              <span className="text-xs text-slate-400 font-mono">px</span>
            </div>
          </div>

          <div className="flex-1 flex items-center gap-3">
            <span className="text-[11px] text-slate-400 tabular-nums font-mono">8</span>
            <input
              type="range"
              min={8}
              max={200}
              value={settings.fontSize}
              onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
              className="flex-1 h-2 bg-slate-200/80 dark:bg-slate-700/80 rounded-lg appearance-none cursor-pointer"
              aria-label={t('fontSize')}
            />
            <span className="text-[11px] text-slate-400 tabular-nums font-mono">200</span>
          </div>

          {/* Quick font size buttons */}
          <div className="hidden xl:flex items-center gap-1">
            {QUICK_SIZES.map((size) => (
              <GlassButton
                key={size}
                variant="pill"
                size="sm"
                isActive={settings.fontSize === size}
                onClick={() => onChange({ fontSize: size })}
                className="h-6 px-2 text-[11px]"
              >
                {size}
              </GlassButton>
            ))}
          </div>
        </div>

        {/* Action Buttons: Toggle Advanced + Reset */}
        <div className="flex items-center justify-end gap-2 shrink-0">
          <GlassButton
            variant="glass"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Tuning</span>
            {showAdvanced ? (
              <ChevronUp className="w-3.5 h-3.5 opacity-60" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            )}
          </GlassButton>

          <GlassButton
            variant="glass"
            size="icon"
            onClick={onReset}
            title={t('resetSettings')}
            aria-label={t('resetSettings')}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </GlassButton>
        </div>
      </div>

      {/* Advanced Typography Settings Panel */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
          {/* Line Height */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600 dark:text-slate-300">
                {t('lineHeight')}
              </span>
              <span className="font-mono text-slate-500 tabular-nums">
                {settings.lineHeight.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={0.8}
              max={2.5}
              step={0.05}
              value={settings.lineHeight}
              onChange={(e) => onChange({ lineHeight: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Letter Spacing */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600 dark:text-slate-300">
                {t('letterSpacing')}
              </span>
              <span className="font-mono text-slate-500 tabular-nums">
                {settings.letterSpacing}px
              </span>
            </div>
            <input
              type="range"
              min={-3}
              max={14}
              step={0.5}
              value={settings.letterSpacing}
              onChange={(e) => onChange({ letterSpacing: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Text Alignment & Transform */}
          <div className="space-y-1.5">
            <span className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              {t('textAlign')} & {t('textTransform')}
            </span>
            <div className="flex items-center gap-1">
              <div className="inline-flex rounded-md bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => onChange({ textAlign: 'left' })}
                  className={`p-1 rounded text-xs transition-colors ${
                    settings.textAlign === 'left'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={t('alignLeft')}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ textAlign: 'center' })}
                  className={`p-1 rounded text-xs transition-colors ${
                    settings.textAlign === 'center'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={t('alignCenter')}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ textAlign: 'right' })}
                  className={`p-1 rounded text-xs transition-colors ${
                    settings.textAlign === 'right'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={t('alignRight')}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ textAlign: 'justify' })}
                  className={`p-1 rounded text-xs transition-colors ${
                    settings.textAlign === 'justify'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={t('alignJustify')}
                >
                  <AlignJustify className="w-3.5 h-3.5" />
                </button>
              </div>

              <select
                value={settings.textTransform}
                onChange={(e) => onChange({ textTransform: e.target.value as any })}
                className="flex-1 px-2 py-1 rounded-md text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus-visible:outline-none"
              >
                <option value="none">{t('transformNone')}</option>
                <option value="uppercase">{t('transformUpper')}</option>
                <option value="lowercase">{t('transformLower')}</option>
                <option value="capitalize">{t('transformCap')}</option>
              </select>
            </div>
          </div>

          {/* Color Palettes */}
          <div className="space-y-1.5">
            <span className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              {t('textColor')} & {t('bgColor')}
            </span>
            <div className="flex items-center gap-3">
              {/* Text Color Swatches */}
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={settings.textColor.startsWith('#') ? settings.textColor : '#0f172a'}
                  onChange={(e) => onChange({ textColor: e.target.value })}
                  className="w-6 h-6 rounded-md cursor-pointer border border-slate-300 dark:border-slate-600 p-0 overflow-hidden"
                  title={t('textColor')}
                />
                <button
                  type="button"
                  onClick={() => onChange({ textColor: '' })}
                  className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                    !settings.textColor
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Auto theme text color"
                >
                  Auto
                </button>
                <div className="hidden xs:flex items-center gap-0.5">
                  {TEXT_COLOR_SWATCHES.slice(2, 6).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => onChange({ textColor: c })}
                      className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 transition-transform hover:scale-110"
                      style={{ backgroundColor: c }}
                      title={`Text color ${c}`}
                    />
                  ))}
                </div>
              </div>

              {/* Background Color Swatches */}
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-700">
                <input
                  type="color"
                  value={
                    settings.bgColor === 'transparent'
                      ? '#ffffff'
                      : settings.bgColor.startsWith('#')
                      ? settings.bgColor
                      : '#ffffff'
                  }
                  onChange={(e) => onChange({ bgColor: e.target.value })}
                  className="w-6 h-6 rounded-md cursor-pointer border border-slate-300 dark:border-slate-600 p-0 overflow-hidden"
                  title={t('bgColor')}
                />
                <button
                  type="button"
                  onClick={() => onChange({ bgColor: 'transparent' })}
                  className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                    settings.bgColor === 'transparent'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Transparent Background"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
};
