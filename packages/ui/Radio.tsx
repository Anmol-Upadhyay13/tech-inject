import React, { forwardRef } from 'react';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  className = '',
}: RadioGroupProps) {
  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {options.map((opt) => {
        const isChecked = opt.value === value;
        return (
          <label
            key={opt.value}
            className={`flex items-start gap-2.5 cursor-pointer select-none ${
              opt.disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={isChecked}
                disabled={opt.disabled}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded-full border transition-colors flex items-center justify-center ${
                  isChecked
                    ? 'border-indigo-600 bg-indigo-600'
                    : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
              >
                {isChecked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-medium text-slate-900">{opt.label}</span>
              {opt.description && <span className="text-xs text-slate-500">{opt.description}</span>}
            </div>
          </label>
        );
      })}
    </div>
  );
}
