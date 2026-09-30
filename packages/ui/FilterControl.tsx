import React from 'react';
import { Filter, X } from 'lucide-react';

export interface FilterControlProps {
  label: string;
  activeCount?: number;
  onClick: () => void;
  onClear?: () => void;
  isActive?: boolean;
  className?: string;
}

export function FilterControl({
  label,
  activeCount = 0,
  onClick,
  onClear,
  isActive = false,
  className = '',
}: FilterControlProps) {
  return (
    <div className={`inline-flex items-center rounded-md border text-xs font-medium transition-colors ${
      isActive || activeCount > 0
        ? 'border-indigo-300 bg-indigo-50/70 text-indigo-700'
        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
    } ${className}`}>
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-1.5 px-2.5 py-1.5 cursor-pointer"
      >
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>{label}</span>
        {activeCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
            {activeCount}
          </span>
        )}
      </button>
      {activeCount > 0 && onClear && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="pr-2 text-indigo-400 hover:text-indigo-700 cursor-pointer"
          aria-label="Clear filter"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
