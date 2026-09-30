// ============================================================================
// METHOD 1: COPIED MANUALLY FROM TECH INJECT CATALOGUE CODE TAB
// Component: Button v1.2.0
// ============================================================================

import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'subtle';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isFullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      isFullWidth = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/30 focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed whitespace-nowrap active:scale-[0.98]';

    const variantClasses: Record<ButtonVariant, string> = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm border border-indigo-600',
      secondary: 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200 shadow-xs',
      outline: 'bg-transparent text-slate-700 hover:bg-slate-50 border border-slate-300',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent',
      destructive: 'bg-red-600 text-white hover:bg-red-700 border border-red-600 shadow-xs',
      subtle: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100',
    };

    const sizeClasses: Record<ButtonSize, string> = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-9 px-4 text-sm gap-2',
      lg: 'h-11 px-5 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${isFullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
