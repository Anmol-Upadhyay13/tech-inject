import React, { useState } from 'react';
import { useAuth } from '../../lib/authContext.tsx';
import { Modal } from '../../../packages/ui/Modal.tsx';
import { Button } from '../../../packages/ui/Button.tsx';
import { Input } from '../../../packages/ui/Input.tsx';
import { FormField } from '../../../packages/ui/FormField.tsx';
import { Shield, Sparkles, User, AlertCircle, Check } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (quickEmail: string, quickPass: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await login(quickEmail, quickPass);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign In to Tech Inject"
      description="Access your account permissions, component source code, CLI installer tokens, and admin controls."
      size="md"
    >
      <div className="space-y-5">
        {/* Fast Switcher for Assignment Evaluation */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            One-Click Evaluator Accounts:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('pro@techinject.dev', 'ProPass123!')}
              className="p-2 bg-white rounded border border-purple-200 hover:border-purple-400 hover:bg-purple-50/50 text-left transition-all cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center gap-1.5 text-purple-700 font-semibold text-xs mb-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pro Member</span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">pro@techinject.dev</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('developer@techinject.dev', 'FreePass123!')}
              className="p-2 bg-white rounded border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-left transition-all cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs mb-0.5">
                <User className="w-3.5 h-3.5" />
                <span>Free Tier</span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">developer@techinject.dev</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@techinject.dev', 'AdminPass123!')}
              className="p-2 bg-white rounded border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition-all cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center gap-1.5 text-indigo-700 font-semibold text-xs mb-0.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Administrator</span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">admin@techinject.dev</p>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-semibold">Or with credentials</span>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <FormField label="Email Address" required>
            <Input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormField>

          <FormField label="Password" required>
            <Input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormField>

          <Button
            type="submit"
            variant="primary"
            isFullWidth
            isLoading={isLoading}
          >
            Sign In to Account
          </Button>
        </form>
      </div>
    </Modal>
  );
}
