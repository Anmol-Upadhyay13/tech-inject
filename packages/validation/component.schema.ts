import { z } from 'zod';

const SAFE_PATH_REGEX = /^[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\.(tsx|ts|css|json)$/;
const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export const componentPropSchema = z.object({
  name: z.string().min(1, 'Prop name is required'),
  type: z.string().min(1, 'Prop type is required'),
  required: z.boolean().default(false),
  defaultValue: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
});

export const componentFileSchema = z.object({
  path: z.string().refine((p) => {
    if (p.includes('..') || p.startsWith('/') || p.startsWith('\\')) return false;
    return SAFE_PATH_REGEX.test(p);
  }, {
    message: 'Invalid or unsafe file path. Only relative tsx, ts, css, json files allowed without directory traversal.',
  }),
  content: z.string().min(1, 'File content cannot be empty').max(500000, 'File exceeds maximum 500KB limit'),
  isMain: z.boolean().optional().default(false),
  fileType: z.enum(['tsx', 'ts', 'css', 'json']),
});

export const previewVariantSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  props: z.record(z.string(), z.unknown()).default({}),
  description: z.string().optional(),
});

export const componentPreviewConfigSchema = z.object({
  defaultVariant: z.string().optional(),
  variants: z.array(previewVariantSchema).min(1, 'At least one preview variant is required'),
  supportsSizes: z.boolean().optional().default(false),
  supportsStates: z.boolean().optional().default(false),
  containerBg: z.enum(['default', 'card', 'dark', 'grid']).optional().default('default'),
  showCodeByDefault: z.boolean().optional().default(false),
});

export const createComponentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  slug: z.string().regex(SLUG_REGEX, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  category: z.enum(['Actions', 'Forms', 'Feedback', 'Data Display', 'Navigation', 'Layout', 'Overlay']),
  version: z.string().regex(SEMVER_REGEX, 'Version must follow SemVer format (e.g., 1.0.0)'),
  accessLevel: z.enum(['free', 'premium']),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  propsSchema: z.array(componentPropSchema).default([]),
  usageDocumentation: z.string().min(10, 'Usage documentation is required'),
  dependencies: z.array(z.string()).default([]),
  previewData: componentPreviewConfigSchema,
  files: z.array(componentFileSchema).min(1, 'At least one source file is required').max(10, 'Maximum 10 files per component bundle'),
});

export const updateComponentSchema = createComponentSchema.partial();
