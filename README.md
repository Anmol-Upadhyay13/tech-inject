# Tech Inject Design Library

A production-ready developer-facing component library and design system platform inspired by modern Sales CRM interfaces. Features live interactive component previews, real-time props inspection, typed source code access, automated CLI package installer, and contextual AI-agent integration prompts.

---

## 1. Project Overview & Architecture

Tech Inject delivers a unified design system platform structured around two primary web interfaces powered by a shared high-performance backend:

1. **Public Component Catalogue (`/`)**: A developer-focused documentation portal where developers can search, filter, preview, test states/sizes, view typed props, copy source code, install via CLI, and copy tailored AI coding prompts.
2. **Admin Dashboard (`/admin`)**: A protected administrative interface for authoring component drafts, uploading validated source bundles, previewing unpublished components, managing customer subscriptions, and granting/revoking Pro access with immediate effect.

### Monorepo & Modular Architecture

```
tech-inject-design-library/
├── packages/
│   ├── theme/           # Design tokens (colors, typography, spacing, radii, shadows, borders, heights, focus)
│   ├── ui/              # Canonical design system components (Button, Input, Card, Table, Modal, etc.)
│   ├── types/           # Shared TypeScript interfaces (Component, User, Cli, Audit)
│   ├── validation/      # Zod schemas for runtime bundle validation and traversal prevention
│   └── cli/             # Official CLI (@tech-inject/cli) executable & installer core
├── backend/
│   ├── db/              # Persistent SQLite (WAL mode) database & seeds
│   ├── auth/            # JWT authentication & live permission checking middleware
│   ├── routes/          # API endpoints (/api/auth, /api/components, /api/admin, /api/cli)
│   └── storage/         # Component file bundle manager & path traversal guards
├── examples/
│   └── consumer-react-ts/ # Standalone consumer React + TS project proving independent compilation
├── tests/               # Vitest automated security, path traversal, and installer test suites
├── prisma/
│   └── schema.prisma    # Relational database schema reference & migrations spec
├── src/                 # Fullstack SPA entry point & client views
├── server.ts            # Fullstack Express server mounting API & Vite middlewares
├── README.md
├── answers.md
└── .env.example
```

---

## 2. Component Inventory

| Component | Category | Version | Access Tier | Key Variants & Features |
| :--- | :--- | :--- | :--- | :--- |
| **Button** | Actions | 1.2.0 | Free | Primary, Secondary, Outline, Ghost, Destructive, Subtle, Loading spinner, Left/Right icons |
| **IconButton** | Actions | 1.0.0 | Free | Accessible icon trigger with variants and tooltip integration |
| **Input** | Forms | 1.1.0 | Free | Leading/trailing icons, error state, helper text, disabled state |
| **SearchInput** | Forms | 1.0.0 | Free | Integrated `⌘K` keyboard shortcut indicator, 1-click clear button |
| **Card** | Layout | 1.0.0 | Free | Default, Flat, Interactive hover, Header, Title, Description, Content, Footer |
| **Badge** | Feedback | 1.0.0 | Free | Neutral, Brand, Success, Warning, Error, Pro, Status dot indicators |
| **Tabs** | Navigation | 1.0.0 | Free | Segmented control & Line tabs with count badges |
| **Alert** | Feedback | 1.0.0 | Free | Info, Success, Warning, Error with dismiss action |
| **Breadcrumbs** | Navigation | 1.0.0 | Free | Hierarchical trail with chevron separators and page current state |
| **Table / Data Grid** | Data Display | 2.0.0 | **Premium (Pro)** | Tabular numeric alignment (`tabular-nums`), sorting headers, skeleton loading state |
| **Modal Dialog** | Overlay | 1.4.0 | **Premium (Pro)** | Accessible backdrop, focus trap, keyboard Escape listener, header/footer slots |
| **Drawer / Slide-Over** | Overlay | 1.1.0 | **Premium (Pro)** | Right-anchored sheet panel with smooth slide transition and body overflow lock |
| **Filter Control** | Forms | 1.0.0 | **Premium (Pro)** | Active criteria counter, clear action, filter state synchronization |

---

## 3. Visual Language & Token Hierarchy

