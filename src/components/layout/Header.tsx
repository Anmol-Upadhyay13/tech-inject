import React, { useState } from 'react';
import { useAuth } from '../../lib/authContext.tsx';
import { Search, Shield, Sparkles, User, LogOut, Check, ArrowRight } from 'lucide-react';
import { Badge } from '../../../packages/ui/Badge.tsx';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenSearch: () => void;
  onOpenLogin: () => void;
}

export function Header({
  currentRoute,
  onNavigate,
  onOpenSearch,
  onOpenLogin,
}: HeaderProps) {
  const { user, logout, login } = useAuth();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xs border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element brand wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 font-bold text-base sm:text-lg text-slate-900 tracking-tight cursor-pointer hover:opacity-90"
        >
          <span className="w-7 h-7 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
            TI
          </span>
          <span>Tech Inject</span>
        </button>

        {/* Zone 2: 4-5 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => onNavigate('catalogue')}
            className={`transition-colors cursor-pointer ${
              currentRoute === 'catalogue' ? 'text-indigo-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Components
          </button>
          <button
            type="button"
            onClick={() => onNavigate('getting-started')}
            className={`transition-colors cursor-pointer ${
              currentRoute === 'getting-started' ? 'text-indigo-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Getting Started
          </button>
          <button
            type="button"
            onClick={() => onNavigate('comparison')}
            className={`transition-colors cursor-pointer ${
              currentRoute === 'comparison' ? 'text-indigo-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Reference Comparison
          </button>
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className={`transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentRoute.startsWith('admin') ? 'text-indigo-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Dashboard</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Search + Account / Sign In) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search trigger button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 border border-slate-200 text-xs font-medium cursor-pointer transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search library...</span>
            <kbd className="hidden sm:inline-flex px-1.5 py-0.2 bg-white rounded border border-slate-200 font-mono text-[10px] text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Account profile & quick-switcher dropdown */}
          <div className="relative">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-xs"
                >
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[10px]">
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-medium text-slate-800 max-w-[90px] truncate hidden sm:inline">
                    {user.name}
                  </span>
                  {user.isPremium ? (
                    <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200">
                      PRO
                    </span>
                  ) : user.role === 'admin' ? (
                    <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                      ADMIN
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
                      FREE
                    </span>
                  )}
                </button>

                {showAccountMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in-50 zoom-in-95 duration-100">
                    <div className="p-2 border-b border-slate-100">
                      <p className="font-semibold text-xs text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Tier:</span>
                        {user.isPremium ? (
                          <Badge variant="premium">Premium Pro</Badge>
                        ) : user.role === 'admin' ? (
                          <Badge variant="brand">Administrator</Badge>
                        ) : (
                          <Badge variant="neutral">Free Developer</Badge>
                        )}
                      </div>
                    </div>

                    {/* Fast switcher to demo accounts */}
                    <div className="py-2 border-b border-slate-100 space-y-1">
                      <span className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Switch Demo Account:
                      </span>
                      <button
                        type="button"
                        onClick={async () => {
                          await login('pro@techinject.dev');
                          setShowAccountMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-2 py-1 text-xs rounded hover:bg-purple-50 text-slate-700 hover:text-purple-900 cursor-pointer"
                      >
                        <span>Sarah Chen (Pro Member)</span>
                        {user.isPremium && <Check className="w-3.5 h-3.5 text-purple-600" />}
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await login('developer@techinject.dev');
                          setShowAccountMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-2 py-1 text-xs rounded hover:bg-slate-100 text-slate-700 cursor-pointer"
                      >
                        <span>Alex Rivera (Free Tier)</span>
                        {!user.isPremium && user.role === 'customer' && <Check className="w-3.5 h-3.5 text-slate-600" />}
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await login('admin@techinject.dev');
                          setShowAccountMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-2 py-1 text-xs rounded hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 cursor-pointer"
                      >
                        <span>Administrator</span>
                        {user.role === 'admin' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      </button>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setShowAccountMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded cursor-pointer transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold shadow-xs cursor-pointer transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
