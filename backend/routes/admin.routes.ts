import { Router, Response } from 'express';
import { db } from '../db/database.ts';
import { requireAdmin, AuthenticatedRequest } from '../auth/jwt.ts';
import { createComponentSchema } from '../../packages/validation/component.schema.ts';
import { validateSafeFilePath } from '../storage/storage.ts';

export const adminRouter = Router();

// Enforce admin privileges on all admin routes
adminRouter.use(requireAdmin);

// Helper to log audit actions
function logAudit(userId: string | undefined, action: string, resource: string, details?: Record<string, unknown>) {
  const now = new Date().toISOString();
  const id = 'aud_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  db.prepare(`
    INSERT INTO audit_logs (id, user_id, action, resource, details, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, userId || null, action, resource, details ? JSON.stringify(details) : null, now);
}

// GET /api/admin/stats - Overview metrics
adminRouter.get('/stats', (_req, res: Response) => {
  const totalComponents = (db.prepare('SELECT COUNT(*) as c FROM components').get() as any).c;
  const publishedComponents = (db.prepare("SELECT COUNT(*) as c FROM components WHERE status = 'published'").get() as any).c;
  const draftComponents = (db.prepare("SELECT COUNT(*) as c FROM components WHERE status = 'draft'").get() as any).c;
  const premiumComponents = (db.prepare("SELECT COUNT(*) as c FROM components WHERE access_level = 'premium'").get() as any).c;
  const totalCustomers = (db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'customer'").get() as any).c;
  const premiumCustomers = (db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'customer' AND is_premium = 1").get() as any).c;

  return res.json({
    totalComponents,
    publishedComponents,
    draftComponents,
    premiumComponents,
    totalCustomers,
    premiumCustomers,
  });
});

// GET /api/admin/components - List all components including drafts
adminRouter.get('/components', (_req, res: Response) => {
  const rows = db.prepare(`
    SELECT id, name, slug, description, category, version, access_level, status, created_at, updated_at, published_at
    FROM components
    ORDER BY created_at DESC
  `).all() as any[];

  return res.json({
    components: rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      category: r.category,
      version: r.version,
      accessLevel: r.access_level,
      status: r.status,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      publishedAt: r.published_at,
    })),
  });
});

// POST /api/admin/components - Create a new component
adminRouter.post('/components', (req: AuthenticatedRequest, res: Response) => {
  const parseResult = createComponentSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: parseResult.error.issues.map((e) => `${e.path.map(String).join('.')}: ${e.message}`).join(', '),
    });
  }

  const data = parseResult.data;

  // Check unique slug
  const existing = db.prepare('SELECT id FROM components WHERE slug = ?').get(data.slug);
  if (existing) {
    return res.status(409).json({ error: `A component with slug "${data.slug}" already exists.` });
  }

  // Validate files for security and path traversal
  for (const file of data.files) {
    if (!validateSafeFilePath(file.path)) {
      return res.status(400).json({
        error: `Security rejection: Unsafe or prohibited file path "${file.path}". Only relative safe paths (.tsx, .ts, .css, .json) allowed.`,
      });
    }
  }

  const now = new Date().toISOString();
  const componentId = 'c_' + data.slug.replace(/[^a-z0-9]/g, '_') + '_' + Date.now();
  const publishedAt = data.status === 'published' ? now : null;

  db.prepare(`
    INSERT INTO components (
      id, name, slug, description, category, version, access_level, status,
      props_schema, usage_documentation, dependencies, preview_data, created_at, updated_at, published_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    componentId,
    data.name,
    data.slug,
    data.description,
    data.category,
    data.version,
    data.accessLevel,
    data.status,
    JSON.stringify(data.propsSchema),
    data.usageDocumentation,
    JSON.stringify(data.dependencies),
    JSON.stringify(data.previewData),
    now,
    now,
    publishedAt
  );

  // Insert files
  for (const file of data.files) {
    const fileId = 'f_' + componentId + '_' + pathSafe(file.path);
    db.prepare(`
      INSERT INTO component_files (id, component_id, path, content, is_main, file_type, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      fileId,
      componentId,
      file.path,
      file.content,
      file.isMain ? 1 : 0,
      file.fileType,
      now
    );
  }

  logAudit(req.user?.id, 'CREATE_COMPONENT', `component:${data.slug}`, {
    name: data.name,
    status: data.status,
    accessLevel: data.accessLevel,
  });

  return res.status(201).json({
    success: true,
    message: `Component "${data.name}" created successfully.`,
    componentId,
    slug: data.slug,
  });
});

function pathSafe(p: string): string {
  return p.replace(/[^a-zA-Z0-9_-]/g, '_');
}