Consumes canonical design tokens in `/packages/theme/tokens`:
- **Colors**: Refined slate-indigo (`#4F46E5`), high-contrast slate neutrals (`#0F172A` to `#F8FAFC`), and semantic data indicators (Emerald, Amber, Rose).
- **Typography**: Display & body set in `Plus Jakarta Sans`, tabular figures and code set in `JetBrains Mono`.
- **Heights**: Strict 38px B2B control standard (`control.md`), 32px (`control.sm`), and 44px (`control.lg`).
- **Radii**: 6px (`radii.md`) for inputs/buttons, 8px (`radii.lg`) for cards/modals.
- **Focus Rings**: 2px indigo ring with 1px white offset (`focus-visible:ring-2 focus-visible:ring-indigo-600/30`).
- **Zero-Pill Discipline**: Metadata is rendered cleanly using unboxed text with typographic separators (`·`), avoiding colored pill badge clutter.

---

## 4. Security & Access Control Model

Tech Inject enforces server-authoritative security:
1. **Server-Side Gatekeeping**: Direct requests to `/api/components/:slug/source`, `/api/components/:slug/install`, and `/api/components/:slug/ai-prompt` require valid user tokens with `is_premium === 1`.
2. **Instant Revocation**: User subscription statuses are validated directly against the live database record on each request. When an administrator revokes premium access, the very next API call immediately fails with `403 Forbidden`.
3. **Admin Privilege Isolation**: Administrators do NOT automatically inherit customer premium permissions. Admin privileges only govern administrative routes (`/api/admin/*`).
4. **Path Traversal Guards**: The upload and CLI installer engines enforce strict path regexes rejecting `../`, absolute paths (`/` or `C:\`), and executable scripts (`.sh`, `.exe`, `.bash`).
5. **Overwrite Protection**: The CLI refuses to silently overwrite existing files unless the `--overwrite` flag is explicitly provided.

---

## 5. Seed Test Accounts

The database initializes with the following demonstration accounts:

| Role | Email | Password | Permissions & Access |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@techinject.dev` | `AdminPass123!` | Full admin dashboard, create/edit drafts, publish/unpublish, grant/revoke premium |
| **Premium Pro Customer** | `pro@techinject.dev` | `ProPass123!` | Full access to all Free & Pro components, source code, CLI installer tokens, AI prompts |
| **Free Developer** | `developer@techinject.dev` | `FreePass123!` | Access to foundational free components; locked preview/source on Pro components |

*Note: The platform includes a 1-click Demo Account Switcher in the top right menu for instant evaluation.*

---

## 6. CLI Installer

Command:
```bash
npx @tech-inject/cli add <component> [options]
```

### Options:
- `--dir <path>`: Target installation directory (default: `./src/components/ui`)
- `--token <token>`: Premium access token for Pro components
- `--api <url>`: Registry endpoint URL (default: `http://localhost:3000`)
- `--overwrite`: Allow overwriting existing local files

### Examples:
```bash
# Install free component
npx @tech-inject/cli add button

# Install premium component with token
npx @tech-inject/cli add table --token your_premium_token
```

---

## 7. Standalone Consumer Test Project

Located in `/examples/consumer-react-ts`:
- Builds completely independently with its own `package.json`, `tsconfig.json`, and `vite.config.ts`.
- Validates the 3 integration options working harmoniously:
  1. `Button.tsx`: Copied manually from the Code tab.
  2. `Badge.tsx`: Installed using the CLI tool.
  3. `Card.tsx`: Integrated via the generated AI Agent prompt.

---

## 8. Verification & Test Commands

Run the full verification suite:
```bash
# Run automated security and installer tests
npm run test

# Run strict TypeScript validation
npm run lint

# Build full-stack production bundle
npm run build
```

---

## 9. AI Usage Documentation

- **Tooling Used**: Gemini 2.5/3 Pro agent for initial component scaffolding and token structure.
- **Representative Prompt**: *"Build a strict TypeScript Zod schema for component upload bundles that checks file extensions, file sizes, and rejects any directory traversal attempts or absolute paths."*
- **What Was Accepted**: Clean Zod regex schema validation patterns and typed interface scaffolds.
- **What Was Challenged & Refactored**: Generic pill badge designs were replaced with the anti-slop zero-pill typographic discipline. Hardcoded mocks were replaced with server-side SQLite persistence and live database queries.
- **Verification**: All routes were verified against `vitest run` and `tsc --noEmit`.
