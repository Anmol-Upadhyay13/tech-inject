import React, { useState, useEffect } from 'react';
import { AuthProvider } from './lib/authContext.tsx';
import { fetchComponents } from './lib/api.ts';
import { ComponentItem } from '../packages/types/component.ts';
import { Header } from './components/layout/Header.tsx';
import { SearchModal } from './components/layout/SearchModal.tsx';
import { LoginModal } from './components/layout/LoginModal.tsx';
import { LandingView } from './views/LandingView.tsx';
import { CatalogueView } from './views/CatalogueView.tsx';
import { ComponentDetailView } from './views/ComponentDetailView.tsx';
import { GettingStartedView } from './views/GettingStartedView.tsx';
import { ReferenceComparisonView } from './views/ReferenceComparisonView.tsx';
import { DesignTokensView } from './views/DesignTokensView.tsx';
import { AccountView } from './views/AccountView.tsx';
import { AdminView } from './views/AdminView.tsx';

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

function MainAppContent() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [selectedSlug, setSelectedSlug] = useState<string>('button');
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Synchronize route with browser hash / history
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      if (hash.startsWith('components/')) {
        const slug = hash.replace('components/', '');
        setSelectedSlug(slug);
        setCurrentRoute('detail');
      } else {
        setCurrentRoute(hash);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Fetch initial components
  const loadComponents = async () => {
    try {
      const data = await fetchComponents(true);
      setComponents(data.components);
    } catch (err) {
      console.error('Failed to load components', err);
    }
  };

  useEffect(() => {
    loadComponents();
  }, []);

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectComponent = (slug: string) => {
    setSelectedSlug(slug);
    setCurrentRoute('detail');
    window.location.hash = `components/${slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Bar Navigation */}
      <Header
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <LandingView
            components={components}
            onNavigate={navigateTo}
            onSelectComponent={handleSelectComponent}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}

        {currentRoute === 'catalogue' && (
          <CatalogueView
            components={components}
            onSelectComponent={handleSelectComponent}
          />
        )}

        {currentRoute === 'detail' && (
          <ComponentDetailView
            slug={selectedSlug}
            allComponents={components}
            onSelectComponent={handleSelectComponent}
            onNavigate={navigateTo}
            onOpenLoginModal={() => setIsLoginOpen(true)}
          />
        )}

        {currentRoute === 'getting-started' && (
          <GettingStartedView onNavigate={navigateTo} />
        )}

        {currentRoute === 'comparison' && <ReferenceComparisonView />}

        {currentRoute === 'tokens' && <DesignTokensView />}

        {currentRoute === 'account' && (
          <AccountView onOpenLoginModal={() => setIsLoginOpen(true)} />
        )}

        {currentRoute.startsWith('admin') && (
          <AdminView onOpenLoginModal={() => setIsLoginOpen(true)} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-800">Tech Inject Design Library</span>
            <span aria-hidden="true">·</span>
            <span>Production-Ready System</span>
            <span aria-hidden="true">·</span>
            <span>React + TypeScript</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => navigateTo('getting-started')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Docs
            </button>
            <button
              type="button"
              onClick={() => navigateTo('tokens')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Tokens
            </button>
            <button
              type="button"
              onClick={() => navigateTo('comparison')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Audit
            </button>
            <button
              type="button"
              onClick={() => navigateTo('account')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Account
            </button>
            <button
              type="button"
              onClick={() => navigateTo('admin')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Admin
            </button>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        components={components}
        onSelectComponent={handleSelectComponent}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
}
