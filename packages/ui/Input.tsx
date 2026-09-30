import React, { forwardRef } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  error?: string | boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      error,
      leftIcon,
      rightIcon,
      rightAction,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(error);

    const sizeClasses: Record<InputSize, string> = {
      sm: 'h-8 text-xs px-2.5',
      md: 'h-9 text-sm px-3',
      lg: 'h-11 text-base px-3.5',
    };

    const leftPadding = leftIcon
      ? size === 'sm'
        ? 'pl-8'
        : size === 'md'
        ? 'pl-9'
        : 'pl-11'
      : '';

    const rightPadding = rightIcon || rightAction
      ? size === 'sm'
        ? 'pr-8'
        : size === 'md'
        ? 'pr-9'
        : 'pr-11'
      : '';

    const borderClasses = hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
      : 'border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20';

    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-2.5 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={`w-full rounded-md bg-white border transition-all duration-150 text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${sizeClasses[size]} ${leftPadding} ${rightPadding} ${borderClasses} ${className}`}
          {...props}
        />
        {rightIcon && !rightAction && (
          <div className="absolute right-2.5 flex items-center pointer-events-none text-slate-400">
            {rightIcon}
          </div>
        )}
        {rightAction && (
          <div className="absolute right-1.5 flex items-center">{rightAction}</div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
