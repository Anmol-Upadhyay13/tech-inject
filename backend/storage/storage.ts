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
  const content = `// Tech Inject Canonical Theme Tokens
export const tokens = {
  colors: {
    brand: {
      50: '#EEF2FF',
      100: '#E0E7FF',
      500: '#6366F1',
      600: '#4F46E5', // Primary brand action
      700: '#4338CA',
      900: '#312E81',
    },
    slate: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
    white: '#FFFFFF',
    black: '#000000',
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
    md: '6px',
    lg: '8px',
    full: '9999px',
  },
  focus: {
    ring: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/30',
  },
} as const;

export type ThemeTokens = typeof tokens;
`;

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
