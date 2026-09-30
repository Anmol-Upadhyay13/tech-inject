import { Router, Response } from 'express';
import { db } from '../db/database.ts';
import { extractToken, verifyToken, AuthenticatedRequest } from '../auth/jwt.ts';
import { buildComponentBundle } from '../storage/storage.ts';
import { ComponentFileDefinition, ComponentItem } from '../../packages/types/component.ts';

export const cliRouter = Router();

// GET /api/cli/install/:slug - CLI Installation Endpoint
cliRouter.get('/install/:slug', (req: AuthenticatedRequest, res: Response) => {
  const { slug } = req.params;

  // Validate slug format
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid component slug format.',
    });
  }

  const comp = db.prepare('SELECT * FROM components WHERE slug = ?').get(slug) as any;

  if (!comp) {
    return res.status(404).json({
      success: false,
      error: `Component "${slug}" not found in Tech Inject library.`,
    });
  }

  if (comp.status !== 'published') {
    return res.status(404).json({
      success: false,
      error: `Component "${slug}" is not published or has been removed.`,
    });
  }

  // Premium Access Authorization
  if (comp.access_level === 'premium') {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        requiresPremium: true,
        error: `Component "${comp.name}" is a Tech Inject Premium component. Please provide an active access token with: npx @tech-inject/cli add ${slug} --token <your_token>`,
      });
    }

    const user = verifyToken(token);
    if (!user) {
      return res.status(401).json({
        success: false,
        requiresPremium: true,
        error: 'Invalid or expired access token. Please log in to get a fresh token.',
      });
    }

    if (!user.isPremium) {
      return res.status(403).json({
        success: false,
        requiresPremium: true,
        error: `Access Denied: Account (${user.email}) does not have an active Tech Inject Premium membership.`,
      });
    }
  }

  // Fetch component files
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
    message: `Bundle ready for ${comp.name} v${comp.version}`,
    bundle,
  });
});
