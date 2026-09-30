import { ComponentManifest, ComponentFileDefinition } from './component.ts';

export interface ComponentBundle {
  manifest: ComponentManifest;
  files: ComponentFileDefinition[];
  themeTokens: {
    path: string;
    content: string;
  };
  dependencies: string[];
}

export interface CliInstallResponse {
  success: boolean;
  message: string;
  bundle?: ComponentBundle;
  error?: string;
  requiresPremium?: boolean;
}
