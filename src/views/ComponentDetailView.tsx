import React, { useState, useEffect } from 'react';
import {
  fetchComponent,
  fetchComponentPreview,
  fetchComponentSource,
  fetchComponentAiPrompt,
} from '../lib/api.ts';
import { useAuth } from '../lib/authContext.tsx';
import { ComponentItem, ComponentProp } from '../../packages/types/component.ts';
import { Button } from '../../packages/ui/Button.tsx';
import { Badge } from '../../packages/ui/Badge.tsx';
import { Tabs } from '../../packages/ui/Tabs.tsx';
import { Breadcrumbs } from '../../packages/ui/Breadcrumbs.tsx';
import { ComponentPreviewRenderer } from '../components/catalogue/ComponentPreviewRenderer.tsx';
import {
  Copy,
  Check,
  Terminal,
  Sparkles,
  Lock,
  Code2,
  BookOpen,
  Sliders,
  ShieldAlert,
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ComponentDetailViewProps {
  slug: string;
  allComponents: ComponentItem[];
  onSelectComponent: (slug: string) => void;
  onNavigate: (route: string) => void;
  onOpenLoginModal: () => void;
}

export function ComponentDetailView({
  slug,
  allComponents,
  onSelectComponent,
  onNavigate,
  onOpenLoginModal,
}: ComponentDetailViewProps) {
  const { user } = useAuth();

  const [component, setComponent] = useState<ComponentItem | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'usage' | 'props' | 'install' | 'ai-agent'>('preview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Preview controls
  const [selectedVariant, setSelectedVariant] = useState<string>('primary');
  const [selectedSize, setSelectedSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [previewWidth, setPreviewWidth] = useState<'100%' | '768px' | '480px' | '320px'>('100%');
  const [previewBg, setPreviewBg] = useState<'white' | 'slate' | 'dark'>('slate');

  // Source & AI Prompt data
  const [sourceData, setSourceData] = useState<{
    mainFile: { path: string; content: string };
    dependencies: string[];
  } | null>(null);
  const [sourceError, setSourceError] = useState<string | null>(null);

  const [aiPrompt, setAiPrompt] = useState<string | null>(null);
  const [aiPromptError, setAiPromptError] = useState<string | null>(null);

  const [copiedState, setCopiedState] = useState<string | null>(null);

  // Load component metadata
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetchComponent(slug)
      .then((data) => {
        if (!isMounted) return;
        setComponent(data.component);
        const defaultVar = data.component.previewData?.defaultVariant || data.component.previewData?.variants?.[0]?.name || 'default';
        setSelectedVariant(defaultVar);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Failed to load component');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Load source when switching to code tab
  useEffect(() => {
    if (activeTab === 'code' && !sourceData && component) {
      fetchComponentSource(slug)
        .then((data) => {
          setSourceData(data);
          setSourceError(null);
        })
        .catch((err) => {
          setSourceError(err.message || 'Could not load source code');
        });
    }
  }, [activeTab, slug, sourceData, component]);

  // Load AI prompt when switching to ai-agent tab
  useEffect(() => {
    if (activeTab === 'ai-agent' && !aiPrompt && component) {
      fetchComponentAiPrompt(slug)
        .then((data) => {
          setAiPrompt(data.prompt);
          setAiPromptError(null);
        })
        .catch((err) => {
          setAiPromptError(err.message || 'Could not load AI agent prompt');
        });
    }
  }, [activeTab, slug, aiPrompt, component]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(label);
    setTimeout(() => setCopiedState(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span className="text-xs text-slate-500 font-mono">Loading component specifications...</span>
      </div>
    );
  }

  if (error || !component) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <ShieldAlert className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 mb-1">Component Unavailable</h2>
        <p className="text-xs sm:text-sm text-slate-600 mb-6">{error || 'Component could not be found.'}</p>
        <Button variant="primary" onClick={() => onNavigate('catalogue')}>
          Return to Catalogue
        </Button>
      </div>
    );
  }

  const isPremium = component.accessLevel === 'premium';
  const hasPremiumAccess = user?.isPremium === true;
  const isLocked = isPremium && !hasPremiumAccess;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Breadcrumb Trail */}
      <Breadcrumbs
        items={[
          { label: 'Catalogue', onClick: () => onNavigate('catalogue') },
          { label: component.category },
          { label: component.name },
        ]}
        className="mb-4"
      />

      {/* Main 3-Column Layout: Left Nav / Center Content / Right Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Component Navigation (Col 1-2 on desktop) */}
        <aside className="hidden lg:block lg:col-span-2 space-y-6 sticky top-20">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
              Components ({allComponents.length})
            </span>
            <div className="space-y-1">
              {allComponents.map((c) => {
                const isCurrent = c.slug === slug;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onSelectComponent(c.slug);
                      setSourceData(null);
                      setAiPrompt(null);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium text-left transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                    {c.accessLevel === 'premium' && (
                      <span className="text-[10px] text-purple-600 font-bold">PRO</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN: Component Preview & Documentation Tabs (Col 3-9) */}
        <main className="lg:col-span-7 space-y-6">
          {/* Top Component Header */}
          <div className="border-b border-slate-200 pb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {component.category}
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-mono text-slate-400">v{component.version}</span>
              <Badge variant={isPremium ? 'premium' : 'neutral'}>
                {isPremium ? 'PRO COMPONENT' : 'FREE'}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {component.name}
            </h1>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              {component.description}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 overflow-x-auto">
            <Tabs
              variant="segmented"
              activeId={activeTab}
              onChange={(id) => setActiveTab(id as any)}
              items={[
                { id: 'preview', label: 'Preview' },
                { id: 'code', label: 'Code' },
                { id: 'usage', label: 'Usage' },
                { id: 'props', label: 'Props', count: component.propsSchema.length },
                { id: 'install', label: 'Install' },
                { id: 'ai-agent', label: 'AI Agent' },
              ]}
            />
          </div>

          {/* TAB 1: PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              {/* Preview Controls Bar */}
              <div className="flex items-center justify-between flex-wrap gap-3 p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                {/* Variant selector */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-500 font-medium mr-1">Variant:</span>
                  {(component.previewData?.variants || []).map((v) => (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => setSelectedVariant(v.name)}
                      className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                        selectedVariant === v.name
                          ? 'bg-white text-slate-900 shadow-2xs font-semibold border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>

                {/* State & Size Controls */}
                <div className="flex items-center gap-2">
                  {component.previewData?.supportsSizes && (
                    <div className="flex items-center bg-white rounded border border-slate-200 p-0.5">
                      {(['sm', 'md', 'lg'] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelectedSize(s)}
                          className={`px-2 py-0.5 rounded text-[11px] uppercase cursor-pointer ${
                            selectedSize === s ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Responsive Width Toggle */}
                  <div className="hidden sm:flex items-center bg-white rounded border border-slate-200 p-0.5 text-slate-500">
                    <button
                      type="button"
                      onClick={() => setPreviewWidth('100%')}
                      className={`p-1 rounded cursor-pointer ${previewWidth === '100%' ? 'bg-slate-100 text-slate-900' : ''}`}
                      title="100% Full Viewport"
                    >
                      <Maximize2 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewWidth('768px')}
                      className={`p-1 rounded cursor-pointer ${previewWidth === '768px' ? 'bg-slate-100 text-slate-900' : ''}`}
                      title="Tablet (768px)"
                    >
                      <Tablet className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewWidth('320px')}
                      className={`p-1 rounded cursor-pointer ${previewWidth === '320px' ? 'bg-slate-100 text-slate-900' : ''}`}
                      title="Mobile (320px)"
                    >
                      <Smartphone className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Render Area */}
              <div
                className={`mx-auto transition-all duration-200 rounded-xl border border-slate-200 overflow-hidden shadow-xs flex items-center justify-center p-6 sm:p-12 min-h-[300px] ${
                  previewBg === 'slate' ? 'bg-slate-50/70' : previewBg === 'dark' ? 'bg-slate-900' : 'bg-white'
                }`}
                style={{ maxWidth: previewWidth }}
              >
                <ComponentPreviewRenderer
                  slug={component.slug}
                  variant={selectedVariant}
                  size={selectedSize}
                  isDisabled={isDisabled}
                  isLoading={isLoadingState}
                  isLocked={isLocked}
                  onOpenLoginModal={onOpenLoginModal}
                />
              </div>

              {/* State Toggles (Interactive) */}
              <div className="flex items-center gap-4 text-xs text-slate-600 px-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isDisabled}
                    onChange={(e) => setIsDisabled(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Simulate Disabled State</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isLoadingState}
                    onChange={(e) => setIsLoadingState(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Simulate Loading Spinner</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: CODE */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              {isLocked ? (
                <div className="p-10 text-center rounded-xl border border-dashed border-purple-200 bg-purple-50/40">
                  <Lock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="text-base font-semibold text-slate-900 mb-1">
                    Premium Source Code Protected
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto mb-4">
                    The source code for <strong>{component.name}</strong> is protected under the Tech Inject Pro license. Sign in with an authorized Pro account to inspect and copy source files.
                  </p>
                  <Button variant="primary" onClick={onOpenLoginModal}>
                    Sign In with Pro Account
                  </Button>
                </div>
              ) : sourceError ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                  {sourceError}
                </div>
              ) : !sourceData ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  Fetching authorized source code from server...
                </div>
              ) : (
                <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden text-slate-100 shadow-md">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2 font-mono text-slate-400">
                      <span>{sourceData.mainFile.path}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(sourceData.mainFile.content, 'source')}
                      className="text-slate-300 hover:text-white hover:bg-slate-800 h-7 text-xs"
                      leftIcon={
                        copiedState === 'source' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )
                      }
                    >
                      {copiedState === 'source' ? 'Copied!' : 'Copy Code'}
                    </Button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-slate-200 max-h-[500px]">
                    <code>{sourceData.mainFile.content}</code>
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: USAGE */}
          {activeTab === 'usage' && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4">
                <h3 className="text-base font-semibold text-slate-900">Integration Guidelines</h3>
                <div className="prose prose-sm max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
                  <p>
                    Follow the standard B2B design guidelines when embedding the <strong>{component.name}</strong> into your project:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                    <li>Always import and preserve the shared theme tokens from <code>@/theme/tokens</code>.</li>
                    <li>Avoid adding ad-hoc inline color overrides; rely on provided variants for semantic consistency.</li>
                    <li>Ensure proper keyboard focus and accessibility labeling for screen readers.</li>
                  </ul>
                </div>

                <div className="rounded-lg bg-slate-900 text-slate-100 p-4 font-mono text-xs overflow-x-auto">
                  <pre>{component.usageDocumentation}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROPS */}
          {activeTab === 'props' && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-lg overflow-x-auto bg-white shadow-2xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="py-2.5 px-4">Prop</th>
                      <th className="py-2.5 px-4">Type</th>
                      <th className="py-2.5 px-4">Required</th>
                      <th className="py-2.5 px-4">Default</th>
                      <th className="py-2.5 px-4">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {component.propsSchema.map((prop) => (
                      <tr key={prop.name} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-4 font-mono font-semibold text-indigo-600">
                          {prop.name}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-600">
                          {prop.type}
                        </td>
                        <td className="py-2.5 px-4">
                          {prop.required ? (
                            <span className="text-red-600 font-semibold">Yes</span>
                          ) : (
                            <span className="text-slate-400">No</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-500">
                          {prop.defaultValue || '—'}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600 max-w-xs">
                          {prop.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: INSTALL */}
          {activeTab === 'install' && (
            <div className="space-y-4">
              <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-4">
                <h3 className="text-base font-semibold text-slate-900">CLI Installation</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Run the official Tech Inject CLI from your terminal inside any React + TypeScript project. The command automatically validates dependencies, verifies path boundaries, and writes the component files into your components directory.
                </p>

                <div className="p-3.5 bg-slate-900 text-slate-100 rounded-lg flex items-center justify-between gap-3 text-xs font-mono shadow-sm">
                  <span className="truncate">
                    npx @tech-inject/cli add {component.slug}
                    {isPremium ? ' --token <your_pro_token>' : ''}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      copyToClipboard(
                        `npx @tech-inject/cli add ${component.slug}${isPremium ? ' --token <your_pro_token>' : ''}`,
                        'install'
                      )
                    }
                    className="text-slate-300 hover:text-white hover:bg-slate-800 h-7 text-xs shrink-0"
                    leftIcon={
                      copiedState === 'install' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )
                    }
                  >
                    {copiedState === 'install' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>

                {isPremium && (
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">Premium Component Authentication</strong>
                      To install this component via CLI, copy your active access token from your Account settings and pass it with <code>--token</code>.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: AI AGENT */}
          {activeTab === 'ai-agent' && (
            <div className="space-y-4">
              {isLocked ? (
                <div className="p-10 text-center rounded-xl border border-dashed border-purple-200 bg-purple-50/40">
                  <Lock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="text-base font-semibold text-slate-900 mb-1">
                    AI Agent Prompt Locked
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto mb-4">
                    Component integration prompts for Pro components require an active subscription.
                  </p>
                  <Button variant="primary" onClick={onOpenLoginModal}>
                    Sign In with Pro Account
                  </Button>
                </div>
              ) : aiPromptError ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                  {aiPromptError}
                </div>
              ) : !aiPrompt ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  Generating AI Agent integration prompt...
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                  <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/70">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        Agent Prompt: {component.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Paste this structured prompt directly into your AI coding assistant (Cursor, Claude, Copilot).
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => copyToClipboard(aiPrompt, 'prompt')}
                      leftIcon={
                        copiedState === 'prompt' ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )
                      }
                    >
                      {copiedState === 'prompt' ? 'Copied Prompt' : 'Copy AI Prompt'}
                    </Button>
                  </div>
                  <pre className="p-5 text-xs text-slate-800 font-mono leading-relaxed bg-slate-50/30 overflow-x-auto whitespace-pre-wrap max-h-[500px]">
                    {aiPrompt}
                  </pre>
                </div>
              )}
            </div>
          )}
        </main>

        {/* RIGHT COLUMN: Metadata & Quick Actions (Col 10-12) */}
        <aside className="lg:col-span-3 space-y-5">
          <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Component Details
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Category</span>
                <span className="font-semibold text-slate-900">{component.category}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Version</span>
                <span className="font-mono font-semibold text-slate-900">v{component.version}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Access Level</span>
                <Badge variant={isPremium ? 'premium' : 'neutral'}>
                  {isPremium ? 'PRO ONLY' : 'FREE'}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Total Props</span>
                <span className="font-mono text-slate-900">{component.propsSchema.length}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Status</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Published
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Button
                variant="primary"
                size="sm"
                isFullWidth
                onClick={() => setActiveTab('code')}
                leftIcon={<Code2 className="w-3.5 h-3.5" />}
              >
                View Source Code
              </Button>
              <Button
                variant="secondary"
                size="sm"
                isFullWidth
                onClick={() => setActiveTab('ai-agent')}
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
              >
                Get AI Agent Prompt
              </Button>
            </div>
          </div>

          {/* Quick CLI snippet */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Quick Install
            </span>
            <div className="p-2 bg-slate-900 text-slate-200 rounded font-mono text-[11px] flex items-center justify-between">
              <span className="truncate">npx @tech-inject/cli add {component.slug}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(`npx @tech-inject/cli add ${component.slug}`, 'quick-install')}
                className="text-slate-400 hover:text-white ml-2 cursor-pointer"
              >
                {copiedState === 'quick-install' ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
