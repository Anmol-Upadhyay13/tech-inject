import path from 'node:path';
import fs from 'node:fs';
import { ComponentFileDefinition, ComponentBundle, ComponentItem } from '../../packages/types/index.ts';

const SAFE_EXTENSIONS = ['.tsx', '.ts', '.css', '.json'];

export function validateSafeFilePath(filePath: string): boolean {
  // Reject POSIX and Windows absolute paths
  if (path.isAbsolute(filePath) || /^[a-zA-Z]:[/\\]/.test(filePath) || filePath.startsWith('\\') || filePath.startsWith('/')) {
    return false;
  }
  // Reject path traversal
  if (filePath.includes('..') || filePath.includes('\0')) return false;

  const ext = path.extname(filePath).toLowerCase();
  if (!SAFE_EXTENSIONS.includes(ext)) return false;

  // Reject dangerous file names or shell scripts
  const base = path.basename(filePath).toLowerCase();
  if (base.endsWith('.sh') || base.endsWith('.bash') || base.endsWith('.exe') || base.endsWith('.bin')) {
    return false;
  }

  return true;
}

export function readThemeTokensBundle(): { path: string; content: string } {
  const tokenFile = path.resolve(process.cwd(), 'packages/theme/tokens/index.ts');
  let content = '';
  if (fs.existsSync(tokenFile)) {
    content = fs.readFileSync(tokenFile, 'utf-8');
  } else {
    content = '// Tech Inject Theme Tokens\nexport const tokens = {};';
  }

  return {
    path: 'theme/tokens.ts',
    content,
  };
}

export function buildComponentBundle(component: ComponentItem, files: ComponentFileDefinition[]): ComponentBundle {
  const themeTokens = readThemeTokensBundle();

  return {
    manifest: {
      name: component.name,
      slug: component.slug,
      version: component.version,
      description: component.description,
      category: component.category,
      access: component.accessLevel,
      dependencies: component.dependencies,
      files: files.map((f) => f.path),
      themeTokensRequired: ['colors', 'typography', 'radii', 'shadows'],
    },
    files,
    themeTokens,
    dependencies: component.dependencies,
  };
}
