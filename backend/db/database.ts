import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

// Ensure data directory exists
const dbDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'tech_inject.db');
export const db = new DatabaseSync(dbPath);

// Enable WAL mode and foreign keys for high reliability and ACID compliance
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase() {
  // 1. Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer',
      is_premium INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      last_login_at TEXT
    );
  `);

  // 2. Components table
  db.exec(`
    CREATE TABLE IF NOT EXISTS components (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      version TEXT NOT NULL DEFAULT '1.0.0',
      access_level TEXT NOT NULL DEFAULT 'free',
      status TEXT NOT NULL DEFAULT 'draft',
      props_schema TEXT NOT NULL,
      usage_documentation TEXT NOT NULL,
      dependencies TEXT NOT NULL,
      preview_data TEXT NOT NULL,
      thumbnail TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      published_at TEXT
    );
  `);

  // 3. Component Files table
  db.exec(`
    CREATE TABLE IF NOT EXISTS component_files (
      id TEXT PRIMARY KEY,
      component_id TEXT NOT NULL,
      path TEXT NOT NULL,
      content TEXT NOT NULL,
      is_main INTEGER NOT NULL DEFAULT 0,
      file_type TEXT NOT NULL DEFAULT 'tsx',
      created_at TEXT NOT NULL,
      FOREIGN KEY (component_id) REFERENCES components(id) ON DELETE CASCADE
    );
  `);

  // 4. Premium Access History table
  db.exec(`
    CREATE TABLE IF NOT EXISTS premium_access (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      granted_by TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      granted_at TEXT NOT NULL,
      revoked_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (granted_by) REFERENCES users(id)
    );
  `);

  // 5. Audit Log table
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      resource TEXT NOT NULL,
      details TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  seedInitialData();
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_tech_inject_salt_2026').digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

function seedInitialData() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  const now = new Date().toISOString();

  if (userCount.count === 0) {
    console.log('[Database] Seeding initial test accounts...');

    // 1. Admin Account
    const adminId = 'u_admin_01';
    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, role, is_premium, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      adminId,
      'admin@techinject.dev',
      hashPassword('AdminPass123!'),
      'Tech Inject Admin',
      'admin',
      0, // Admin does NOT automatically get premium customer permissions per Section 13
      now
    );

    // 2. Premium Customer Account
    const premiumId = 'u_premium_01';
    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, role, is_premium, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      premiumId,
      'pro@techinject.dev',
      hashPassword('ProPass123!'),
      'Sarah Chen (Pro Member)',
      'customer',
      1,
      now
    );

    // Record initial premium grant
    db.prepare(`
      INSERT INTO premium_access (id, user_id, granted_by, status, granted_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      'pa_01',
      premiumId,
      adminId,
      'active',
      now
    );

    // 3. Free Customer Account
    const freeId = 'u_free_01';
    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, role, is_premium, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      freeId,
      'developer@techinject.dev',
      hashPassword('FreePass123!'),
      'Alex Rivera (Developer)',
      'customer',
      0,
      now
    );

    console.log('[Database] Initial users seeded successfully.');
  }

  // Seed Components if empty
  const componentCount = db.prepare('SELECT COUNT(*) as count FROM components').get() as { count: number };
  if (componentCount.count === 0) {
    console.log('[Database] Seeding initial design system components...');
    seedComponents(now);
  }
}

