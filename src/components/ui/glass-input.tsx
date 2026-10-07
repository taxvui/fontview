import React from 'react';
import { cn } from '../../lib/utils';

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  glow?: boolean;
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, glow = false, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'w-full px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200',
          'bg-white/70 dark:bg-slate-900/65',
          'backdrop-blur-xl border border-slate-200/80 dark:border-white/10',
          'text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500',
          'shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]',
          'focus-visible:outline-none focus-visible:bg-white/90 dark:focus-visible:bg-slate-900/90',
          'focus-visible:border-indigo-500/80 dark:focus-visible:border-indigo-400/80',
          'focus-visible:ring-2 focus-visible:ring-indigo-500/20 dark:focus-visible:ring-indigo-400/20',
          glow && 'focus-visible:shadow-[0_0_15px_rgba(99,102,241,0.25)]',
          className
        )}
        {...props}
      />
    );
  }
);
GlassInput.displayName = 'GlassInput';
