import { Router, Response } from 'express';
import { db } from '../db/database.ts';
import { optionalAuth, AuthenticatedRequest } from '../auth/jwt.ts';
import { buildComponentBundle } from '../storage/storage.ts';
import { ComponentFileDefinition, ComponentItem } from '../../packages/types/component.ts';

export const componentsRouter = Router();

// GET /api/components - List published components (or drafts for admins)
componentsRouter.get('/', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === 'admin';
  const includeDrafts = req.query.includeDrafts === 'true' && isAdmin;

  let query = 'SELECT id, name, slug, description, category, version, access_level, status, thumbnail, created_at, updated_at, published_at FROM components';
  const params: (string | number)[] = [];

  if (!includeDrafts) {
    query += ' WHERE status = ?';
    params.push('published');
  }

  query += ' ORDER BY created_at DESC';

  const rows = db.prepare(query).all(...params) as Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    version: string;
    access_level: 'free' | 'premium';
    status: 'draft' | 'published' | 'archived';
    thumbnail: string | null;
    created_at: string;
    updated_at: string;
    published_at: string | null;
  }>;

  const components = rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    category: r.category,
    version: r.version,
    accessLevel: r.access_level,
    status: r.status,
    thumbnail: r.thumbnail,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    publishedAt: r.published_at,
  }));

  return res.json({ components });
});

// GET /api/components/:slug - Get component details
componentsRouter.get('/:slug', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const { slug } = req.params;
  const isAdmin = req.user?.role === 'admin';

  const comp = db.prepare('SELECT * FROM components WHERE slug = ?').get(slug) as any;

  if (!comp) {
    return res.status(404).json({ error: 'Component not found' });
  }

  // Unpublished components can only be viewed by admin
  if (comp.status !== 'published' && !isAdmin) {
    return res.status(404).json({ error: 'This component has been unpublished or is in draft mode.' });
  }

  const component: ComponentItem = {
    id: comp.id,
    name: comp.name,
    slug: comp.slug,
    description: comp.description,
    category: comp.category,
    version: comp.version,
    accessLevel: comp.access_level,
    status: comp.status,
    propsSchema: JSON.parse(comp.props_schema || '[]'),
    usageDocumentation: comp.usage_documentation,
    dependencies: JSON.parse(comp.dependencies || '[]'),
    previewData: JSON.parse(comp.preview_data || '{}'),
    thumbnail: comp.thumbnail,
    createdAt: comp.created_at,
    updatedAt: comp.updated_at,
    publishedAt: comp.published_at,
  };

  return res.json({ component });
});

// GET /api/components/:slug/preview - Preview configuration & security check
componentsRouter.get('/:slug/preview', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const { slug } = req.params;
  const isAdmin = req.user?.role === 'admin';

  const comp = db.prepare('SELECT id, name, slug, access_level, status, preview_data, props_schema FROM components WHERE slug = ?').get(slug) as any;

  if (!comp) {
    return res.status(404).json({ error: 'Component not found' });
  }

  if (comp.status !== 'published' && !isAdmin) {
    return res.status(404).json({ error: 'This component has been unpublished.' });
  }

  const isPremium = comp.access_level === 'premium';
  const hasPremiumAccess = req.user?.isPremium === true;

  // If premium component and user lacks premium access, return locked configuration
  if (isPremium && !hasPremiumAccess) {
    return res.status(200).json({
      locked: true,
      reason: req.user ? 'premium_account_required' : 'sign_in_required',
      accessLevel: 'premium',
      message: 'This component requires an active Tech Inject Premium membership.',
      previewData: null,
    });
  }

  return res.json({
    locked: false,
    accessLevel: comp.access_level,
    previewData: JSON.parse(comp.preview_data || '{}'),
    propsSchema: JSON.parse(comp.props_schema || '[]'),
  });
});

// GET /api/components/:slug/source - Source code with strict server-side protection
componentsRouter.get('/:slug/source', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const { slug } = req.params;
  const isAdmin = req.user?.role === 'admin';

  const comp = db.prepare('SELECT id, name, slug, access_level, status, dependencies FROM components WHERE slug = ?').get(slug) as any;

  if (!comp) {
    return res.status(404).json({ error: 'Component not found' });
  }

  if (comp.status !== 'published' && !isAdmin) {
    return res.status(404).json({ error: 'This component has been unpublished.' });
  }

  // CRITICAL SECURITY ENFORCEMENT:
  // If premium component, the request MUST be authenticated and user MUST have is_premium === 1.
  if (comp.access_level === 'premium') {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required. Please sign in with a premium account to access source code.',
      });
    }

    if (!req.user.isPremium) {
      return res.status(403).json({
        error: 'Premium access required. Your account is on the Free tier. Upgrade to Tech Inject Pro to view and copy source code.',
      });
    }
  }

  // Fetch actual component files from storage
  const fileRows = db.prepare('SELECT path, content, is_main, file_type FROM component_files WHERE component_id = ?').all(comp.id) as Array<{
    path: string;
    content: string;
    is_main: number;
    file_type: 'tsx' | 'ts' | 'css' | 'json';
  }>;

  const files: ComponentFileDefinition[] = fileRows.map((f) => ({
    path: f.path,
    content: f.content,
    isMain: Boolean(f.is_main),
    fileType: f.file_type,
  }));

  const mainFile = files.find((f) => f.isMain) || files[0];

  return res.json({
    name: comp.name,
    slug: comp.slug,
    accessLevel: comp.access_level,
    dependencies: JSON.parse(comp.dependencies || '[]'),
    mainFile,
    files,
  });
});