function seedComponents(now: string) {
  // Let's seed 7 Free components and 4 Premium components (well exceeding the minimum 5 free + 3 premium)
  const components = [
    {
      id: 'c_button',
      name: 'Button',
      slug: 'button',
      description: 'Primary, secondary, outline, and destructive action controls with hover transitions, focus rings, loading spinner, and icon support.',
      category: 'Actions',
      version: '1.2.0',
      access_level: 'free',
      status: 'published',
      published_at: now,
      props_schema: JSON.stringify([
        { name: 'variant', type: '"primary" | "secondary" | "outline" | "ghost" | "destructive" | "subtle"', required: false, defaultValue: '"primary"', description: 'Visual hierarchy style' },
        { name: 'size', type: '"sm" | "md" | "lg"', required: false, defaultValue: '"md"', description: 'Height and padding density token' },
        { name: 'isLoading', type: 'boolean', required: false, defaultValue: 'false', description: 'Displays an animated spinner and disables clicks' },
        { name: 'leftIcon', type: 'React.ReactNode', required: false, description: 'Icon rendered before button label' },
        { name: 'rightIcon', type: 'React.ReactNode', required: false, description: 'Icon rendered after button label' },
        { name: 'disabled', type: 'boolean', required: false, defaultValue: 'false', description: 'Prevents user interaction' },
      ]),
      usage_documentation: `### Installation\n\n\`\`\`bash\nnpx @tech-inject/cli add button\n\`\`\`\n\n### Usage\n\n\`\`\`tsx\nimport { Button } from '@/components/ui/Button';\nimport { ArrowRight } from 'lucide-react';\n\nexport default function Example() {\n  return (\n    <div className="flex items-center gap-3">\n      <Button variant="primary">Save Changes</Button>\n      <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>\n        Continue\n      </Button>\n      <Button variant="destructive">Delete Item</Button>\n    </div>\n  );\n}\n\`\`\``,
      dependencies: JSON.stringify(['lucide-react@^0.546.0']),
      preview_data: JSON.stringify({
        defaultVariant: 'primary',
        variants: [
          { name: 'primary', label: 'Primary Action', props: { variant: 'primary', children: 'Save Changes' } },
          { name: 'secondary', label: 'Secondary / Neutral', props: { variant: 'secondary', children: 'Cancel' } },
          { name: 'outline', label: 'Outline', props: { variant: 'outline', children: 'Export CSV' } },
          { name: 'ghost', label: 'Ghost', props: { variant: 'ghost', children: 'Settings' } },
          { name: 'destructive', label: 'Destructive', props: { variant: 'destructive', children: 'Delete Deal' } },
          { name: 'subtle', label: 'Subtle Brand', props: { variant: 'subtle', children: 'View Details' } },
        ],
        supportsSizes: true,
        supportsStates: true,
      }),
      files: [
        {
          path: 'Button.tsx',
          is_main: 1,
          file_type: 'tsx',
          content: fs.readFileSync(path.resolve(process.cwd(), 'packages/ui/Button.tsx'), 'utf-8'),
        },
      ],
    },
    {
      id: 'c_input',
      name: 'Input',
      slug: 'input',
      description: 'Accessible form text input with leading/trailing icons, error state styling, and helper text integration.',
      category: 'Forms',
      version: '1.1.0',
      access_level: 'free',
      status: 'published',
      published_at: now,
      props_schema: JSON.stringify([
        { name: 'size', type: '"sm" | "md" | "lg"', required: false, defaultValue: '"md"', description: 'Height and font density' },
        { name: 'error', type: 'string | boolean', required: false, description: 'Shows error border and state' },
        { name: 'leftIcon', type: 'React.ReactNode', required: false, description: 'Decorative leading icon' },
        { name: 'placeholder', type: 'string', required: false, description: 'Muted placeholder string' },
        { name: 'disabled', type: 'boolean', required: false, defaultValue: 'false', description: 'Disables user entry' },
      ]),
      usage_documentation: `### Usage\n\n\`\`\`tsx\nimport { Input } from '@/components/ui/Input';\nimport { Mail } from 'lucide-react';\n\nexport default function Example() {\n  return (\n    <Input\n      placeholder="name@company.com"\n      leftIcon={<Mail className="w-4 h-4" />}\n    />\n  );\n}\n\`\`\``,
      dependencies: JSON.stringify(['lucide-react@^0.546.0']),
      preview_data: JSON.stringify({
        defaultVariant: 'default',
        variants: [
          { name: 'default', label: 'Standard Input', props: { placeholder: 'Enter company name...' } },
          { name: 'with-error', label: 'Error State', props: { placeholder: 'name@company.com', error: 'Please enter a valid work email' } },
          { name: 'disabled', label: 'Disabled State', props: { placeholder: 'Cannot edit lead owner', disabled: true } },
        ],
        supportsSizes: true,
        supportsStates: false,
      }),
      files: [
        {
          path: 'Input.tsx',
          is_main: 1,
          file_type: 'tsx',
          content: fs.readFileSync(path.resolve(process.cwd(), 'packages/ui/Input.tsx'), 'utf-8'),
        },
      ],
    },
    {
      id: 'c_card',
      name: 'Card',
      slug: 'card',
      description: 'Single-elevation content container with crisp hairline borders, header, title, description, content body, and footer.',
      category: 'Layout',
      version: '1.0.0',
      access_level: 'free',
      status: 'published',
      published_at: now,
      props_schema: JSON.stringify([
        { name: 'variant', type: '"default" | "flat" | "interactive"', required: false, defaultValue: '"default"', description: 'Border and hover elevation style' },
        { name: 'children', type: 'React.ReactNode', required: true, description: 'Card inner layout elements' },
      ]),
      usage_documentation: `### Usage\n\n\`\`\`tsx\nimport { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';\nimport { Button } from '@/components/ui/Button';\n\nexport default function DealCard() {\n  return (\n    <Card>\n      <CardHeader>\n        <CardTitle>Enterprise Tier Upgrade</CardTitle>\n        <CardDescription>Acme Corp · Deal value: $48,000</CardDescription>\n      </CardHeader>\n      <CardContent>\n        <p className="text-sm text-slate-600">Contract signed by Legal. Awaiting security approval.</p>\n      </CardContent>\n      <CardFooter>\n        <Button size="sm">Review Deal</Button>\n      </CardFooter>\n    </Card>\n  );\n}\n\`\`\``,
      dependencies: JSON.stringify([]),
      preview_data: JSON.stringify({
        defaultVariant: 'default',
        variants: [
          { name: 'default', label: 'Default Card', props: { variant: 'default' } },
          { name: 'interactive', label: 'Interactive Hover Card', props: { variant: 'interactive' } },
          { name: 'flat', label: 'Flat Surface Card', props: { variant: 'flat' } },
        ],
      }),
      files: [
        {
          path: 'Card.tsx',
          is_main: 1,
          file_type: 'tsx',
          content: fs.readFileSync(path.resolve(process.cwd(), 'packages/ui/Card.tsx'), 'utf-8'),
        },
      ],
    },
    {
      id: 'c_badge',
      name: 'Badge',
      slug: 'badge',
      description: 'Compact status tags and dot indicators adhering to zero-pill typographic discipline.',
      category: 'Feedback',
      version: '1.0.0',
      access_level: 'free',
      status: 'published',
      published_at: now,
      props_schema: JSON.stringify([
        { name: 'variant', type: '"neutral" | "brand" | "success" | "warning" | "error" | "premium"', required: false, defaultValue: '"neutral"', description: 'Semantic color tint' },
        { name: 'dot', type: 'boolean', required: false, defaultValue: 'false', description: 'Renders status indicator dot' },
        { name: 'size', type: '"sm" | "md"', required: false, defaultValue: '"sm"', description: 'Padding and font scale' },
      ]),
      usage_documentation: `### Usage\n\n\`\`\`tsx\nimport { Badge, StatusIndicator } from '@/components/ui/Badge';\n\nexport default function Example() {\n  return (\n    <div className="flex items-center gap-3">\n      <Badge variant="success" dot>Contract Active</Badge>\n      <Badge variant="warning">In Review</Badge>\n      <Badge variant="brand">Verified Lead</Badge>\n      <StatusIndicator status="published" label="Published" />\n    </div>\n  );\n}\n\`\`\``,
      dependencies: JSON.stringify([]),
      preview_data: JSON.stringify({
        defaultVariant: 'success',
        variants: [
          { name: 'success', label: 'Active / Success', props: { variant: 'success', dot: true, children: 'Contract Signed' } },
          { name: 'warning', label: 'Pending / Warning', props: { variant: 'warning', dot: true, children: 'Legal Review' } },
          { name: 'brand', label: 'Brand / Information', props: { variant: 'brand', children: 'Tier 1 Account' } },
          { name: 'premium', label: 'Premium Member', props: { variant: 'premium', children: 'Enterprise License' } },
          { name: 'error', label: 'Overdue / Danger', props: { variant: 'error', dot: true, children: 'Payment Overdue' } },
        ],
      }),
      files: [
        {
          path: 'Badge.tsx',
          is_main: 1,
          file_type: 'tsx',
          content: fs.readFileSync(path.resolve(process.cwd(), 'packages/ui/Badge.tsx'), 'utf-8'),
        },
      ],
    },
    {
      id: 'c_tabs',
      name: 'Tabs',
      slug: 'tabs',
      description: 'Segmented control switchers and underline tabs for switching context without page reloads.',
      category: 'Navigation',
      version: '1.0.0',
      access_level: 'free',
      status: 'published',
      published_at: now,
      props_schema: JSON.stringify([
        { name: 'items', type: 'TabItem[]', required: true, description: 'List of tab definitions (id, label, count)' },
        { name: 'activeId', type: 'string', required: true, description: 'Currently active tab ID' },
        { name: 'onChange', type: '(id: string) => void', required: true, description: 'Tab selection callback' },
        { name: 'variant', type: '"segmented" | "underline"', required: false, defaultValue: '"segmented"', description: 'Visual presentation style' },
      ]),
      usage_documentation: `### Usage\n\n\`\`\`tsx\nimport { Tabs } from '@/components/ui/Tabs';\nimport { useState } from 'react';\n\nexport default function Example() {\n  const [tab, setTab] = useState('pipeline');\n  return (\n    <Tabs\n      activeId={tab}\n      onChange={setTab}\n      items={[\n        { id: 'pipeline', label: 'Sales Pipeline', count: 18 },\n        { id: 'deals', label: 'Closed Won', count: 42 },\n        { id: 'archived', label: 'Archived' },\n      ]}\n    />\n  );\n}\n\`\`\``,
      dependencies: JSON.stringify([]),
      preview_data: JSON.stringify({
        defaultVariant: 'segmented',
        variants: [
          { name: 'segmented', label: 'Segmented Control', props: { variant: 'segmented' } },
          { name: 'underline', label: 'Line Tabs', props: { variant: 'underline' } },
        ],
      }),
      files: [
        {
          path: 'Tabs.tsx',
          is_main: 1,
          file_type: 'tsx',
          content: fs.readFileSync(path.resolve(process.cwd(), 'packages/ui/Tabs.tsx'), 'utf-8'),
        },
      ],
    },
    {
      id: 'c_alert',
      name: 'Alert',
      slug: 'alert',
      description: 'Callout notification banner communicating system states, confirmations, and warnings.',
      category: 'Feedback',
      version: '1.0.0',
      access_level: 'free',
      status: 'published',
      published_at: now,
      props_schema: JSON.stringify([
        { name: 'type', type: '"info" | "success" | "warning" | "error"', required: false, defaultValue: '"info"', description: 'Semantic status level' },
        { name: 'title', type: 'string', required: false, description: 'Bold alert heading' },
        { name: 'children', type: 'React.ReactNode', required: true, description: 'Alert message body' },
        { name: 'onClose', type: '() => void', required: false, description: 'Dismiss action handler' },
      ]),
      usage_documentation: `### Usage\n\n\`\`\`tsx\nimport { Alert } from '@/components/ui/Alert';\n\nexport default function Example() {\n  return (\n    <Alert type="success" title="Subscription Updated">\n      Your team workspace has been upgraded to Premium.\n    </Alert>\n  );\n}\n\`\`\``,
      dependencies: JSON.stringify(['lucide-react@^0.546.0']),
      preview_data: JSON.stringify({
        defaultVariant: 'success',
        variants: [
          { name: 'success', label: 'Success Alert', props: { type: 'success', title: 'Opportunity Stage Updated', children: 'Acme Corp transitioned to Stage 4 (Contract Review).' } },
          { name: 'info', label: 'Info Alert', props: { type: 'info', title: 'System Notice', children: 'API rate limits reset at 00:00 UTC.' } },
          { name: 'warning', label: 'Warning Alert', props: { type: 'warning', title: 'Trial Ending Soon', children: 'Your preview access expires in 48 hours.' } },
          { name: 'error', label: 'Error Alert', props: { type: 'error', title: 'Sync Failed', children: 'Salesforce CRM connection timed out. Retrying in 30s.' } },
        ],
      }),
      files: [
        {
          path: 'Alert.tsx',
          is_main: 1,
          file_type: 'tsx',
          content: fs.readFileSync(path.resolve(process.cwd(), 'packages/ui/Alert.tsx'), 'utf-8'),
        },
      ],
    },
    {
      id: 'c_breadcrumbs',
      name: 'Breadcrumbs',
      slug: 'breadcrumbs',
      description: 'Accessible navigational hierarchy trail with keyboard focus and chevron separators.',
      category: 'Navigation',
      version: '1.0.0',
      access_level: 'free',
      status: 'published',
      published_at: now,
      props_schema: JSON.stringify([
        { name: 'items', type: 'BreadcrumbItem[]', required: true, description: 'List of path steps ({ label, href, onClick })' },
      ]),
      usage_documentation: `### Usage\n\n\`\`\`tsx\nimport { Breadcrumbs } from '@/components/ui/Breadcrumbs';\n\nexport default function Example() {\n  return (\n    <Breadcrumbs\n      items={[\n        { label: 'Workspace', href: '#' },\n        { label: 'Accounts', href: '#' },\n        { label: 'Acme Corporation' },\n      ]}\n    />\n  );\n}\n\`\`\``,
      dependencies: JSON.stringify(['lucide-react@^0.546.0']),
      preview_data: JSON.stringify({
        defaultVariant: 'default',
        variants: [
          {
            name: 'default',
            label: 'CRM Trail',
            props: {
              items: [
                { label: 'Sales CRM' },
                { label: 'Enterprise Accounts' },
                { label: 'Acme Corporation Q3 Deal' },
              ],
            },
          },
        ],
      }),
      files: [
        {
          path: 'Breadcrumbs.tsx',
          is_main: 1,
          file_type: 'tsx',
          content: fs.readFileSync(path.resolve(process.cwd(), 'packages/ui/Breadcrumbs.tsx'), 'utf-8'),
        },
      ],
    },

    // ---------------------------------------------------------------------------------
    // PREMIUM COMPONENTS (LOCKED FOR UNAUTHORIZED / FREE USERS; ACCESSIBLE WITH PRO)
    // ---------------------------------------------------------------------------------
    {
      id: 'c_table',
      name: 'Table / Data Grid',
      slug: 'table',
      description: 'Enterprise data table with tabular numeric alignment, sortable columns, loading skeleton, and row selection.',
      category: 'Data Display',
      version: '2.0.0',
      access_level: 'premium',
      status: 'published',
      published_at: now,
      props_schema: JSON.stringify([
        { name: 'columns', type: 'Column<T>[]', required: true, description: 'Column definitions with key, header, align, render' },
        { name: 'data', type: 'T[]', required: true, description: 'Array of tabular records' },
        { name: 'keyField', type: 'string | ((row: T) => string)', required: true, description: 'Unique identifier key' },
        { name: 'isLoading', type: 'boolean', required: false, defaultValue: 'false', description: 'Shows animated loading skeleton' },
        { name: 'onRowClick', type: '(row: T) => void', required: false, description: 'Row click callback' },
      ]),
      usage_documentation: `### Premium Component Usage\n\n\`\`\`tsx\nimport { Table } from '@/components/ui/Table';\n\ninterface Deal {\n  id: string;\n  company: string;\n  stage: string;\n  amount: number;\n}\n\nconst columns = [\n  { key: 'company', header: 'Company' },\n  { key: 'stage', header: 'Sales Stage' },\n  {\n    key: 'amount',\n    header: 'Deal Value',\n    align: 'right' as const,\n    render: (deal: Deal) => (\n      <span className="font-mono font-medium">\n        \${deal.amount.toLocaleString()}\n      </span>\n    ),\n  },\n];\n\`\`\``,
      dependencies: JSON.stringify([]),
      preview_data: JSON.stringify({
        defaultVariant: 'populated',
        variants: [
          { name: 'populated', label: 'Deals Pipeline Grid', props: {} },
          { name: 'loading', label: 'Loading Skeleton', props: { isLoading: true } },
        ],
      }),
      files: [
        {
          path: 'Table.tsx',
          is_main: 1,
          file_type: 'tsx',
          content: fs.readFileSync(path.resolve(process.cwd(), 'packages/ui/Table.tsx'), 'utf-8'),
        },
      ],
    },
    {
      id: 'c_modal',
      name: 'Modal Dialog',
      slug: 'modal',
      description: 'Accessible overlay dialog with backdrop blur, keyboard Escape trapping, focus containment, and header/footer slots.',
      category: 'Overlay',
      version: '1.4.0',
      access_level: 'premium',
      status: 'published',
      published_at: now,
      props_schema: JSON.stringify([
        { name: 'isOpen', type: 'boolean', required: true, description: 'Controls modal visibility' },
        { name: 'onClose', type: '() => void', required: true, description: 'Triggered on backdrop click or Escape' },
        { name: 'title', type: 'string', required: true, description: 'Header dialog title' },
        { name: 'description', type: 'string', required: false, description: 'Subtext description' },
        { name: 'size', type: '"sm" | "md" | "lg" | "xl"', required: false, defaultValue: '"md"', description: 'Width constraint' },
        { name: 'footer', type: 'React.ReactNode', required: false, description: 'Actions footer container' },
      ]),
      usage_documentation: `### Usage\n\n\`\`\`tsx\nimport { Modal } from '@/components/ui/Modal';\nimport { Button } from '@/components/ui/Button';\nimport { useState } from 'react';\n\nexport default function Example() {\n  const [open, setOpen] = useState(false);\n  return (\n    <Modal\n      isOpen={open}\n      onClose={() => setOpen(false)}\n      title="Assign Deal to Sales Rep"\n      footer={<Button onClick={() => setOpen(false)}>Save Assignment</Button>}\n    >\n      <p className="text-sm text-slate-600">Select an account representative to manage this customer.</p>\n    </Modal>\n  );\n}\n\`\`\``,
      dependencies: JSON.stringify(['lucide-react@^0.546.0']),
      preview_data: JSON.stringify({
        defaultVariant: 'default',
        variants: [
          { name: 'default', label: 'Standard Confirmation', props: { title: 'Assign Lead' } },
        ],
      }),
      files: [
        {
          path: 'Modal.tsx',
          is_main: 1,
          file_type: 'tsx',
          content: fs.readFileSync(path.resolve(process.cwd(), 'packages/ui/Modal.tsx'), 'utf-8'),
        },
      ],
    },
    {
      id: 'c_drawer',
      name: 'Drawer / Slide-Over',
      slug: 'drawer',
      description: 'Right-anchored sliding sheet panel for inspecting lead details, editing properties, and previewing metadata.',
      category: 'Overlay',
      version: '1.1.0',
      access_level: 'premium',
      status: 'published',
      published_at: now,
      props_schema: JSON.stringify([
        { name: 'isOpen', type: 'boolean', required: true, description: 'Drawer visibility state' },
        { name: 'onClose', type: '() => void', required: true, description: 'Close trigger callback' },
        { name: 'title', type: 'string', required: true, description: 'Drawer headline' },
        { name: 'size', type: '"sm" | "md" | "lg"', required: false, defaultValue: '"md"', description: 'Width of sheet' },
      ]),
      usage_documentation: `### Usage\n\n\`\`\`tsx\nimport { Drawer } from '@/components/ui/Drawer';\n\nexport default function Example() {\n  return (\n    <Drawer isOpen={true} onClose={() => {}} title="Lead Details: Acme Corp">\n      <p className="text-sm">Detailed opportunity timeline and activity history.</p>\n    </Drawer>\n  );\n}\n\`\`\``,
      dependencies: JSON.stringify(['lucide-react@^0.546.0']),
      preview_data: JSON.stringify({
        defaultVariant: 'default',
        variants: [
          { name: 'default', label: 'Lead Inspection Drawer', props: { title: 'Customer Activity' } },
        ],
      }),
      files: [
        {
          path: 'Drawer.tsx',
          is_main: 1,
          file_type: 'tsx',
          content: fs.readFileSync(path.resolve(process.cwd(), 'packages/ui/Drawer.tsx'), 'utf-8'),
        },
      ],
    },
    {
      id: 'c_filter_control',
      name: 'Filter Control',
      slug: 'filter-control',
      description: 'Interactive filter trigger with active criteria counters, clear actions, and dropdown state synchronization.',
      category: 'Forms',
      version: '1.0.0',
      access_level: 'premium',
      status: 'published',
      published_at: now,
      props_schema: JSON.stringify([
        { name: 'label', type: 'string', required: true, description: 'Filter button name' },
        { name: 'activeCount', type: 'number', required: false, defaultValue: '0', description: 'Number of active criteria' },
        { name: 'onClick', type: '() => void', required: true, description: 'Trigger dropdown callback' },
        { name: 'onClear', type: '() => void', required: false, description: 'Reset filter criteria' },
      ]),
      usage_documentation: `### Usage\n\n\`\`\`tsx\nimport { FilterControl } from '@/components/ui/FilterControl';\n\nexport default function Example() {\n  return (\n    <FilterControl\n      label="Deal Stage"\n      activeCount={2}\n      onClick={() => {}}\n      onClear={() => {}}\n    />\n  );\n}\n\`\`\``,
      dependencies: JSON.stringify(['lucide-react@^0.546.0']),
      preview_data: JSON.stringify({
        defaultVariant: 'active',
        variants: [
          { name: 'active', label: 'Active Filters', props: { label: 'Sales Region', activeCount: 2 } },
          { name: 'inactive', label: 'Inactive Filter', props: { label: 'Owner', activeCount: 0 } },
        ],
      }),
      files: [
        {
          path: 'FilterControl.tsx',
          is_main: 1,
          file_type: 'tsx',
          content: fs.readFileSync(path.resolve(process.cwd(), 'packages/ui/FilterControl.tsx'), 'utf-8'),
        },
      ],
    },
  ];

  for (const comp of components) {
    db.prepare(`
      INSERT INTO components (
        id, name, slug, description, category, version, access_level, status,
        props_schema, usage_documentation, dependencies, preview_data, created_at, updated_at, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      comp.id,
      comp.name,
      comp.slug,
      comp.description,
      comp.category,
      comp.version,
      comp.access_level,
      comp.status,
      comp.props_schema,
      comp.usage_documentation,
      comp.dependencies,
      comp.preview_data,
      now,
      now,
      comp.published_at
    );

    // Insert files
    for (const file of comp.files) {
      db.prepare(`
        INSERT INTO component_files (id, component_id, path, content, is_main, file_type, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        `f_${comp.slug}_${file.path}`,
        comp.id,
        file.path,
        file.content,
        file.is_main,
        file.file_type,
        now
      );
    }
  }

  console.log(`[Database] Seeded ${components.length} components.`);
}
