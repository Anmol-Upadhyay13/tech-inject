import React from 'react';
import { Button } from '../../packages/ui/Button.tsx';
import { Badge } from '../../packages/ui/Badge.tsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../packages/ui/Card.tsx';
import { Table } from '../../packages/ui/Table.tsx';
import { Tabs } from '../../packages/ui/Tabs.tsx';
import { ArrowRight, Check, AlertCircle } from 'lucide-react';

export function ReferenceComparisonView() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-mono">
          <span>Design System Audit</span>
          <span aria-hidden="true">·</span>
          <span>Sales CRM Benchmark</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Visual Reference Comparison
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Comparing the original Sales CRM design language against the recreated Tech Inject design token system.
          Our goal is systematic fidelity across typography, spacing, border radii, and interaction states without duplicating the specific business domain.
        </p>
      </div>

      {/* Comparison 1: Action Controls & Buttons */}
      <section className="p-6 bg-white rounded-xl border border-slate-200 space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900">01. Primary & Secondary Action Buttons</h2>
          <p className="text-xs text-slate-500">Standard control height: 38px (md), 6px border radius, subtle hover settling curve.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* LEFT: Specification / Reference Target */}
          <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
              Reference Benchmark Specification
            </span>
            <div className="space-y-2 text-xs text-slate-600">
              <p>• <strong>Primary Color:</strong> Deep slate-indigo <code>#4F46E5</code> with 1px border matching background.</p>
              <p>• <strong>Secondary Color:</strong> Crisp white with 1px hairline border <code>#E2E8F0</code> and slate-700 label.</p>
              <p>• <strong>Focus Ring:</strong> 2px outline ring <code>rgba(79, 70, 229, 0.25)</code> with 1px white offset.</p>
              <p>• <strong>Transition:</strong> 150ms <code>cubic-bezier(0.16, 1, 0.3, 1)</code>.</p>
            </div>
          </div>

          {/* RIGHT: Recreated Component Live */}
          <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-3">
            <span className="text-[11px] font-mono font-bold text-indigo-600 uppercase tracking-wider block">
              Tech Inject Recreated Component
            </span>
            <div className="flex flex-wrap items-center gap-3 py-2">
              <Button variant="primary">Save Changes</Button>
              <Button variant="secondary">Cancel</Button>
              <Button variant="outline">Export CSV</Button>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> High fidelity match: Exact tokens consumed from <code>@tech-inject/theme</code>.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison 2: High-Density CRM Data Grid */}
      <section className="p-6 bg-white rounded-xl border border-slate-200 space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900">02. High-Density Data Grid</h2>
          <p className="text-xs text-slate-500">Compact 38px row height, tabular numeric alignment, zero layout jitter.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
              Reference Benchmark Specification
            </span>
            <div className="space-y-2 text-xs text-slate-600">
              <p>• <strong>Header:</strong> Uppercase 11px slate-500 with tracking-wider and slate-50 background.</p>
              <p>• <strong>Numbers:</strong> Mandatory <code>font-variant-numeric: tabular-nums</code> for currency & metrics.</p>
              <p>• <strong>Hover:</strong> Single-line soft highlight <code>#F8FAFC</code> without elevation change.</p>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-mono font-bold text-indigo-600 uppercase tracking-wider block">
              Tech Inject Recreated Table
            </span>
            <Table
              keyField="id"
              columns={[
                { key: 'client', header: 'Account' },
                { key: 'val', header: 'Annual Value', align: 'right' },
              ]}
              data={[
                { id: '1', client: 'Acme Corp', val: '$48,000' },
                { id: '2', client: 'Starlight Media', val: '$120,000' },
              ]}
            />
            <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Enforces tabular numerals and CRM compact row metrics.
            </p>
          </div>
        </div>
      </section>

      {/* Honesty & Limitations Notes */}
      <section className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs text-slate-600">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>Fidelity Observations & Intentional Differences</span>
        </h3>
        <p>
          1. <strong>Typography:</strong> Recreated components use <code>Plus Jakarta Sans</code> paired with <code>JetBrains Mono</code>. This preserves identical optical weight while ensuring open-source web font licensing across all browsers.
        </p>
        <p>
          2. <strong>Zero-Pill Discipline:</strong> Unlike legacy CRM interfaces that wrapped every date or status in heavy colored capsules, Tech Inject enforces anti-slop zero-pill typography with dot indicators and typographic separators (<code>·</code>).
        </p>
        <p>
          3. <strong>Sandboxed Preview:</strong> While the CRM renders statically, Tech Inject provides live interactive state toggling (disabled, loading, responsive width simulation).
        </p>
      </section>
    </div>
  );
}
