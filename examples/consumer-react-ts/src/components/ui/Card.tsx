// ============================================================================
// METHOD 3: INTEGRATED VIA TECH INJECT AI AGENT PROMPT
// Prompt: "You are integrating the Tech Inject Card component into an existing React + TypeScript project..."
// ============================================================================

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'interactive';
  children: React.ReactNode;
}

export function Card({
  variant = 'default',
  children,
  className = '',
  ...props
}: CardProps) {
  const variantStyles = {
    default: 'bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors',
    flat: 'bg-slate-50/50 border border-slate-200/60',
    interactive: 'bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer',
  };

  return (
    <div className={`rounded-lg overflow-hidden ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-5 border-b border-slate-100 flex flex-col gap-1 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-base font-semibold text-slate-900 tracking-tight ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-sm text-slate-500 leading-relaxed ${className}`}>{children}</p>;
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-3 text-xs text-slate-500 ${className}`}>
      {children}
    </div>
  );
}
