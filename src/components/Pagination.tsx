import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { GlassButton } from './ui/glass-button';

export const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 100];

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useLanguage();
  const { accentClasses } = useTheme();
  const [jumpInput, setJumpInput] = useState('');

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setJumpInput('');
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-white/10 flex flex-col lg:flex-row items-center justify-between gap-4">
      {/* Left side: Count information & Page Size Selector */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {t('showingFonts', { start: startItem, end: endItem, total: totalItems })}
        </div>

        {/* Page Size Selector (5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 100) */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 opacity-70" />
            <span>{t('fontsPerPage')}:</span>
          </span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2.5 py-1 rounded-xl text-xs font-semibold liquid-input text-slate-800 dark:text-slate-100 cursor-pointer focus-visible:outline-none"
            aria-label={t('fontsPerPage')}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option
                key={size}
                value={size}
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Center: Page navigation controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {/* Previous Button */}
          <GlassButton
            variant="glass"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label={t('prevPage')}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{t('prevPage')}</span>
          </GlassButton>

          {/* Numbered buttons */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((p, idx) => {
              if (p === '...') {
                return (
                  <span key={`ellipsis-${idx}`} className="px-1.5 text-xs text-slate-400">
                    ...
                  </span>
                );
              }

              const pageNum = p as number;
              const isCurrent = pageNum === currentPage;

              return (
                <GlassButton
                  key={pageNum}
                  variant={isCurrent ? 'primary' : 'glass'}
                  size="sm"
                  isActive={isCurrent}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-8 h-8 p-0 text-xs font-semibold ${
                    isCurrent ? `${accentClasses.bg} text-white shadow-xs` : ''
                  }`}
                  aria-label={`Page ${pageNum}`}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {pageNum}
                </GlassButton>
              );
            })}
          </div>

          {/* Next Button */}
          <GlassButton
            variant="glass"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label={t('nextPage')}
          >
            <span className="hidden xs:inline">{t('nextPage')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </GlassButton>
        </div>
      )}

      {/* Right side: Jump to page form */}
      {totalPages > 1 && (
        <form onSubmit={handleJump} className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 dark:text-slate-500">{t('jumpToPage')}:</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={jumpInput}
            onChange={(e) => setJumpInput(e.target.value)}
            placeholder={`${currentPage}`}
            className="w-14 px-2 py-1 rounded-xl text-xs font-medium text-center liquid-input text-slate-900 dark:text-white focus-visible:outline-none"
            aria-label={t('jumpToPage')}
          />
          <GlassButton
            type="submit"
            variant="glass"
            size="sm"
            className="h-7 px-2.5 text-xs font-medium"
          >
            Go
          </GlassButton>
        </form>
      )}
    </div>
  );
};
