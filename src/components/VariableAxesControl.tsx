import React from 'react';
import { VariableAxis } from '../types/font';
import { Sliders, RotateCcw } from 'lucide-react';

interface VariableAxesControlProps {
  axes: VariableAxis[];
  currentValues: Record<string, number>;
  onChange: (tag: string, value: number) => void;
  onReset: () => void;
}

export const VariableAxesControl: React.FC<VariableAxesControlProps> = ({
  axes,
  currentValues,
  onChange,
  onReset,
}) => {
  if (!axes || axes.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/50 p-3 rounded-xl">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Sliders className="w-3.5 h-3.5 text-indigo-500" />
          <span>Variable Font Axes</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1"
          title="Reset Axes"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-2">
        {axes.map((axis) => {
          const val = currentValues[axis.tag] ?? axis.default;
          return (
            <div key={axis.tag} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  {axis.name} ({axis.tag})
                </span>
                <span className="font-mono text-slate-500 tabular-nums">
                  {val}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-mono tabular-nums">{axis.min}</span>
                <input
                  type="range"
                  min={axis.min}
                  max={axis.max}
                  step={axis.step || 1}
                  value={val}
                  onChange={(e) => onChange(axis.tag, Number(e.target.value))}
                  className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  aria-label={`${axis.name} axis`}
                />
                <span className="text-[10px] text-slate-400 font-mono tabular-nums">{axis.max}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
