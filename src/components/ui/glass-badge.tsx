import React from 'react';
import { cn } from '../../lib/utils';

export interface GlassBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'secondary' | 'outline' | 'pill';
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium tracking-wide rounded-lg transition-colors',
        variant === 'default' &&
          'bg-slate-100/90 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-white/5',
        variant === 'accent' &&
          'bg-indigo-50/90 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40 shadow-xs',
        variant === 'secondary' &&
          'bg-emerald-50/90 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40',
        variant === 'outline' &&
          'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400',
        variant === 'pill' &&
          'rounded-full bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-300',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
