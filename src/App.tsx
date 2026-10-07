import React, { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ToastProvider, useToast } from './components/Toast';
import { Header } from './components/Header';
import { PreviewControls } from './components/PreviewControls';
import { FontFilters } from './components/FontFilters';
import { FontGrid } from './components/FontGrid';
import { Pagination } from './components/Pagination';
import { FontDetailModal } from './components/FontDetailModal';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { BrandLogo } from './components/BrandLogo';
import {
  FilterState,
  GoogleFont,
  PreviewSettings,
  SortOption,
} from './types/font';
import {
  getGoogleFontsCatalog,
  getSavedFavorites,
  toggleSavedFavorite,
  parseVariant,
} from './services/googleFontsService';

const DEFAULT_PAGE_SIZE = 30;

const DEFAULT_PREVIEW_SETTINGS: PreviewSettings = {
  text: 'The quick brown fox jumps over the lazy dog',
  fontSize: 48,
  lineHeight: 1.4,
  letterSpacing: 0,
  textColor: '',
  bgColor: 'transparent',
  textAlign: 'left',
  textTransform: 'none',
};

const DEFAULT_FILTERS: FilterState = {
  search: '',
  category: 'all',
  subset: 'all',
  variableOnly: false,
  italicOnly: false,
  multipleWeightsOnly: false,
  favoritesOnly: false,
  sortBy: 'popularity',
};

