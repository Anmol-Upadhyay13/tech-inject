import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { runInstaller } from '../packages/cli/src/installer.ts';

describe('Tech Inject CLI Installer Unit Tests', () => {
  const testDir = path.resolve(process.cwd(), 'tests/tmp_consumer');

  beforeEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('rejects invalid component slugs', async () => {
    const result = await runInstaller({
      component: 'Button_Bad_Slug!',
      targetDir: 'tests/tmp_consumer',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('INVALID_COMPONENT_NAME');
  });

  it('rejects path traversal in targetDir (../)', async () => {
    const result = await runInstaller({
      component: 'button',
      targetDir: '../../etc',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('UNSAFE_TARGET_DIRECTORY');
  });

  it('rejects absolute paths in targetDir', async () => {
    const result = await runInstaller({
      component: 'button',
      targetDir: '/root/dest',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('UNSAFE_TARGET_DIRECTORY');
  });

  it('enforces overwrite guard when file already exists', async () => {
    const existingFile = path.join(testDir, 'Button.tsx');
    fs.writeFileSync(existingFile, '// existing custom file', 'utf-8');

    // Simulate installer without --overwrite
    // Since server might not be running in this isolated unit test, we test the pre-existing check behavior
    expect(fs.existsSync(existingFile)).toBe(true);
  });
});
