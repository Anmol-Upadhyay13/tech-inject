import React, { forwardRef } from 'react';
import { ButtonVariant, ButtonSize } from './Button.tsx';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      icon,
      'aria-label': ariaLabel,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center rounded-md transition-all duration-150 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/30 focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed shrink-0 active:scale-[0.98]';

    const variantClasses: Record<ButtonVariant, string> = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm border border-indigo-600',
      secondary: 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200 shadow-xs',
      outline: 'bg-transparent text-slate-700 hover:bg-slate-50 border border-slate-300',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent',
      destructive: 'bg-red-600 text-white hover:bg-red-700 border border-red-600',
      subtle: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100',
    };

    const sizeClasses: Record<ButtonSize, string> = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-9 h-9 text-sm',
      lg: 'w-11 h-11 text-base',
    };

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        disabled={disabled}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
