import React, { forwardRef } from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, checked, disabled, className = '', onChange, ...props }, ref) => {
    return (
      <label
        className={`flex items-start gap-2.5 cursor-pointer select-none ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <div
            className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${
              checked
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white border-slate-300 hover:border-slate-400'
            }`}
          >
            {checked && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && <span className="text-xs sm:text-sm font-medium text-slate-900">{label}</span>}
            {description && <span className="text-xs text-slate-500">{description}</span>}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