// POST /api/admin/components/:id/publish - Publish a draft component
adminRouter.post('/components/:id/publish', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const comp = db.prepare('SELECT id, name, slug, status FROM components WHERE id = ?').get(id) as any;

  if (!comp) {
    return res.status(404).json({ error: 'Component not found' });
  }

  const now = new Date().toISOString();
  db.prepare('UPDATE components SET status = ?, published_at = ?, updated_at = ? WHERE id = ?').run(
    'published',
    now,
    now,
    id
  );

  logAudit(req.user?.id, 'PUBLISH_COMPONENT', `component:${comp.slug}`, {
    name: comp.name,
    previousStatus: comp.status,
  });

  return res.json({
    success: true,
    message: `Component "${comp.name}" has been published and is now live in the public catalogue.`,
    slug: comp.slug,
  });
});

// POST /api/admin/components/:id/unpublish - Unpublish a component
adminRouter.post('/components/:id/unpublish', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const comp = db.prepare('SELECT id, name, slug, status FROM components WHERE id = ?').get(id) as any;

  if (!comp) {
    return res.status(404).json({ error: 'Component not found' });
  }

  const now = new Date().toISOString();
  db.prepare('UPDATE components SET status = ?, updated_at = ? WHERE id = ?').run(
    'draft',
    now,
    id
  );

  logAudit(req.user?.id, 'UNPUBLISH_COMPONENT', `component:${comp.slug}`, {
    name: comp.name,
    previousStatus: comp.status,
  });

  return res.json({
    success: true,
    message: `Component "${comp.name}" unpublished. It has been removed from the public catalogue and direct API access is denied.`,
    slug: comp.slug,
  });
});

// DELETE /api/admin/components/:id - Delete a draft
adminRouter.delete('/components/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const comp = db.prepare('SELECT id, name, slug, status FROM components WHERE id = ?').get(id) as any;

  if (!comp) {
    return res.status(404).json({ error: 'Component not found' });
  }

  if (comp.status === 'published') {
    return res.status(400).json({ error: 'Cannot delete a published component directly. Unpublish it first.' });
  }

  db.prepare('DELETE FROM component_files WHERE component_id = ?').run(id);
  db.prepare('DELETE FROM components WHERE id = ?').run(id);

  logAudit(req.user?.id, 'DELETE_COMPONENT', `component:${comp.slug}`, { name: comp.name });

  return res.json({ success: true, message: `Draft component "${comp.name}" deleted.` });
});

// GET /api/admin/customers - List all registered customers
adminRouter.get('/customers', (_req, res: Response) => {
  const customers = db.prepare(`
    SELECT id, email, name, role, is_premium, created_at, last_login_at
    FROM users
    WHERE role = 'customer'
    ORDER BY created_at DESC
  `).all() as any[];

  return res.json({
    customers: customers.map((c) => ({
      id: c.id,
      email: c.email,
      name: c.name,
      role: c.role,
      isPremium: Boolean(c.is_premium),
      createdAt: c.created_at,
      lastLoginAt: c.last_login_at,
    })),
  });
});

// POST /api/admin/customers/:id/premium - Grant or Revoke Premium access
adminRouter.post('/customers/:id/premium', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { action } = req.body; // 'grant' | 'revoke'

  if (action !== 'grant' && action !== 'revoke') {
    return res.status(400).json({ error: 'Action must be "grant" or "revoke"' });
  }

  const user = db.prepare('SELECT id, email, name, role, is_premium FROM users WHERE id = ?').get(id) as any;
  if (!user) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  const now = new Date().toISOString();
  const isPremium = action === 'grant' ? 1 : 0;

  // Update user table
  db.prepare('UPDATE users SET is_premium = ? WHERE id = ?').run(isPremium, user.id);

  if (action === 'grant') {
    const grantId = 'pa_' + Date.now();
    db.prepare(`
      INSERT INTO premium_access (id, user_id, granted_by, status, granted_at)
      VALUES (?, ?, ?, 'active', ?)
    `).run(grantId, user.id, req.user!.id, now);
  } else {
    db.prepare(`
      UPDATE premium_access
      SET status = 'revoked', revoked_at = ?
      WHERE user_id = ? AND status = 'active'
    `).run(now, user.id);
  }

  logAudit(req.user?.id, action === 'grant' ? 'GRANT_PREMIUM' : 'REVOKE_PREMIUM', `user:${user.email}`, {
    customerName: user.name,
    customerEmail: user.email,
  });

  return res.json({
    success: true,
    message: action === 'grant'
      ? `Premium access granted to ${user.name} (${user.email}).`
      : `Premium access revoked from ${user.name} (${user.email}). Protected requests will now be rejected immediately.`,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      isPremium: Boolean(isPremium),
    },
  });
});

// GET /api/admin/audit-logs - View audit trail
adminRouter.get('/audit-logs', (_req, res: Response) => {
  const rows = db.prepare(`
    SELECT a.id, a.user_id, u.email as user_email, a.action, a.resource, a.details, a.created_at
    FROM audit_logs a
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.created_at DESC
    LIMIT 100
  `).all() as any[];

  return res.json({
    auditLogs: rows.map((r) => ({
      id: r.id,
      userId: r.user_id,
      userEmail: r.user_email || 'System',
      action: r.action,
      resource: r.resource,
      details: r.details ? JSON.parse(r.details) : null,
      createdAt: r.created_at,
    })),
  });
});
