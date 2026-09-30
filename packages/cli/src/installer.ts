import fs from 'node:fs';
import path from 'node:path';

export interface CliOptions {
  component: string;
  targetDir?: string;
  token?: string;
  apiUrl?: string;
  overwrite?: boolean;
}

export interface InstallResult {
  success: boolean;
  message: string;
  installedFiles: string[];
  error?: string;
}

export async function runInstaller(options: CliOptions): Promise<InstallResult> {
  const {
    component,
    targetDir = './src/components/ui',
    token,
    apiUrl = process.env.API_URL || 'http://localhost:3000',
    overwrite = false,
  } = options;

  // 1. Validate component slug format
  if (!/^[a-z0-9-]+$/.test(component)) {
    return {
      success: false,
      message: 'Invalid component name format. Must contain only lowercase letters, numbers, and hyphens.',
      installedFiles: [],
      error: 'INVALID_COMPONENT_NAME',
    };
  }

  // 2. Prevent path traversal in targetDir
  const normalizedTarget = path.normalize(targetDir);
  if (normalizedTarget.startsWith('..') || path.isAbsolute(normalizedTarget)) {
    return {
      success: false,
      message: `Security rejection: Unsafe target directory "${targetDir}". Installation must be relative to current project root and cannot traverse outside.`,
      installedFiles: [],
      error: 'UNSAFE_TARGET_DIRECTORY',
    };
  }

  // 3. Fetch component installation bundle from server
  const endpoint = `${apiUrl}/api/cli/install/${component}${token ? `?token=${encodeURIComponent(token)}` : ''}`;

  let data: any;
  try {
    const res = await fetch(endpoint, {
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    data = await res.json();

    if (!res.ok || !data.success) {
      return {
        success: false,
        message: data.error || `Failed to fetch component "${component}" (Status ${res.status}).`,
        installedFiles: [],
        error: data.requiresPremium ? 'PREMIUM_REQUIRED' : 'FETCH_ERROR',
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Network error connecting to Tech Inject registry at ${apiUrl}: ${err.message}`,
      installedFiles: [],
      error: 'NETWORK_ERROR',
    };
  }

  const { bundle } = data;
  if (!bundle || !bundle.files || bundle.files.length === 0) {
    return {
      success: false,
      message: `Component "${component}" bundle contained no installable files.`,
      installedFiles: [],
      error: 'EMPTY_BUNDLE',
    };
  }

  // 4. Ensure destination directories exist
  const destinationDir = path.resolve(process.cwd(), normalizedTarget);
  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
  }

  const installedFiles: string[] = [];

  // 5. Install Component Files with Overwrite Protection
  for (const file of bundle.files) {
    // Check path traversal inside bundled file
    if (file.path.includes('..') || path.isAbsolute(file.path)) {
      return {
        success: false,
        message: `Security rejection: Component bundle contained unsafe file path "${file.path}".`,
        installedFiles,
        error: 'UNSAFE_BUNDLE_PATH',
      };
    }

    const targetFilePath = path.join(destinationDir, path.basename(file.path));

    // Overwrite check
    if (fs.existsSync(targetFilePath) && !overwrite) {
      return {
        success: false,
        message: `File already exists: "${targetFilePath}". Use --overwrite flag to replace existing files. No files were modified.`,
        installedFiles: [],
        error: 'FILE_EXISTS',
      };
    }
  }

  // If checks passed, safely write files
  for (const file of bundle.files) {
    const targetFilePath = path.join(destinationDir, path.basename(file.path));
    fs.writeFileSync(targetFilePath, file.content, 'utf-8');
    installedFiles.push(targetFilePath);
  }

  // 6. Install Theme Tokens if not present
  if (bundle.themeTokens && bundle.themeTokens.content) {
    const themeDir = path.resolve(destinationDir, '../theme');
    if (!fs.existsSync(themeDir)) {
      fs.mkdirSync(themeDir, { recursive: true });
    }
    const themeFilePath = path.join(themeDir, 'tokens.ts');
    if (!fs.existsSync(themeFilePath) || overwrite) {
      fs.writeFileSync(themeFilePath, bundle.themeTokens.content, 'utf-8');
      installedFiles.push(themeFilePath);
    }
  }

  return {
    success: true,
    message: `✔ Successfully installed "${bundle.manifest.name}" v${bundle.manifest.version} into ${normalizedTarget}`,
    installedFiles,
  };
}
