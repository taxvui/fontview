import React from 'react';
import { cn } from '../../lib/utils';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'subtle' | 'interactive';
  glow?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', glow = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-2xl transition-all duration-300',
          // Apple Liquid Glass Core
          'bg-white/75 dark:bg-slate-900/65',
          'backdrop-blur-2xl backdrop-saturate-150',
          'border border-white/60 dark:border-white/10',
          'shadow-[0_8px_32px_0_rgba(15,23,42,0.06)] dark:shadow-[0_12px_40px_0_rgba(0,0,0,0.55)]',
          'before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none',
          'before:shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.95)] dark:before:shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.15)]',
          variant === 'interactive' && [
            'hover:-translate-y-1',
            'hover:bg-white/85 dark:hover:bg-slate-900/75',
            'hover:border-indigo-500/40 dark:hover:border-indigo-400/30',
            'hover:shadow-[0_20px_45px_-8px_rgba(99,102,241,0.18)] dark:hover:shadow-[0_20px_50px_-8px_rgba(0,0,0,0.7)]',
          ],
          variant === 'elevated' && [
            'shadow-[0_20px_50px_-10px_rgba(15,23,42,0.1)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]',
          ],
          variant === 'subtle' && [
            'bg-white/50 dark:bg-slate-900/45',
            'shadow-[0_4px_16px_0_rgba(15,23,42,0.03)] dark:shadow-[0_6px_20px_0_rgba(0,0,0,0.3)]',
          ],
          glow && 'after:absolute after:-inset-px after:rounded-2xl after:bg-gradient-to-br after:from-indigo-500/20 after:via-transparent after:to-cyan-500/20 after:pointer-events-none after:opacity-60',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassCard.displayName = 'GlassCard';

export const GlassCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
));
GlassCardHeader.displayName = 'GlassCardHeader';

export const GlassCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-semibold leading-none tracking-tight text-slate-900 dark:text-white', className)}
    {...props}
  />
));
GlassCardTitle.displayName = 'GlassCardTitle';

export const GlassCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
GlassCardContent.displayName = 'GlassCardContent';

export const GlassCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
));
GlassCardFooter.displayName = 'GlassCardFooter';
