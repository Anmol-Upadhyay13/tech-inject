import React, { useState } from 'react';
import { useAuth } from '../lib/authContext.tsx';
import { Button } from '../../packages/ui/Button.tsx';
import { Badge } from '../../packages/ui/Badge.tsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../packages/ui/Card.tsx';
import {
  User,
  Shield,
  Sparkles,
  Key,
  Copy,
  Check,
  Eye,
  EyeOff,
  Terminal,
  CheckCircle2,
  Lock,
  LogOut,
} from 'lucide-react';

export function AccountView({ onOpenLoginModal }: { onOpenLoginModal: () => void }) {
  const { user, token, logout, login } = useAuth();
  const [showToken, setShowToken] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 mx-auto shadow-xs">
          <User className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Developer Account Sign In</h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Sign in to access your active CLI installation tokens, inspect your subscription tier, and manage component permissions.
        </p>
        <div className="pt-2">
          <Button variant="primary" onClick={onOpenLoginModal}>
            Sign In to Account
          </Button>
        </div>
      </div>
    );
  }

  const handleCopyToken = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const activeCliCommand = `npx @tech-inject/cli add table --token ${token || '<your_token>'}`;

  const handleCopyCli = () => {
    navigator.clipboard.writeText(activeCliCommand);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span>Account Profile</span>
            <span aria-hidden="true">·</span>
            <span>Developer Settings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Developer Account & API Access
          </h1>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          leftIcon={<LogOut className="w-3.5 h-3.5" />}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          Sign Out
        </Button>
      </div>

      {/* Account Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
            </div>
            <Badge variant={user.isPremium ? 'premium' : user.role === 'admin' ? 'brand' : 'neutral'}>
              {user.isPremium ? 'TECH INJECT PRO' : user.role === 'admin' ? 'ADMINISTRATOR' : 'FREE DEVELOPER'}
            </Badge>
          </div>

          {/* CLI & API Token Block */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">CLI & Registry Access Token</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                >
                  {showToken ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showToken ? 'Hide' : 'Reveal'}</span>
                </button>
              </div>
            </div>

            <div className="p-2.5 bg-white border border-slate-200 rounded font-mono text-xs flex items-center justify-between text-slate-700">
              <span className="truncate pr-2">
                {showToken ? token : token ? `${token.substring(0, 16)}••••••••••••••••••••••••` : 'No token active'}
              </span>
              <button
                type="button"
                onClick={handleCopyToken}
                className="text-slate-400 hover:text-indigo-600 shrink-0 cursor-pointer p-1"
                aria-label="Copy token"
              >
                {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              Use this token in your terminal to authenticate premium components via the CLI installer.
            </p>
          </div>

          {/* Pre-filled CLI Command */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">Personalized CLI Command</span>
            <div className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs flex items-center justify-between shadow-xs">
              <span className="truncate">{activeCliCommand}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyCli}
                className="text-slate-300 hover:text-white hover:bg-slate-800 h-6 text-xs shrink-0 ml-2"
              >
                {copiedCli ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
        </div>

        {/* Subscription Summary */}
        <div className="p-6 bg-slate-50/70 rounded-xl border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Current Subscription</h3>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center justify-between py-1 border-b border-slate-200">
              <span>Tier:</span>
              <span className="font-semibold text-slate-900">
                {user.isPremium ? 'Pro Member' : 'Free Tier'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-200">
              <span>Component Access:</span>
              <span className="font-semibold text-slate-900">
                {user.isPremium ? 'All 11 Components' : '7 Free Components'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-200">
              <span>CLI Downloads:</span>
              <span className="font-semibold text-slate-900">Unlimited</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>AI Agent Prompts:</span>
              <span className="font-semibold text-slate-900">
                {user.isPremium ? 'Unlocked (Full)' : 'Free Only'}
              </span>
            </div>
          </div>

          {/* Evaluator Quick Switcher */}
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Test Account Switcher
            </span>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => login('pro@techinject.dev')}
                className="w-full text-left p-2 rounded bg-white border border-purple-200 hover:bg-purple-50 text-xs text-purple-900 font-medium cursor-pointer"
              >
                Switch to Pro Member
              </button>
              <button
                type="button"
                onClick={() => login('developer@techinject.dev')}
                className="w-full text-left p-2 rounded bg-white border border-slate-200 hover:bg-slate-100 text-xs text-slate-700 font-medium cursor-pointer"
              >
                Switch to Free Developer
              </button>
              <button
                type="button"
                onClick={() => login('admin@techinject.dev')}
                className="w-full text-left p-2 rounded bg-white border border-indigo-200 hover:bg-indigo-50 text-xs text-indigo-900 font-medium cursor-pointer"
              >
                Switch to Administrator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
