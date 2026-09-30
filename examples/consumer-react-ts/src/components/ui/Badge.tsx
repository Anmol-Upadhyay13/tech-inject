// ============================================================================
// METHOD 2: INSTALLED USING CLI (npx @tech-inject/cli add badge)
// Component: Badge v1.0.0
// ============================================================================

import React from 'react';

export type BadgeVariant = 'neutral' | 'brand' | 'success' | 'warning' | 'error' | 'premium';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
}

export function Badge({
  variant = 'neutral',
  size = 'sm',
  dot = false,
  children,
  className = '',
  ...props
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; dotColor: string }> = {
    neutral: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', dotColor: 'bg-slate-400' },
    brand: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dotColor: 'bg-indigo-500' },
    success: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dotColor: 'bg-emerald-500' },
    warning: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', dotColor: 'bg-amber-500' },
    error: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dotColor: 'bg-red-500' },
    premium: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dotColor: 'bg-purple-500' },
  };

  const current = variantStyles[variant];
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded border ${current.bg} ${current.text} ${current.border} ${sizeClasses} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${current.dotColor} shrink-0`} />}
      <span className="truncate">{children}</span>
    </span>
  );
}
