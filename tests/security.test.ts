import { describe, it, expect, beforeAll } from 'vitest';
import { initDatabase, db } from '../backend/db/database.ts';
import { generateToken } from '../backend/auth/jwt.ts';
import { validateSafeFilePath } from '../backend/storage/storage.ts';

describe('Tech Inject Security & Access Control Suite', () => {
  let adminToken: string;
  let freeToken: string;
  let proToken: string;

  beforeAll(() => {
    initDatabase();

    adminToken = generateToken({
      id: 'u_admin_01',
      email: 'admin@techinject.dev',
      name: 'Tech Inject Admin',
      role: 'admin',
      isPremium: false,
    });

    freeToken = generateToken({
      id: 'u_free_01',
      email: 'developer@techinject.dev',
      name: 'Alex Rivera (Developer)',
      role: 'customer',
      isPremium: false,
    });

    proToken = generateToken({
      id: 'u_premium_01',
      email: 'pro@techinject.dev',
      name: 'Sarah Chen (Pro Member)',
      role: 'customer',
      isPremium: true,
    });
  });

  describe('1. Unsafe File Path & Path Traversal Guards', () => {
    it('rejects directory traversal in uploads (../)', () => {
      expect(validateSafeFilePath('../../../etc/passwd.tsx')).toBe(false);
      expect(validateSafeFilePath('components/../../Button.tsx')).toBe(false);
    });

    it('rejects absolute paths', () => {
      expect(validateSafeFilePath('/root/Button.tsx')).toBe(false);
      expect(validateSafeFilePath('C:\\Windows\\System32\\calc.tsx')).toBe(false);
    });

    it('rejects executable shell scripts and dangerous extensions', () => {
      expect(validateSafeFilePath('exploit.sh')).toBe(false);
      expect(validateSafeFilePath('runner.bash')).toBe(false);
      expect(validateSafeFilePath('binary.exe')).toBe(false);
    });

    it('allows valid relative tsx, ts, css, json files', () => {
      expect(validateSafeFilePath('Button.tsx')).toBe(true);
      expect(validateSafeFilePath('components/Input.tsx')).toBe(true);
      expect(validateSafeFilePath('theme/tokens.ts')).toBe(true);
      expect(validateSafeFilePath('styles/base.css')).toBe(true);
    });
  });

  describe('2. Component Database Access Controls', () => {
    it('verifies that premium component source requires is_premium = 1', () => {
      const tableComp = db.prepare("SELECT * FROM components WHERE slug = 'table'").get() as any;
      expect(tableComp).toBeDefined();
      expect(tableComp.access_level).toBe('premium');

      // Verify free customer has is_premium = 0
      const freeUser = db.prepare("SELECT is_premium FROM users WHERE email = 'developer@techinject.dev'").get() as any;
      expect(freeUser.is_premium).toBe(0);

      // Verify pro customer has is_premium = 1
      const proUser = db.prepare("SELECT is_premium FROM users WHERE email = 'pro@techinject.dev'").get() as any;
      expect(proUser.is_premium).toBe(1);
    });

    it('verifies that revoking premium immediately updates database state', () => {
      // Temporarily grant developer premium
      db.prepare("UPDATE users SET is_premium = 1 WHERE email = 'developer@techinject.dev'").run();
      let user = db.prepare("SELECT is_premium FROM users WHERE email = 'developer@techinject.dev'").get() as any;
      expect(user.is_premium).toBe(1);

      // Revoke premium
      db.prepare("UPDATE users SET is_premium = 0 WHERE email = 'developer@techinject.dev'").run();
      user = db.prepare("SELECT is_premium FROM users WHERE email = 'developer@techinject.dev'").get() as any;
      expect(user.is_premium).toBe(0);
    });

    it('verifies that unpublishing a component marks status as draft', () => {
      // Find Button component
      const button = db.prepare("SELECT id, status FROM components WHERE slug = 'button'").get() as any;
      expect(button.status).toBe('published');

      // Unpublish
      db.prepare("UPDATE components SET status = 'draft' WHERE id = ?").run(button.id);
      let updated = db.prepare("SELECT status FROM components WHERE id = ?").get(button.id) as any;
      expect(updated.status).toBe('draft');

      // Restore to published
      db.prepare("UPDATE components SET status = 'published' WHERE id = ?").run(button.id);
      updated = db.prepare("SELECT status FROM components WHERE id = ?").get(button.id) as any;
      expect(updated.status).toBe('published');
    });

    it('verifies published metadata and source consistency', () => {
      const comp = db.prepare("SELECT id, name, slug FROM components WHERE slug = 'button'").get() as any;
      const files = db.prepare('SELECT path, content FROM component_files WHERE component_id = ?').all(comp.id) as any[];

      expect(files.length).toBeGreaterThan(0);
      expect(files[0].path).toBe('Button.tsx');
      expect(files[0].content).toContain('export const Button');
    });
  });
});
