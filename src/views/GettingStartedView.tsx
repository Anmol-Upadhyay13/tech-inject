import React from 'react';
import { Terminal, CheckCircle2, Code2, ArrowRight } from 'lucide-react';
import { Button } from '../../packages/ui/Button.tsx';

export function GettingStartedView({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-mono">
          <span>Documentation</span>
          <span aria-hidden="true">·</span>
          <span>v1.2.0</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Getting Started with Tech Inject
        </h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Tech Inject provides production-ready React + TypeScript components styled with strict design tokens based on the Sales CRM visual language.
        </p>
      </div>

      {/* Step 1: Requirements */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">01. Project Requirements</h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Ensure your target project meets the baseline specifications:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-semibold text-xs text-slate-900 block">React 18 or 19</span>
            <span className="text-[11px] text-slate-500">Hooks & Functional style</span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-semibold text-xs text-slate-900 block">TypeScript 5+</span>
            <span className="text-[11px] text-slate-500">Strict mode enabled</span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-semibold text-xs text-slate-900 block">Tailwind CSS</span>
            <span className="text-[11px] text-slate-500">v3 or v4 installed</span>
          </div>
        </div>
      </section>

      {/* Step 2: Install CLI */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">02. Add Components via CLI</h2>
        <p className="text-xs sm:text-sm text-slate-600">
          You can add any component directly into your codebase using <code>npx</code>:
        </p>
        <div className="p-3.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs shadow-sm">
          <code>npx @tech-inject/cli add button</code>
        </div>
        <p className="text-xs text-slate-500">
          This downloads <code>Button.tsx</code> and syncs the shared theme tokens into <code>src/theme/tokens.ts</code>.
        </p>
      </section>

      {/* Step 3: Usage in React */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">03. Component Import & Usage</h2>
        <div className="p-4 bg-slate-950 text-slate-200 rounded-lg font-mono text-xs overflow-x-auto">
          <pre>{`import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export default function LeadActions() {
  return (
    <div className="flex items-center gap-3">
      <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
        Create Opportunity
      </Button>
      <Button variant="secondary">
        Cancel
      </Button>
    </div>
  );
}`}</pre>
        </div>
      </section>

      <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
        <Button variant="secondary" onClick={() => onNavigate('catalogue')}>
          Browse All Components
        </Button>
        <Button
          variant="primary"
          onClick={() => onNavigate('comparison')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          View Reference Comparison
        </Button>
      </div>
    </div>
  );
}
