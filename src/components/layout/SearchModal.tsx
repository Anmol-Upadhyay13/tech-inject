import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { ComponentItem } from '../../../packages/types/component.ts';
import { Badge } from '../../../packages/ui/Badge.tsx';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  components: ComponentItem[];
  onSelectComponent: (slug: string) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  components,
  onSelectComponent,
}: SearchModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = components.filter((c) => {
    const q = query.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-slate-100">
          <Search className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a component name, category, or prop..."
            className="w-full py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              No matching components found for "{query}".
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectComponent(item.slug);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900">{item.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">v{item.version}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate max-w-sm">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={item.accessLevel === 'premium' ? 'premium' : 'neutral'}>
                      {item.accessLevel === 'premium' ? 'PRO' : 'FREE'}
                    </Badge>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Search Tech Inject component catalogue</span>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  );
}
