import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { FilterState, FontCategory, SortOption } from '../types/font';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { GlassButton } from './ui/glass-button';

interface FontFiltersProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onClearFilters: () => void;
}

export const FontFilters: React.FC<FontFiltersProps> = ({
  filters,
  onChange,
  onClearFilters,
}) => {
  const { t } = useLanguage();
  const { accentClasses } = useTheme();

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: t('categoryAll') },
    { key: 'sans-serif', label: t('catSansSerif') },
    { key: 'serif', label: t('catSerif') },
    { key: 'display', label: t('catDisplay') },
    { key: 'handwriting', label: t('catHandwriting') },
    { key: 'monospace', label: t('catMonospace') },
  ];

  const subsets: { key: string; label: string }[] = [
    { key: 'all', label: t('subsetAll') },
    { key: 'latin', label: t('subsetLatin') },
    { key: 'vietnamese', label: t('subsetVietnamese') },
    { key: 'cyrillic', label: t('subsetCyrillic') },
    { key: 'devanagari', label: t('subsetDevanagari') },
    { key: 'japanese', label: t('subsetJapanese') },
    { key: 'chinese', label: t('subsetChinese') },
    { key: 'arabic', label: t('subsetArabic') },
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'popularity', label: t('sortPopularity') },
    { value: 'alpha-asc', label: t('sortAlphaAsc') },
    { value: 'alpha-desc', label: t('sortAlphaDesc') },
    { value: 'variants-desc', label: t('sortVariantsDesc') },
    { value: 'newest', label: t('sortNewest') },
  ];

  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.category !== 'all' ||
    filters.subset !== 'all' ||
    filters.variableOnly ||
    filters.italicOnly ||
    filters.multipleWeightsOnly ||
    filters.favoritesOnly;

  return (
    <div className="w-full space-y-3.5 mb-6">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl liquid-input text-sm text-slate-900 dark:text-white placeholder-slate-400 focus-visible:outline-none"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & Subsets Dropdowns */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Subsets Select */}
          <div className="relative">
            <select
              value={filters.subset}
              onChange={(e) => onChange({ subset: e.target.value })}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl text-xs font-medium liquid-btn text-slate-700 dark:text-slate-200 focus-visible:outline-none cursor-pointer"
              aria-label="Filter by character subset"
            >
              {subsets.map((s) => (
                <option key={s.key} value={s.key} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Select */}
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={(e) => onChange({ sortBy: e.target.value as SortOption })}
              className="pl-8 pr-4 py-2.5 rounded-xl text-xs font-medium liquid-btn text-slate-700 dark:text-slate-200 focus-visible:outline-none cursor-pointer"
              aria-label="Sort fonts"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Categories & Filter Toggles Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
        {/* Category Segmented Buttons */}
        <div className="flex flex-wrap items-center gap-1 p-1 liquid-glass rounded-2xl shadow-xs">
          {categories.map((cat) => {
            const isActive = filters.category === cat.key;
            return (
              <GlassButton
                key={cat.key}
                variant="pill"
                size="sm"
                isActive={isActive}
                onClick={() => onChange({ category: cat.key })}
                className="text-xs h-7 px-3"
              >
                {cat.label}
              </GlassButton>
            );
          })}
        </div>

        {/* Feature Toggles & Clear */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Variable Fonts toggle */}
          <GlassButton
            variant="glass"
            size="sm"
            isActive={filters.variableOnly}
            onClick={() => onChange({ variableOnly: !filters.variableOnly })}
            className={`text-xs h-8 ${filters.variableOnly ? `${accentClasses.bg} text-white` : ''}`}
          >
            {t('filterVariable')}
          </GlassButton>

          {/* Has Italic toggle */}
          <GlassButton
            variant="glass"
            size="sm"
            isActive={filters.italicOnly}
            onClick={() => onChange({ italicOnly: !filters.italicOnly })}
            className={`text-xs h-8 ${filters.italicOnly ? `${accentClasses.bg} text-white` : ''}`}
          >
            {t('filterItalic')}
          </GlassButton>

          {/* Multiple Weights toggle */}
          <GlassButton
            variant="glass"
            size="sm"
            isActive={filters.multipleWeightsOnly}
            onClick={() => onChange({ multipleWeightsOnly: !filters.multipleWeightsOnly })}
            className={`text-xs h-8 ${filters.multipleWeightsOnly ? `${accentClasses.bg} text-white` : ''}`}
          >
            {t('filterMultiWeights')}
          </GlassButton>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs h-8 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
            >
              <X className="w-3.5 h-3.5" />
              <span>{t('clearAllFilters')}</span>
            </GlassButton>
          )}
        </div>
      </div>
    </div>
  );
};
