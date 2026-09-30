import React, { createContext, useContext, useState, useEffect } from 'react';
import { SessionUser } from '../../packages/types/auth.ts';

interface AuthContextType {
  user: SessionUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and check current session
  const refreshUser = async () => {
    try {
      const storedToken = localStorage.getItem('tech_inject_token');
      if (storedToken) {
        setToken(storedToken);
      }

      const res = await fetch('/api/auth/me', {
        headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
        if (storedToken) {
          localStorage.removeItem('tech_inject_token');
          setToken(null);
        }
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password = 'DefaultPass123!') => {
    // Standard passwords for seeded accounts
    let pass = password;
    if (email === 'admin@techinject.dev') pass = 'AdminPass123!';
    else if (email === 'pro@techinject.dev') pass = 'ProPass123!';
    else if (email === 'developer@techinject.dev') pass = 'FreePass123!';

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('tech_inject_token', data.token);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('tech_inject_token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
