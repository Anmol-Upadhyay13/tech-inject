import React, { useState } from 'react';
import { tokens } from '../../packages/theme/tokens/index.ts';
import { Copy, Check, Palette, Type, Box, Sliders, Layers, Eye } from 'lucide-react';
import { CodeViewer } from '../components/common/CodeViewer.tsx';
import { Button } from '../../packages/ui/Button.tsx';

export function DesignTokensView() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyVal = (val: string, name: string) => {
    navigator.clipboard.writeText(val);
    setCopiedToken(name);
    setTimeout(() => setCopiedToken(null), 1800);
  };

  const brandSwatches = [
    { step: '50', hex: tokens.colors.brand[50] },
    { step: '100', hex: tokens.colors.brand[100] },
    { step: '200', hex: tokens.colors.brand[200] },
    { step: '300', hex: tokens.colors.brand[300] },
    { step: '400', hex: tokens.colors.brand[400] },
    { step: '500', hex: tokens.colors.brand[500] },
    { step: '600', hex: tokens.colors.brand[600], primary: true },
    { step: '700', hex: tokens.colors.brand[700] },
    { step: '800', hex: tokens.colors.brand[800] },
    { step: '900', hex: tokens.colors.brand[900] },
  ];

  const slateSwatches = [
    { step: '50', hex: tokens.colors.slate[50], label: 'Canvas' },
    { step: '100', hex: tokens.colors.slate[100], label: 'Subtle' },
    { step: '200', hex: tokens.colors.slate[200], label: 'Border' },
    { step: '300', hex: tokens.colors.slate[300], label: 'Divider' },
    { step: '400', hex: tokens.colors.slate[400], label: 'Muted' },
    { step: '500', hex: tokens.colors.slate[500], label: 'Secondary' },
    { step: '600', hex: tokens.colors.slate[600], label: 'Body' },
    { step: '700', hex: tokens.colors.slate[700], label: 'Label' },
    { step: '800', hex: tokens.colors.slate[800], label: 'Surface' },
    { step: '900', hex: tokens.colors.slate[900], label: 'Heading' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-mono">
          <span>Design Tokens</span>
          <span aria-hidden="true">·</span>
          <span>@tech-inject/theme</span>
          <span aria-hidden="true">·</span>
          <span>Sales CRM Foundation</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Shared Theme Tokens
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          The single source of truth governing typography, colors, control heights, border radii, shadows, and transitions across all Tech Inject components. Click any token value to copy to clipboard.
        </p>
      </div>

      {/* Section 1: Color Palette */}
      <section className="space-y-6 p-6 rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">01. Color Tokens & 60-30-10 Distribution</h2>
          </div>
          <span className="text-xs text-slate-500">60% Slate Canvas · 30% Structural · 10% Indigo Accent</span>
        </div>

        {/* Brand Swatches */}
        <div>
          <span className="text-xs font-semibold text-slate-700 block mb-3 font-mono">
            Brand Slate-Indigo (Action & Focus Accent)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
            {brandSwatches.map((s) => (
              <button
                key={s.step}
                type="button"
                onClick={() => copyVal(s.hex, `brand-${s.step}`)}
                className="group p-2 rounded-lg border border-slate-200 text-left hover:border-slate-400 transition-all cursor-pointer bg-white"
              >
                <div
                  className="w-full h-10 rounded mb-2 shadow-2xs transition-transform group-hover:scale-95"
                  style={{ backgroundColor: s.hex }}
                />
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-semibold text-slate-900">{s.step}</span>
                  {s.primary && <span className="text-[9px] bg-indigo-100 text-indigo-700 font-bold px-1 rounded">PRI</span>}
                </div>
                <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between mt-0.5">
                  <span>{s.hex}</span>
                  {copiedToken === `brand-${s.step}` && <Check className="w-3 h-3 text-emerald-600" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Slate Neutrals */}
        <div>
          <span className="text-xs font-semibold text-slate-700 block mb-3 font-mono">
            Slate Neutrals (Background, Hairline Borders & High-Contrast Typography)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
            {slateSwatches.map((s) => (
              <button
                key={s.step}
                type="button"
                onClick={() => copyVal(s.hex, `slate-${s.step}`)}
                className="group p-2 rounded-lg border border-slate-200 text-left hover:border-slate-400 transition-all cursor-pointer bg-white"
              >
                <div
                  className="w-full h-10 rounded mb-2 border border-slate-200/60 shadow-2xs transition-transform group-hover:scale-95"
                  style={{ backgroundColor: s.hex }}
                />
                <div className="text-[11px] font-mono font-semibold text-slate-900 truncate">
                  {s.step}
                </div>
                <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between mt-0.5">
                  <span>{s.hex}</span>
                  {copiedToken === `slate-${s.step}` && <Check className="w-3 h-3 text-emerald-600" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Heights & Spacing */}
      <section className="space-y-6 p-6 rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">02. Control Heights (Sales CRM Baseline)</h2>
          </div>
          <span className="text-xs font-mono text-indigo-600 font-bold">Standard B2B Height: 38px (md)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-xs text-slate-900">Compact Control (sm)</span>
                <span className="font-mono text-xs text-indigo-600 font-bold">32px (2rem)</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">Dense table actions, filter toggles, compact search</p>
            </div>
            <div className="h-8 px-3 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs font-medium shadow-xs">
              32px Button (sm)
            </div>
          </div>

          <div className="p-4 rounded-lg border-2 border-indigo-200 bg-indigo-50/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-xs text-slate-900">Standard Control (md)</span>
                <span className="font-mono text-xs text-indigo-600 font-bold">38px (2.375rem)</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">Default CRM form inputs, primary CTA, dropdown triggers</p>
            </div>
            <div className="h-[38px] px-4 rounded-md bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold shadow-xs">
              38px Standard (md)
            </div>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-xs text-slate-900">Large Control (lg)</span>
                <span className="font-mono text-xs text-indigo-600 font-bold">44px (2.75rem)</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">Landing hero CTA, marketing actions, mobile touch targets</p>
            </div>
            <div className="h-11 px-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-base font-semibold shadow-xs">
              44px Large (lg)
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Radii & Shadows */}
      <section className="space-y-6 p-6 rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">03. Border Radii & Elevation Depth</h2>
          </div>
          <span className="text-xs text-slate-500">6px control radius · 8px card radius · 1 level depth</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 border border-slate-200 rounded-sm bg-slate-50 text-center">
            <span className="text-xs font-mono font-semibold block text-slate-900">radii.sm (4px)</span>
            <span className="text-[11px] text-slate-500 mt-1 block">Badges, sub-items</span>
          </div>

          <div className="p-4 border-2 border-indigo-300 rounded-md bg-white text-center shadow-xs">
            <span className="text-xs font-mono font-semibold block text-indigo-700">radii.md (6px)</span>
            <span className="text-[11px] text-slate-500 mt-1 block">Standard inputs & buttons</span>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg bg-white text-center shadow-xs">
            <span className="text-xs font-mono font-semibold block text-slate-900">radii.lg (8px)</span>
            <span className="text-[11px] text-slate-500 mt-1 block">Cards, dialogs</span>
          </div>

          <div className="p-4 border border-slate-200 rounded-xl bg-white text-center shadow-md">
            <span className="text-xs font-mono font-semibold block text-slate-900">radii.xl (12px)</span>
            <span className="text-[11px] text-slate-500 mt-1 block">Modals, slide-overs</span>
          </div>
        </div>
      </section>

      {/* Section 4: Exportable Tokens Implementation */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Canonical Theme Source (packages/theme/tokens/index.ts)</h2>
        </div>
        <CodeViewer
          code={`// Exported canonical tokens imported by all Tech Inject components
export const tokens = {
  colors: {
    brand: { 600: '#4F46E5', 700: '#4338CA' },
    slate: { 50: '#F8FAFC', 200: '#E2E8F0', 700: '#334155', 900: '#0F172A' },
  },
  typography: {
    fonts: {
      display: '"Plus Jakarta Sans", sans-serif',
      body: '"Plus Jakarta Sans", sans-serif',
      mono: '"JetBrains Mono", monospace',
    },
  },
  heights: {
    control: { sm: '2rem', md: '2.375rem', lg: '2.75rem' },
  },
  radii: {
    sm: '4px',
    md: '6px', // Standard buttons & inputs
    lg: '8px', // Cards & modals
  },
  focus: {
    ring: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/30',
  },
};`}
          filename="tokens.ts"
          language="typescript"
        />
      </section>
    </div>
  );
}
