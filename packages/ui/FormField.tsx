import React from 'react';

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export function FormField({
  label,
  required,
  error,
  helperText,
  children,
  id,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="text-xs sm:text-sm font-medium text-slate-800">
            {label}
            {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
        </div>
      )}
      {children}
      {error ? (
        <span className="text-xs text-red-600 font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-slate-500">{helperText}</span>
      ) : null}
    </div>
  );
}
