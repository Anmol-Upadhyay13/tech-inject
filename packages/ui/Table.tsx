import React from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T | ((row: T) => string);
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  keyField,
  isLoading = false,
  emptyMessage = 'No data available',
  onRowClick,
  className = '',
}: TableProps<T>) {
  const getKey = (row: T): string => {
    if (typeof keyField === 'function') return keyField(row);
    return String(row[keyField]);
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right tabular-nums',
  };

  return (
    <div className={`w-full overflow-x-auto border border-slate-200 rounded-lg bg-white ${className}`}>
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={`py-2.5 px-4 text-xs tracking-wider uppercase ${alignClasses[col.align || 'left']} ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                  <span>Loading table records...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-10 text-center text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={getKey(row)}
                onClick={() => onRowClick?.(row)}
                className={`transition-colors duration-100 hover:bg-slate-50/80 ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`py-3 px-4 ${alignClasses[col.align || 'left']} ${col.className || ''}`}
                  >
                    {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
