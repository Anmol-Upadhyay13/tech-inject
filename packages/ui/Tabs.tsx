import React from 'react';

export type TabsVariant = 'segmented' | 'underline';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number | string;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: TabsVariant;
  className?: string;
  size?: 'sm' | 'md';
}

export function Tabs({
  items,
  activeId,
  onChange,
  variant = 'segmented',
  className = '',
  size = 'md',
}: TabsProps) {
  if (variant === 'underline') {
    return (
      <div className={`border-b border-slate-200 flex items-center gap-6 overflow-x-auto ${className}`}>
        {items.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-all whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isActive
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-xs px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Segmented control style (standard CRM tab)
  const paddingClass = size === 'sm' ? 'p-0.5' : 'p-1';
  const itemPadding = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <div
      role="tablist"
      className={`inline-flex items-center bg-slate-100/90 rounded-lg border border-slate-200/60 ${paddingClass} ${className}`}
    >
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-1.5 font-medium rounded-md transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none whitespace-nowrap ${itemPadding} ${
              isActive
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="text-[11px] font-mono text-slate-400 ml-0.5">({tab.count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
