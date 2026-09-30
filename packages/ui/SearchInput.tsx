import React, { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input, InputProps } from './Input.tsx';

export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'rightAction'> {
  onClear?: () => void;
  shortcut?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onClear, shortcut = '⌘K', className = '', ...props }, ref) => {
    const hasValue = Boolean(value);

    return (
      <Input
        ref={ref}
        type="text"
        value={value}
        leftIcon={<Search className="w-4 h-4 text-slate-400" />}
        rightAction={
          <div className="flex items-center gap-1.5 pr-1">
            {hasValue && onClear && (
              <button
                type="button"
                onClick={onClear}
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {shortcut && !hasValue && (
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded">
                {shortcut}
              </kbd>
            )}
          </div>
        }
        className={`bg-slate-50/70 focus:bg-white ${className}`}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';
