import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/authContext.tsx';
import {
  fetchAdminStats,
  fetchAdminComponents,
  createComponent,
  publishComponent,
  unpublishComponent,
  deleteDraftComponent,
  fetchAdminCustomers,
  updateCustomerPremium,
  fetchAuditLogs,
} from '../lib/api.ts';
import { ComponentItem } from '../../packages/types/component.ts';
import { User } from '../../packages/types/auth.ts';
import { AuditLogEntry } from '../../packages/types/audit.ts';
import { Button } from '../../packages/ui/Button.tsx';
import { Badge } from '../../packages/ui/Badge.tsx';
import { Table } from '../../packages/ui/Table.tsx';
import { Modal } from '../../packages/ui/Modal.tsx';
import { Input } from '../../packages/ui/Input.tsx';
import { FormField } from '../../packages/ui/FormField.tsx';
import { Tabs } from '../../packages/ui/Tabs.tsx';
import {
  Shield,
  Layers,
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
  Eye,
  FileCheck,
  FileX,
  Trash2,
  Sparkles,
  Lock,
  Unlock,
  History,
  Check,
} from 'lucide-react';

export function AdminView({ onOpenLoginModal }: { onOpenLoginModal: () => void }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'customers' | 'audit'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Create component modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('Actions');
  const [formVersion, setFormVersion] = useState('1.0.0');
  const [formAccess, setFormAccess] = useState<'free' | 'premium'>('free');
  const [formStatus, setFormStatus] = useState<'draft' | 'published'>('draft');
  const [formFileContent, setFormFileContent] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Customer premium toggle confirmation modal state
  const [customerModalUser, setCustomerModalUser] = useState<User | null>(null);
  const [customerModalAction, setCustomerModalAction] = useState<'grant' | 'revoke'>('grant');

  // Search filters
  const [compSearch, setCompSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  const exportAuditLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tech-inject-audit-logs-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('✔ Audit log exported to JSON file.');
  };

  const loadAllData = async () => {
    if (!isAdmin) return;
    setIsLoading(true);
    try {
      const [s, c, u, a] = await Promise.all([
        fetchAdminStats(),
        fetchAdminComponents(),
        fetchAdminCustomers(),
        fetchAuditLogs(),
      ]);
      setStats(s);
      setComponents(c.components);
      setCustomers(u.customers);
      setAuditLogs(a.auditLogs);
    } catch (err: any) {
      setActionMessage(`Error loading admin data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    }
  }, [isAdmin]);

  const showToast = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handlePublish = async (id: string, name: string) => {
    try {
      await publishComponent(id);
      showToast(`✔ Component "${name}" published to public catalogue.`);
      await loadAllData();
    } catch (err: any) {
      showToast(`✖ Failed to publish: ${err.message}`);
    }
  };

  const handleUnpublish = async (id: string, name: string) => {
    try {
      await unpublishComponent(id);
      showToast(`✔ Component "${name}" unpublished. Hidden from catalogue and direct requests.`);
      await loadAllData();
    } catch (err: any) {
      showToast(`✖ Failed to unpublish: ${err.message}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete draft "${name}"?`)) return;
    try {
      await deleteDraftComponent(id);
      showToast(`✔ Draft component "${name}" deleted.`);
      await loadAllData();
    } catch (err: any) {
      showToast(`✖ Failed to delete: ${err.message}`);
    }
  };

  const handleCreateComponent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const safeSlug = formSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const safeContent =
      formFileContent ||
      `import React from 'react';\n\nexport function ${formName.replace(/[^a-zA-Z0-9]/g, '')}() {\n  return (\n    <div className="p-4 bg-slate-50 border border-slate-200 rounded-md">\n      <span className="font-semibold text-sm">${formName}</span>\n    </div>\n  );\n}\n`;

    try {
      await createComponent({
        name: formName,
        slug: safeSlug,
        description: formDescription || `Custom ${formName} component for Tech Inject library.`,
        category: formCategory,
        version: formVersion,
        accessLevel: formAccess,
        status: formStatus,
        propsSchema: [
          { name: 'className', type: 'string', required: false, description: 'Optional CSS class override' },
        ],
        usageDocumentation: `### Usage\n\`\`\`tsx\nimport { ${formName.replace(/[^a-zA-Z0-9]/g, '')} } from '@/components/ui/${formName.replace(/[^a-zA-Z0-9]/g, '')}';\n\`\`\``,
        dependencies: [],
        previewData: {
          defaultVariant: 'default',
          variants: [{ name: 'default', label: 'Default', props: {} }],
        },
        files: [
          {
            path: `${formName.replace(/[^a-zA-Z0-9]/g, '')}.tsx`,
            content: safeContent,
            isMain: true,
            fileType: 'tsx',
          },
        ],
      });

      setIsCreateOpen(false);
      setFormName('');
      setFormSlug('');
      setFormDescription('');
      setFormFileContent('');
      showToast(`✔ Component "${formName}" created successfully!`);
      await loadAllData();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create component');
    }
  };

  const confirmPremiumAction = async () => {
    if (!customerModalUser) return;
    try {
      await updateCustomerPremium(customerModalUser.id, customerModalAction);
      showToast(
        customerModalAction === 'grant'
          ? `✔ Premium granted to ${customerModalUser.email}.`
          : `✔ Premium revoked from ${customerModalUser.email}. Protected requests will fail immediately.`
      );
      setCustomerModalUser(null);
      await loadAllData();
    } catch (err: any) {
      showToast(`✖ Failed to update premium access: ${err.message}`);
    }
  };

  // If not signed in as admin
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 mx-auto shadow-xs">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Administrator Access Required</h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          The Admin Dashboard is protected. Please sign in with an administrator account to publish components, edit drafts, configure access levels, and manage customer subscriptions.
        </p>
        <div className="pt-2">
          <Button variant="primary" onClick={onOpenLoginModal} leftIcon={<Shield className="w-4 h-4" />}>
            Sign In with Administrator Account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span className="text-indigo-600 font-semibold">Admin Console</span>
            <span aria-hidden="true">·</span>
            <span>Tech Inject Control Plane</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Design System Administration
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={() => setIsCreateOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Component
          </Button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-lg text-xs font-medium flex items-center justify-between animate-in fade-in duration-100">
          <span>{actionMessage}</span>
          <button type="button" onClick={() => setActionMessage(null)} className="text-indigo-500 hover:text-indigo-700">
            ×
          </button>
        </div>
      )}

      {/* Admin Tab Navigation */}
      <div className="border-b border-slate-200">
        <Tabs
          variant="segmented"
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as any)}
          items={[
            { id: 'overview', label: 'Overview' },
            { id: 'components', label: 'Components', count: components.length },
            { id: 'customers', label: 'Customers & Premium', count: customers.length },
            { id: 'audit', label: 'Audit Log' },
          ]}
        />
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block font-mono">{stats?.totalComponents || 0}</span>
              <span className="text-[10px] text-slate-400 mt-1 block">In Registry</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">Published</span>
              <span className="text-2xl font-bold text-emerald-700 mt-1 block font-mono">{stats?.publishedComponents || 0}</span>
              <span className="text-[10px] text-slate-400 mt-1 block">Live in Catalogue</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider block">Drafts</span>
              <span className="text-2xl font-bold text-amber-700 mt-1 block font-mono">{stats?.draftComponents || 0}</span>
              <span className="text-[10px] text-slate-400 mt-1 block">Staged Only</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider block">Premium</span>
              <span className="text-2xl font-bold text-purple-700 mt-1 block font-mono">{stats?.premiumComponents || 0}</span>
              <span className="text-[10px] text-slate-400 mt-1 block">Pro Components</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Customers</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block font-mono">{stats?.totalCustomers || 0}</span>
              <span className="text-[10px] text-slate-400 mt-1 block">Registered Users</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider block">Pro Members</span>
              <span className="text-2xl font-bold text-purple-700 mt-1 block font-mono">{stats?.premiumCustomers || 0}</span>
              <span className="text-[10px] text-slate-400 mt-1 block">Active Subscriptions</span>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="p-6 bg-slate-50/70 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Component Lifecycle Pipeline</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Draft components are completely hidden from the public catalogue and denied at the API layer until explicitly published.
              </p>
            </div>
            <Button variant="secondary" onClick={() => setActiveTab('components')}>
              Manage Components
            </Button>
          </div>
        </div>
      )}

      {/* TAB 2: COMPONENTS MANAGEMENT */}
      {activeTab === 'components' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="w-full sm:max-w-xs">
              <Input
                placeholder="Search components or slug..."
                value={compSearch}
                onChange={(e) => setCompSearch(e.target.value)}
                size="sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono">
                Showing {components.filter(c => !compSearch || c.name.toLowerCase().includes(compSearch.toLowerCase()) || c.slug.toLowerCase().includes(compSearch.toLowerCase())).length} of {components.length}
              </span>
              <Button size="sm" variant="secondary" onClick={loadAllData}>
                Refresh
              </Button>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-x-auto bg-white shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Component</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-4">Tier</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {components
                  .filter((c) => !compSearch || c.name.toLowerCase().includes(compSearch.toLowerCase()) || c.slug.toLowerCase().includes(compSearch.toLowerCase()))
                  .map((comp) => {
                  const isPub = comp.status === 'published';
                  return (
                    <tr key={comp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {comp.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {comp.slug}
                      </td>
                      <td className="py-3 px-4">
                        {comp.category}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        v{comp.version}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={comp.accessLevel === 'premium' ? 'premium' : 'neutral'}>
                          {comp.accessLevel === 'premium' ? 'PRO' : 'FREE'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 font-medium ${
                            isPub ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPub ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          {isPub ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isPub ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnpublish(comp.id, comp.name)}
                              className="h-7 text-xs text-amber-700 hover:bg-amber-50 border-amber-200"
                              leftIcon={<FileX className="w-3 h-3" />}
                            >
                              Unpublish
                            </Button>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handlePublish(comp.id, comp.name)}
                                className="h-7 text-xs"
                                leftIcon={<FileCheck className="w-3 h-3" />}
                              >
                                Publish
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(comp.id, comp.name)}
                                className="h-7 text-xs text-red-600 hover:bg-red-50"
                                aria-label="Delete draft"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMERS & PREMIUM ACCESS */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Customer Access Management</h3>
              <p className="text-xs text-slate-500">
                Grant or revoke Premium subscriptions with immediate database effect.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search email or name..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                size="sm"
                className="w-48"
              />
              <Button size="sm" variant="secondary" onClick={loadAllData}>
                Refresh
              </Button>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-x-auto bg-white shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Subscription Status</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4">Last Login</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {customers
                  .filter((c) => !customerSearch || c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.email.toLowerCase().includes(customerSearch.toLowerCase()))
                  .map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-semibold text-slate-900">{c.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{c.email}</td>
                    <td className="py-3 px-4">
                      {c.isPremium ? (
                        <Badge variant="premium">PREMIUM PRO</Badge>
                      ) : (
                        <Badge variant="neutral">FREE TIER</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {c.lastLoginAt ? new Date(c.lastLoginAt).toLocaleTimeString() : 'Never'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {c.isPremium ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setCustomerModalUser(c);
                            setCustomerModalAction('revoke');
                          }}
                          className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                          leftIcon={<Lock className="w-3 h-3" />}
                        >
                          Revoke Premium
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => {
                            setCustomerModalUser(c);
                            setCustomerModalAction('grant');
                          }}
                          className="h-7 text-xs bg-purple-600 hover:bg-purple-700 border-purple-600"
                          leftIcon={<Sparkles className="w-3 h-3" />}
                        >
                          Grant Premium
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Security & Publishing Audit Trail</h3>
              <p className="text-xs text-slate-500">Immutable ledger of administrative actions and permissions.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={exportAuditLogs}>
                Export JSON
              </Button>
              <Button size="sm" variant="secondary" onClick={loadAllData}>
                Refresh Logs
              </Button>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-x-auto bg-white shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Admin Email</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No security audit events recorded yet.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 font-mono text-indigo-600">
                        {log.resource}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {log.userEmail}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600 max-w-xs truncate">
                        {log.details ? JSON.stringify(log.details) : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE COMPONENT MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Design System Component"
        description="Configure component metadata, category, version, and upload initial source code."
        size="lg"
      >
        <form onSubmit={handleCreateComponent} className="space-y-4 text-xs">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Component Name" required>
              <Input
                placeholder="e.g. MetricCard"
                value={formName}
                onChange={(e) => {
                  setFormName(e.target.value);
                  if (!formSlug) {
                    setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                  }
                }}
                required
              />
            </FormField>

            <FormField label="Slug (URL identifier)" required>
              <Input
                placeholder="e.g. metric-card"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                required
              />
            </FormField>
          </div>

          <FormField label="Description" required>
            <Input
              placeholder="Explain the purpose, states, and responsive behavior..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              required
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <FormField label="Category">
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-indigo-600"
              >
                <option value="Actions">Actions</option>
                <option value="Forms">Forms</option>
                <option value="Feedback">Feedback</option>
                <option value="Data Display">Data Display</option>
                <option value="Navigation">Navigation</option>
                <option value="Layout">Layout</option>
                <option value="Overlay">Overlay</option>
              </select>
            </FormField>

            <FormField label="Version">
              <Input
                value={formVersion}
                onChange={(e) => setFormVersion(e.target.value)}
                placeholder="1.0.0"
                required
              />
            </FormField>

            <FormField label="Access Tier">
              <select
                value={formAccess}
                onChange={(e) => setFormAccess(e.target.value as any)}
                className="w-full h-9 px-3 rounded-md border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-indigo-600"
              >
                <option value="free">Free (Open Access)</option>
                <option value="premium">Premium (Pro Only)</option>
              </select>
            </FormField>

            <FormField label="Initial Status">
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                className="w-full h-9 px-3 rounded-md border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-indigo-600"
              >
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Public)</option>
              </select>
            </FormField>
          </div>

          <FormField label="Component Source Code (TypeScript + React)">
            <textarea
              rows={6}
              value={formFileContent}
              onChange={(e) => setFormFileContent(e.target.value)}
              placeholder="Paste component implementation..."
              className="w-full p-3 font-mono text-xs rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600"
            />
          </FormField>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save & Register Component
            </Button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM PREMIUM STATUS CHANGE MODAL */}
      <Modal
        isOpen={Boolean(customerModalUser)}
        onClose={() => setCustomerModalUser(null)}
        title={customerModalAction === 'grant' ? 'Grant Premium Membership' : 'Revoke Premium Membership'}
        description={`Confirm updating subscription access for customer ${customerModalUser?.name} (${customerModalUser?.email}).`}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCustomerModalUser(null)}>
              Cancel
            </Button>
            <Button
              variant={customerModalAction === 'grant' ? 'primary' : 'destructive'}
              onClick={confirmPremiumAction}
            >
              {customerModalAction === 'grant' ? 'Grant Pro Access' : 'Revoke Pro Access'}
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            {customerModalAction === 'grant' ? (
              <span>This customer will immediately gain access to all locked components, source code, CLI installer tokens, and AI integration prompts.</span>
            ) : (
              <span className="text-red-700">
                Warning: Revoking access will immediately cause all subsequent protected requests from this customer to be denied with 403 Forbidden. Free components will remain accessible.
              </span>
            )}
          </p>
        </div>
      </Modal>
    </div>
  );
}
