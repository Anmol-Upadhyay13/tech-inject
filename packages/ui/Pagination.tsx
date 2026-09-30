import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  className = '',
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      className={`flex items-center justify-between flex-wrap gap-4 py-3 px-1 text-xs text-slate-500 ${className}`}
    >
      <div>
        {totalItems !== undefined && pageSize !== undefined ? (
          <span>
            Showing <span className="font-medium text-slate-800">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-medium text-slate-800">
              {Math.min(currentPage * pageSize, totalItems)}
            </span>{' '}
            of <span className="font-medium text-slate-800">{totalItems}</span> results
          </span>
        ) : (
          <span>
            Page <span className="font-medium text-slate-800">{currentPage}</span> of{' '}
            <span className="font-medium text-slate-800">{totalPages}</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p) => {
          if (
            p === 1 ||
            p === totalPages ||
            (p >= currentPage - 1 && p <= currentPage + 1)
          ) {
            const isActive = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`min-w-8 h-8 px-2 rounded text-xs font-medium cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {p}
              </button>
            );
          } else if (p === currentPage - 2 || p === currentPage + 2) {
            return (
              <span key={p} className="px-1 text-slate-400">
                ...
              </span>
            );
          }
          return null;
        })}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
