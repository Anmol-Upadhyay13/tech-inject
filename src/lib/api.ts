import { SessionUser } from '../../packages/types/auth.ts';
import { ComponentItem, ComponentProp } from '../../packages/types/component.ts';

export async function fetchHealth() {
  const res = await fetch('/api/health');
  return res.json();
}

export async function fetchComponents(includeDrafts = false): Promise<{ components: ComponentItem[] }> {
  const res = await fetch(`/api/components${includeDrafts ? '?includeDrafts=true' : ''}`);
  if (!res.ok) throw new Error('Failed to fetch components');
  return res.json();
}

export async function fetchComponent(slug: string): Promise<{ component: ComponentItem }> {
  const res = await fetch(`/api/components/${slug}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch component');
  }
  return res.json();
}

export async function fetchComponentPreview(slug: string): Promise<{
  locked: boolean;
  reason?: string;
  accessLevel: 'free' | 'premium';
  message?: string;
  previewData: any;
  propsSchema?: ComponentProp[];
}> {
  const res = await fetch(`/api/components/${slug}/preview`);
  return res.json();
}

export async function fetchComponentSource(slug: string): Promise<{
  name: string;
  slug: string;
  accessLevel: 'free' | 'premium';
  dependencies: string[];
  mainFile: { path: string; content: string; fileType: string };
  files: Array<{ path: string; content: string; fileType: string }>;
}> {
  const res = await fetch(`/api/components/${slug}/source`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch source code');
  }
  return res.json();
}

export async function fetchComponentAiPrompt(slug: string): Promise<{
  componentName: string;
  version: string;
  accessLevel: 'free' | 'premium';
  prompt: string;
}> {
  const res = await fetch(`/api/components/${slug}/ai-prompt`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch AI agent prompt');
  }
  return res.json();
}

// Admin APIs
export async function fetchAdminStats() {
  const res = await fetch('/api/admin/stats');
  if (!res.ok) throw new Error('Failed to fetch admin stats');
  return res.json();
}

export async function fetchAdminComponents() {
  const res = await fetch('/api/admin/components');
  if (!res.ok) throw new Error('Failed to fetch admin components');
  return res.json();
}

export async function createComponent(data: any) {
  const res = await fetch('/api/admin/components', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || json.details || 'Failed to create component');
  return json;
}

export async function publishComponent(id: string) {
  const res = await fetch(`/api/admin/components/${id}/publish`, { method: 'POST' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to publish component');
  return json;
}

export async function unpublishComponent(id: string) {
  const res = await fetch(`/api/admin/components/${id}/unpublish`, { method: 'POST' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to unpublish component');
  return json;
}

export async function deleteDraftComponent(id: string) {
  const res = await fetch(`/api/admin/components/${id}`, { method: 'DELETE' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to delete draft component');
  return json;
}

export async function fetchAdminCustomers() {
  const res = await fetch('/api/admin/customers');
  if (!res.ok) throw new Error('Failed to fetch customers');
  return res.json();
}

export async function updateCustomerPremium(userId: string, action: 'grant' | 'revoke') {
  const res = await fetch(`/api/admin/customers/${userId}/premium`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update premium status');
  return json;
}

export async function fetchAuditLogs() {
  const res = await fetch('/api/admin/audit-logs');
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}
