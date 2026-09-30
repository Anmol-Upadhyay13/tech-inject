import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export function Alert({
  type = 'info',
  title,
  children,
  onClose,
  className = '',
}: AlertProps) {
  const styles = {
    info: {
      bg: 'bg-blue-50/70',
      border: 'border-blue-200',
      text: 'text-blue-900',
      icon: <Info className="w-4 h-4 text-blue-600 shrink-0" />,
    },
    success: {
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-200',
      text: 'text-emerald-900',
      icon: <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-50/70',
      border: 'border-amber-200',
      text: 'text-amber-900',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />,
    },
    error: {
      bg: 'bg-red-50/70',
      border: 'border-red-200',
      text: 'text-red-900',
      icon: <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />,
    },
  };

  const current = styles[type];

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-lg border p-3 sm:p-4 text-xs sm:text-sm ${current.bg} ${current.border} ${current.text} ${className}`}
    >
      <div className="mt-0.5">{current.icon}</div>
      <div className="flex-1">
        {title && <h5 className="font-semibold mb-0.5">{title}</h5>}
        <div className="text-xs sm:text-sm leading-relaxed opacity-90">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
