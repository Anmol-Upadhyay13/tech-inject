import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 ${className}`}
    >
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 mb-4 shadow-xs">
          {icon}
        </div>
      )}
      <h4 className="text-sm sm:text-base font-semibold text-slate-900">{title}</h4>
      {description && (
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
