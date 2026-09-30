import React, { useState } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  size?: AvatarSize;
  status?: 'online' | 'offline' | 'busy';
}

export function Avatar({
  src,
  name = 'User',
  size = 'md',
  status,
  className = '',
  ...props
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses: Record<AvatarSize, string> = {
    xs: 'w-5 h-5 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
    xl: 'w-14 h-14 text-lg',
  };

  const getInitials = (str: string) => {
    return str
      .split(' ')
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const statusDotSize: Record<AvatarSize, string> = {
    xs: 'w-1.5 h-1.5 bottom-0 right-0',
    sm: 'w-2 h-2 bottom-0 right-0',
    md: 'w-2.5 h-2.5 bottom-0 right-0',
    lg: 'w-3 h-3 bottom-0.5 right-0.5',
    xl: 'w-3.5 h-3.5 bottom-0.5 right-0.5',
  };

  const statusColors = {
    online: 'bg-emerald-500',
    busy: 'bg-red-500',
    offline: 'bg-slate-400',
  };

  return (
    <div className={`relative inline-flex shrink-0 select-none ${className}`} {...props}>
      <div
        className={`flex items-center justify-center rounded-full font-semibold bg-slate-100 text-slate-700 border border-slate-200 overflow-hidden ${sizeClasses[size]}`}
      >
        {src && !imgError ? (
          <img
            src={src}
            alt={name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {status && (
        <span
          className={`absolute rounded-full ring-2 ring-white ${statusColors[status]} ${statusDotSize[size]}`}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export function AvatarGroup({
  children,
  limit = 4,
  className = '',
}: {
  children: React.ReactNode[];
  limit?: number;
  className?: string;
}) {
  const visible = children.slice(0, limit);
  const remaining = children.length - limit;

  return (
    <div className={`flex items-center -space-x-2 overflow-hidden ${className}`}>
      {visible.map((child, idx) => (
        <div key={idx} className="ring-2 ring-white rounded-full">
          {child}
        </div>
      ))}
      {remaining > 0 && (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold ring-2 ring-white">
          +{remaining}
        </div>
      )}
    </div>
  );
}
