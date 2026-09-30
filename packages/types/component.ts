export type AccessLevel = 'free' | 'premium';
export type ComponentStatus = 'draft' | 'published' | 'archived';

export type ComponentCategory =
  | 'Actions'
  | 'Forms'
  | 'Feedback'
  | 'Data Display'
  | 'Navigation'
  | 'Layout'
  | 'Overlay';

export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description: string;
}

export interface ComponentFileDefinition {
  path: string;
  content: string;
  isMain?: boolean;
  fileType: 'tsx' | 'ts' | 'css' | 'json';
}

export interface ComponentPreviewVariant {
  name: string;
  label: string;
  props: Record<string, unknown>;
  description?: string;
}

export interface ComponentPreviewConfig {
  defaultVariant?: string;
  variants: ComponentPreviewVariant[];
  supportsSizes?: boolean;
  supportsStates?: boolean;
  containerBg?: 'default' | 'card' | 'dark' | 'grid';
  showCodeByDefault?: boolean;
}

export interface ComponentItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ComponentCategory;
  version: string;
  accessLevel: AccessLevel;
  status: ComponentStatus;
  propsSchema: ComponentProp[];
  usageDocumentation: string;
  dependencies: string[];
  previewData: ComponentPreviewConfig;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  files?: ComponentFileDefinition[];
}

export interface ComponentManifest {
  name: string;
  slug: string;
  version: string;
  description: string;
  category: ComponentCategory;
  access: AccessLevel;
  dependencies: string[];
  peerDependencies?: Record<string, string>;
  files: string[];
  themeTokensRequired?: string[];
}
