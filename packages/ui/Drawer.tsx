import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton.tsx';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-xl',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className={`w-full h-full bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200 ${sizeClasses[size]}`}
      >
        <div className="flex items-start justify-between p-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
          </div>
          <IconButton
            variant="ghost"
            size="sm"
            icon={<X className="w-4 h-4 text-slate-400 hover:text-slate-700" />}
            aria-label="Close drawer"
            onClick={onClose}
          />
        </div>

        <div className="flex-1 p-5 overflow-y-auto">{children}</div>

        {footer && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