// GET /api/components/:slug/install - Installation bundle endpoint
componentsRouter.get('/:slug/install', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const { slug } = req.params;
  const isAdmin = req.user?.role === 'admin';

  const comp = db.prepare('SELECT * FROM components WHERE slug = ?').get(slug) as any;

  if (!comp) {
    return res.status(404).json({ error: 'Component not found' });
  }

  if (comp.status !== 'published' && !isAdmin) {
    return res.status(404).json({ error: 'This component has been unpublished.' });
  }

  // Authorization for premium installation
  if (comp.access_level === 'premium') {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required. Premium components require a valid authorization token.',
        requiresPremium: true,
      });
    }

    if (!req.user.isPremium) {
      return res.status(403).json({
        error: 'Premium access required. Please verify your subscription status.',
        requiresPremium: true,
      });
    }
  }

  const fileRows = db.prepare('SELECT path, content, is_main, file_type FROM component_files WHERE component_id = ?').all(comp.id) as Array<{
    path: string;
    content: string;
    is_main: number;
    file_type: 'tsx' | 'ts' | 'css' | 'json';
  }>;

  const files: ComponentFileDefinition[] = fileRows.map((f) => ({
    path: f.path,
    content: f.content,
    isMain: Boolean(f.is_main),
    fileType: f.file_type,
  }));

  const componentItem: ComponentItem = {
    id: comp.id,
    name: comp.name,
    slug: comp.slug,
    description: comp.description,
    category: comp.category,
    version: comp.version,
    accessLevel: comp.access_level,
    status: comp.status,
    propsSchema: JSON.parse(comp.props_schema || '[]'),
    usageDocumentation: comp.usage_documentation,
    dependencies: JSON.parse(comp.dependencies || '[]'),
    previewData: JSON.parse(comp.preview_data || '{}'),
    thumbnail: comp.thumbnail,
    createdAt: comp.created_at,
    updatedAt: comp.updated_at,
    publishedAt: comp.published_at,
    files,
  };

  const bundle = buildComponentBundle(componentItem, files);

  return res.json({
    success: true,
    bundle,
  });
});

// GET /api/components/:slug/ai-prompt - Generate AI Agent integration prompt
componentsRouter.get('/:slug/ai-prompt', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const { slug } = req.params;
  const isAdmin = req.user?.role === 'admin';

  const comp = db.prepare('SELECT * FROM components WHERE slug = ?').get(slug) as any;

  if (!comp) {
    return res.status(404).json({ error: 'Component not found' });
  }

  if (comp.status !== 'published' && !isAdmin) {
    return res.status(404).json({ error: 'This component has been unpublished.' });
  }

  // Premium prompt protection
  if (comp.access_level === 'premium') {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required to view AI Agent prompts for premium components.',
      });
    }

    if (!req.user.isPremium) {
      return res.status(403).json({
        error: 'Premium access required to view AI Agent prompts for premium components.',
      });
    }
  }

  const props: Array<{ name: string; type: string; required: boolean; defaultValue?: string; description: string }> =
    JSON.parse(comp.props_schema || '[]');
  const deps: string[] = JSON.parse(comp.dependencies || '[]');

  const propsList = props
    .map((p) => `- \`${p.name}\` (${p.type}${p.required ? ', required' : ''}): ${p.description}`)
    .join('\n');

  const promptText = `You are integrating the Tech Inject ${comp.name} component (version ${comp.version}) into an existing React + TypeScript project.

Context & Principles:
- Tech Inject provides production-ready components engineered for B2B applications with strict token hierarchy.
- Preserve existing project theme tokens and do not modify unrelated files.

1. Dependencies to verify or install:
${deps.length > 0 ? deps.map((d) => `   - ${d}`).join('\n') : '   - No additional peer dependencies required.'}

2. Component File Placement:
   Install into \`src/components/ui/${comp.name}.tsx\` using the Tech Inject design tokens.

3. Component API & Props:
${propsList || '   - Standard HTML element attributes and children.'}

4. Usage Example:
${comp.usage_documentation}

5. Post-Integration Verification Checklist:
   [1] Verify TypeScript compilation (\`tsc --noEmit\`) passes without errors.
   [2] Verify imports resolve cleanly from local component paths.
   [3] Verify proper Tailwind CSS styling and theme token inheritance.
   [4] Render the component inside the target view and verify interactions.
   [5] Report any missing dependencies or type mismatches.`;

  return res.json({
    componentName: comp.name,
    version: comp.version,
    accessLevel: comp.access_level,
    prompt: promptText,
  });
});
