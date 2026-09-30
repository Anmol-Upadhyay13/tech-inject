import React from 'react';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className = '',
}: ToggleProps) {
  const isSm = size === 'sm';
  const trackClasses = isSm ? 'w-8 h-4.5' : 'w-10 h-6';
  const thumbClasses = isSm ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5';
  const translateClasses = isSm
    ? checked ? 'translate-x-3.5' : 'translate-x-0.5'
    : checked ? 'translate-x-4.5' : 'translate-x-0.5';

  return (
    <label
      className={`inline-flex items-center gap-3 cursor-pointer select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/30 ${trackClasses} ${
          checked ? 'bg-indigo-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`inline-block rounded-full bg-white shadow-xs transform transition-transform duration-200 ease-in-out ${thumbClasses} ${translateClasses}`}
        />
      </button>
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-xs sm:text-sm font-medium text-slate-900">{label}</span>}
          {description && <span className="text-xs text-slate-500">{description}</span>}
        </div>
      )}
    </label>
  );
}