const MainAppContent: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [allFonts, setAllFonts] = useState<GoogleFont[]>([]);
  const [catalogSource, setCatalogSource] = useState<'api' | 'cache' | 'builtin'>('builtin');
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);

  const [previewSettings, setPreviewSettings] = useState<PreviewSettings>(DEFAULT_PREVIEW_SETTINGS);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  const [favorites, setFavorites] = useState<string[]>(() => getSavedFavorites());
  const [compareFamilies, setCompareFamilies] = useState<string[]>([]);
  const [compareOnly, setCompareOnly] = useState(false);
  const [detailFont, setDetailFont] = useState<GoogleFont | null>(null);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  // Load catalog on mount or when API key updates
  const loadCatalog = async () => {
    setIsLoadingCatalog(true);
    try {
      const res = await getGoogleFontsCatalog();
      setAllFonts(res.fonts);
      setCatalogSource(res.source);
    } catch (err) {
      console.error('Failed to load Google Fonts catalog', err);
    } finally {
      setIsLoadingCatalog(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  // Use deferred value for search term to maintain instant response when typing
  const deferredSearch = useDeferredValue(filters.search.trim().toLowerCase());

  // Reset to page 1 whenever search, categories, or filters change
  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  const handleResetPreviewSettings = () => {
    setPreviewSettings(DEFAULT_PREVIEW_SETTINGS);
  };

  const handleToggleFavorite = (family: string) => {
    const updated = toggleSavedFavorite(family);
    setFavorites(updated);
    const added = updated.includes(family);
    showToast(
      added
        ? `${family} added to favorites`
        : `${family} removed from favorites`,
      'info'
    );
  };

  // Filter & Sort Logic
  const filteredFonts = useMemo(() => {
    return allFonts.filter((font) => {
      // 1. Search Query
      if (deferredSearch) {
        const matchFamily = font.family.toLowerCase().includes(deferredSearch);
        const matchCategory = font.category.toLowerCase().includes(deferredSearch);
        const matchDesigner = font.designer?.toLowerCase().includes(deferredSearch);
        if (!matchFamily && !matchCategory && !matchDesigner) {
          return false;
        }
      }

      // 2. Category
      if (filters.category !== 'all' && font.category !== filters.category) {
        return false;
      }

      // 3. Subsets
      if (filters.subset !== 'all') {
        if (!font.subsets || !font.subsets.includes(filters.subset)) {
          return false;
        }
      }

      // 4. Variable Fonts Only
      if (filters.variableOnly && !font.isVariable) {
        return false;
      }

      // 5. Italic Only
      if (filters.italicOnly) {
        const hasItalic = font.variants.some((v) => v.includes('italic'));
        if (!hasItalic) return false;
      }

      // 6. Multiple Weights (3+)
      if (filters.multipleWeightsOnly) {
        if (new Set(font.variants.map((v) => parseVariant(v).weight)).size < 3) return false;
      }

      // 7. Favorites Only
      if (filters.favoritesOnly && !favorites.includes(font.family)) {
        return false;
      }

      return true;
    });
  }, [allFonts, deferredSearch, filters, favorites]);

  // Sort logic
  const sortedFonts = useMemo(() => {
    const list = [...filteredFonts];

    switch (filters.sortBy) {
      case 'alpha-asc':
        list.sort((a, b) => a.family.localeCompare(b.family));
        break;
      case 'alpha-desc':
        list.sort((a, b) => b.family.localeCompare(a.family));
        break;
      case 'variants-desc':
        list.sort((a, b) => b.variants.length - a.variants.length);
        break;
      case 'newest':
        list.sort((a, b) => {
          if (!a.lastModified) return 1;
          if (!b.lastModified) return -1;
          return b.lastModified.localeCompare(a.lastModified);
        });
        break;
      case 'popularity':
      default:
        list.sort((a, b) => (a.popularityRank || 9999) - (b.popularityRank || 9999));
        break;
    }

    return list;
  }, [filteredFonts, filters.sortBy]);

  // Pagination calculation: dynamic fonts per page (default 30)
  const totalItems = sortedFonts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const displayedFonts = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return sortedFonts.slice(start, start + pageSize);
  }, [sortedFonts, safeCurrentPage, pageSize]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Smooth scroll to top of font grid
    const targetElement = document.getElementById('font-grid-top');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col bg-mesh-glow relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Ambient 3D Liquid Orbs for Prismatic Glass Refraction */}
      <div className="liquid-mesh-container" aria-hidden="true">
        <div className="liquid-orb liquid-orb-1 w-[540px] h-[540px] -top-24 -left-24 bg-indigo-500/25 dark:bg-indigo-600/20" />
        <div className="liquid-orb liquid-orb-2 w-[480px] h-[480px] top-1/4 -right-28 bg-cyan-400/20 dark:bg-cyan-500/15" />
        <div className="liquid-orb liquid-orb-3 w-[620px] h-[620px] top-2/3 left-1/4 bg-rose-400/15 dark:bg-rose-500/10" />
        <div className="liquid-orb liquid-orb-4 w-[420px] h-[420px] -bottom-24 right-1/4 bg-violet-500/20 dark:bg-violet-600/15" />
      </div>

      {/* Top Header */}
      <div className="relative z-30">
        <Header
          totalFonts={allFonts.length}
          onOpenApiSettings={() => setIsApiModalOpen(true)}
          favoritesCount={favorites.length}
          isFavoritesOnly={filters.favoritesOnly}
          onToggleFavoritesOnly={() =>
            handleFilterChange({ favoritesOnly: !filters.favoritesOnly })
          }
        />
      </div>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Sticky/Fixed-feel Controls Bar */}
        <PreviewControls
          settings={previewSettings}
          onChange={(updated) =>
            setPreviewSettings((prev) => ({ ...prev, ...updated }))
          }
          onReset={handleResetPreviewSettings}
        />

        {/* Search, Categories, Subsets, and Feature Filters */}
        <FontFilters
          filters={filters}
          onChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <section className="liquid-glass rounded-2xl p-4 mb-5 flex flex-wrap items-center gap-3" aria-label="Compare fonts">
          <strong>{t('compareTitle')} ({compareFamilies.length}/4)</strong>
          <span className="text-sm flex-1">{compareFamilies.join(' · ') || t('compareHint')}</span>
          <button type="button" disabled={compareFamilies.length < 2 && !compareOnly} onClick={() => setCompareOnly(!compareOnly)} className="liquid-btn rounded-lg px-3 py-2 disabled:opacity-40">
            {compareOnly ? t('compareBack') : t('compareShow')}
          </button>
          <button type="button" onClick={() => { setCompareFamilies([]); setCompareOnly(false); }} className="px-3 py-2">{t('compareClear')}</button>
        </section>
        {/* Fonts Display Grid */}
        <FontGrid
          fonts={compareOnly ? allFonts.filter((f) => compareFamilies.includes(f.family)) : displayedFonts}
          compareMode={compareOnly}
          comparedFamilies={compareFamilies}
          onToggleCompare={(family) => setCompareFamilies((prev) => prev.includes(family) ? prev.filter((f) => f !== family) : prev.length < 4 ? [...prev, family] : prev)}
          previewSettings={previewSettings}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onOpenDetails={(font) => setDetailFont(font)}
        />

        {/* Pagination Section */}
        {!compareOnly && <Pagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/60 dark:border-white/10 py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BrandLogo className="w-5 h-5" />
            <p>
              Google Fonts Studio · {t('catalogCount', { count: allFonts.length })} (
              {catalogSource === 'api' ? 'Live Google API' : catalogSource === 'cache' ? 'API Cached' : 'Catalog'})
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://fonts.google.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Google Fonts Official
            </a>
            <button
              type="button"
              onClick={() => setIsApiModalOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {t('apiSettings')}
            </button>
          </div>
        </div>
      </footer>

      {/* Font Specimen & Embed Code Modal */}
      <FontDetailModal
        font={detailFont}
        onClose={() => setDetailFont(null)}
        previewText={previewSettings.text}
      />

      {/* API Key Settings Modal */}
      <ApiSettingsModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onKeyUpdated={loadCatalog}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <MainAppContent />
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

