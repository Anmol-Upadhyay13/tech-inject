import React from 'react';
import {
  ArrowRight,
  Terminal,
  Shield,
  Layers,
  Sparkles,
  Code2,
  CheckCircle2,
  Lock,
  Cpu,
  Workflow,
  Search,
} from 'lucide-react';
import { Button } from '../../packages/ui/Button.tsx';
import { Badge } from '../../packages/ui/Badge.tsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../packages/ui/Card.tsx';
import { ComponentItem } from '../../packages/types/component.ts';

interface LandingViewProps {
  components: ComponentItem[];
  onNavigate: (route: string) => void;
  onSelectComponent: (slug: string) => void;
  onOpenSearch: () => void;
}

export function LandingView({
  components,
  onNavigate,
  onSelectComponent,
  onOpenSearch,
}: LandingViewProps) {
  const publishedCount = components.length;
  const premiumCount = components.filter((c) => c.accessLevel === 'premium').length;
  const freeCount = components.filter((c) => c.accessLevel === 'free').length;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            {/* Quiet metadata kicker */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 font-mono">
              <span className="text-indigo-600 font-semibold">Tech Inject v1.2</span>
              <span aria-hidden="true">·</span>
              <span>Sales CRM Design Language</span>
              <span aria-hidden="true">·</span>
              <span>Production-Ready React & TypeScript</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-5">
              Build faster with a reusable interface system.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
              Tech Inject provides production-ready React + TypeScript components crafted with strict design tokens, live previews, source code, CLI installation commands, and AI-agent integration prompts.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                variant="primary"
                onClick={() => onNavigate('catalogue')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Browse Components
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => onNavigate('getting-started')}
                leftIcon={<Terminal className="w-4 h-4 text-slate-500" />}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={onOpenSearch}
                leftIcon={<Search className="w-4 h-4 text-slate-500" />}
              >
                Quick Search (⌘K)
              </Button>
            </div>

            {/* Quick CLI command demonstration */}
            <div className="mt-8 flex items-center gap-3 p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono max-w-lg shadow-sm">
              <span className="text-indigo-400 select-none">$</span>
              <span className="flex-1 truncate">npx @tech-inject/cli add button</span>
              <span className="text-[11px] text-slate-400 border-l border-slate-700 pl-3">v1.2.0</span>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Component Preview Grid */}
      <section className="py-12 sm:py-16 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Featured Components
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Explore the foundational components built with the Sales CRM visual token system.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('catalogue')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View all {publishedCount} components</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {components.slice(0, 6).map((comp) => (
              <Card
                key={comp.id}
                variant="interactive"
                onClick={() => onSelectComponent(comp.slug)}
                className="flex flex-col justify-between"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-500">{comp.category}</span>
                    <Badge variant={comp.accessLevel === 'premium' ? 'premium' : 'neutral'}>
                      {comp.accessLevel === 'premium' ? 'PRO' : 'FREE'}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{comp.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{comp.description}</CardDescription>
                </CardHeader>

                <CardContent className="pt-2">
                  <div className="p-4 bg-slate-50 rounded-md border border-slate-100 flex items-center justify-center min-h-[90px] text-xs text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Layers className="w-5 h-5 text-slate-400" />
                      <span>{comp.previewData?.variants?.length || 1} live variant preview</span>
                    </div>
                  </div>
                </CardContent>

                <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono">v{comp.version}</span>
                  <span className="text-indigo-600 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Inspect <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 1: Why Tech Inject */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              01. Reusable Design System Architecture
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Designed specifically for engineering teams building high-density B2B applications, CRM interfaces, and developer tooling without visual inconsistencies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-lg border border-slate-200 bg-white">
              <div className="w-9 h-9 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Strict Token Hierarchy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Shared tokens for colors, typography, radii, spacing, heights, and shadows. Zero random ad-hoc inline styles.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-200 bg-white">
              <div className="w-9 h-9 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Tested Real Implementations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No mock stubs or fake clicks. Every component is fully typed in TypeScript, keyboard-accessible, and production ready.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-200 bg-white">
              <div className="w-9 h-9 rounded-md bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-3">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Server-Side Access Control</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strict backend enforcement. Premium source code, CLI bundles, and AI prompts are protected server-side with instant revocation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Developer Workflow */}
      <section className="py-14 sm:py-20 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              02. End-to-End Developer Workflow
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Every component in Tech Inject provides three seamless integration options matching developer preferences:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
              <span className="text-[11px] font-mono text-indigo-600 font-bold uppercase tracking-wider block mb-2">
                Option 1: Manual Copy
              </span>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Code Tab Inspection</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                View clean, fully-typed source code directly in the browser with syntax highlighting, dependencies listing, and 1-click clipboard copy.
              </p>
              <div className="p-3 bg-slate-900 text-slate-200 rounded font-mono text-xs">
                <code>import &#123; Button &#125; from '@/components/ui/Button';</code>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
              <span className="text-[11px] font-mono text-emerald-600 font-bold uppercase tracking-wider block mb-2">
                Option 2: CLI Installer
              </span>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Automated Project Add</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Install components with safe path traversal guards, overwrite protection, and automatic theme token synchronization into your project.
              </p>
              <div className="p-3 bg-slate-900 text-slate-200 rounded font-mono text-xs">
                <code>npx @tech-inject/cli add button</code>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
              <span className="text-[11px] font-mono text-purple-600 font-bold uppercase tracking-wider block mb-2">
                Option 3: AI Agent Prompt
              </span>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Component Prompt Generator</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Generate structured, component-specific integration prompts containing exact props, dependencies, and verification checklists for coding agents.
              </p>
              <div className="p-3 bg-slate-900 text-slate-200 rounded font-mono text-xs">
                <code>"You are integrating the Tech Inject Button..."</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Free vs Premium Tier Breakdown */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              03. Free vs. Premium Access Architecture
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Transparent tier boundaries enforced at the API layer. Free components remain open forever; premium components require active verified accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Free Developer Tier</span>
                <Badge variant="neutral">Open Access</Badge>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Core Foundations</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Instant access to foundational components without sign-in or account creation.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full access to Button, Input, Card, Badge, Tabs, Alert, Breadcrumbs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unrestricted live interactive preview with size & state toggles</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full source code inspection and clipboard copying</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>CLI installation without authentication tokens</span>
                </li>
              </ul>
              <Button variant="secondary" onClick={() => onNavigate('catalogue')}>
                Explore Free Components
              </Button>
            </div>

            <div className="p-6 rounded-xl border border-purple-200 bg-purple-50/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Tech Inject Pro</span>
                <Badge variant="premium">Pro Subscription</Badge>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Advanced Enterprise Suite</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Complex data grids, accessible modal overlays, sliding drawers, and advanced filter controls.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Access to Table / Data Grid, Modal Dialog, Drawer, Filter Control</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Unlocks live preview, full source code, and props documentation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>CLI token-authenticated component installations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Component-specific AI Agent integration prompt generator</span>
                </li>
              </ul>
              <Button
                variant="primary"
                onClick={() => onNavigate('catalogue')}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Inspect Pro Components
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
