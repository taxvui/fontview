import React, { useState } from 'react';
import { ParsedVariant } from '../types/font';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FontWeightPreviewProps {
  fontFamily: string;
  variants: ParsedVariant[];
  selectedVariant: ParsedVariant | null;
  onSelectVariant: (v: ParsedVariant) => void;
  previewText: string;
  fontSize: number;
}

export const FontWeightPreview: React.FC<FontWeightPreviewProps> = ({
  fontFamily,
  variants,
  selectedVariant,
  onSelectVariant,
  previewText,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!variants || variants.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
      {/* Variant Pills Bar */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          Styles ({variants.length})
        </span>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
        >
          <span>{isExpanded ? 'Collapse' : 'Inspect all'}</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Horizontal Pills list */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
        {variants.map((v) => {
          const isSelected = selectedVariant?.raw === v.raw;
          return (
            <button
              key={v.raw}
              type="button"
              onClick={() => onSelectVariant(v)}
              className={`shrink-0 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title={`Preview in ${v.label}`}
            >
              {v.label}
            </button>
          );
        })}
      </div>

      {/* Expanded specimen list with individual weight previews */}
      {isExpanded && (
        <div className="mt-2.5 max-h-52 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100 dark:divide-slate-800/80 animate-in fade-in duration-150">
          {variants.map((v) => (
            <div
              key={v.raw}
              onClick={() => onSelectVariant(v)}
              className="pt-2 first:pt-0 cursor-pointer group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 p-1.5 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mb-0.5">
                <span className="font-medium group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  {v.label}
                </span>
                <span className="font-mono text-[10px]">{v.weight}</span>
              </div>
              <p
                style={{
                  fontFamily: `"${fontFamily}", sans-serif`,
                  fontWeight: v.weight,
                  fontStyle: v.isItalic ? 'italic' : 'normal',
                }}
                className="text-sm truncate text-slate-800 dark:text-slate-200"
              >
                {previewText || 'The quick brown fox jumps over the lazy dog'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
