import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  const { t } = useLanguage();
  const { accentClasses } = useTheme();
  const [jumpInput, setJumpInput] = useState('');

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
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
    <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Count information */}
      <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {t('showingFonts', { start: startItem, end: endItem, total: totalItems })}
      </div>

      {/* Page navigation controls */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {/* Previous Button */}
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium liquid-btn text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          aria-label={t('prevPage')}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">{t('prevPage')}</span>
        </button>

        {/* Numbered buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-xs text-slate-400">
                  ...
                </span>
              );
            }

            const pageNum = p as number;
            const isCurrent = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                  isCurrent
                    ? `${accentClasses.bg} text-white shadow-xs`
                    : 'liquid-btn text-slate-700 dark:text-slate-300'
                }`}
                aria-label={`Page ${pageNum}`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium liquid-btn text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          aria-label={t('nextPage')}
        >
          <span className="hidden xs:inline">{t('nextPage')}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Jump to page form */}
      <form onSubmit={handleJump} className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-400">{t('jumpToPage')}:</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={jumpInput}
          onChange={(e) => setJumpInput(e.target.value)}
          placeholder={`${currentPage}`}
          className="w-14 px-2 py-1 rounded-md text-xs font-medium text-center liquid-input text-slate-900 dark:text-white focus-visible:outline-none"
          aria-label={t('jumpToPage')}
        />
        <button
          type="submit"
          className="px-2.5 py-1 rounded-md liquid-btn text-slate-700 dark:text-slate-200 text-xs font-medium"
        >
          Go
        </button>
      </form>
    </div>
  );
};
