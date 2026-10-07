import React from 'react';
import { cn } from '../../lib/utils';

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'glass' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'pill';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isActive?: boolean;
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      className,
      variant = 'glass',
      size = 'md',
      isActive = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'relative inline-flex items-center justify-center font-medium transition-all duration-200 select-none whitespace-nowrap cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/80 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
          'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40',
          // Size variants
          size === 'sm' && 'h-8 px-3 text-xs rounded-xl gap-1.5',
          size === 'md' && 'h-9 px-4 text-xs sm:text-sm rounded-xl gap-2',
          size === 'lg' && 'h-11 px-5 text-sm sm:text-base rounded-2xl gap-2.5',
          size === 'icon' && 'h-8 w-8 rounded-xl p-0',
          // Visual variants
          variant === 'glass' && [
            'bg-white/70 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100',
            'backdrop-blur-xl border border-white/70 dark:border-white/10',
            'shadow-[0_2px_8px_0_rgba(15,23,42,0.04)] dark:shadow-[0_4px_12px_0_rgba(0,0,0,0.35)]',
            'before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none',
            'before:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.95)] dark:before:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]',
            'hover:bg-white/90 dark:hover:bg-slate-800/80 hover:border-white dark:hover:border-white/20',
            'hover:shadow-[0_4px_16px_0_rgba(15,23,42,0.08)] dark:hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.45)]',
            isActive && 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold shadow-md',
          ],
          variant === 'primary' && [
            'bg-indigo-600 text-white shadow-md hover:bg-indigo-500',
            'before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none',
            'before:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.35)]',
          ],
          variant === 'secondary' && [
            'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700',
          ],
          variant === 'outline' && [
            'border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800',
          ],
          variant === 'ghost' && [
            'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60',
          ],
          variant === 'pill' && [
            'rounded-full px-3 py-1 text-xs',
            'bg-white/60 dark:bg-slate-800/50 backdrop-blur-md border border-white/70 dark:border-white/10',
            'hover:bg-white/80 dark:hover:bg-slate-800/70',
            isActive && 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold shadow-xs',
          ],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
GlassButton.displayName = 'GlassButton';
