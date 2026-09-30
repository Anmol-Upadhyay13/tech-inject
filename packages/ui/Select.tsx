import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  size = 'md',
  disabled = false,
  className = '',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const sizeClasses = {
    sm: 'h-8 text-xs px-2.5',
    md: 'h-9 text-sm px-3',
    lg: 'h-11 text-base px-3.5',
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-md border border-slate-200 bg-white text-slate-900 shadow-xs hover:border-slate-300 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer ${sizeClasses[size]}`}
      >
        <span className={`truncate ${!selectedOption ? 'text-slate-400' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-slate-600' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-40 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-black/5 animate-in fade-in-50 zoom-in-95 duration-100">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                disabled={opt.disabled}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between rounded px-2.5 py-1.5 text-xs sm:text-sm text-left transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  isSelected
                    ? 'bg-indigo-50 font-semibold text-indigo-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
