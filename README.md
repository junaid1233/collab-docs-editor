# Raxha — Lightweight Collaborative Document Editor

*Submission for the Ajaia LLC AI-Native Full Stack Developer assessment.*

A lightweight document editor inspired by Google Docs — focused on create, edit, persist, import, and share. Built with Next.js, TipTap, and Prisma. **Collaboration is asynchronous via email sharing**, not live multi-cursor co-editing.

## Live Demo

**Production URL:** `https://YOUR-APP.vercel.app` _(replace after deploy — see [Deployment](#deployment-vercel--turso))_

Local: [http://localhost:3000](http://localhost:3000)

## Product Judgment

This submission prioritizes a **complete document lifecycle**—create, edit, persist, import, and share—over real-time simultaneous editing. Users collaborate **asynchronously**: owners share documents by email, and registered users with shared access can read and edit. Real-time multi-cursor collaboration (WebSockets/Yjs) was **intentionally scoped out** to ship a reliable, demo-ready product within the assessment timebox. API-level access control (owner vs shared vs denied) protects every document operation.

## Features

- Email/password login with seeded demo users
- Create, rename, edit, save, and reopen documents
- Rich text editing with Word-style ribbon (fonts, bold, italic, underline, lists, colors, alignment)
- Auto-save every 3 seconds with manual save option
- **Async collaboration** — share documents by email; shared users can edit (not live co-editing)
- Dashboard tabs: **My Documents** | **Shared with Me**
- Upload `.txt` or `.md` files to create editable documents
- Persistent storage via Prisma + SQLite (local) / Turso (production)

## Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| alice@demo.com | password123 | Document owner (create/share flows) |
| bob@demo.com | password123 | Shared user (verify shared access) |

## Quick Start (Local)

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
npm install
cp .env.example .env
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — landing page → **Sign In** → use a demo account.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm test` | Run automated tests (6 Vitest tests) |
| `npm run db:push` | Sync Prisma schema to database |
| `npm run db:seed` | Seed demo users |

## Testing the Sharing Flow

1. Sign in as **alice@demo.com**
2. Create a document and add content
3. Click **Share** and enter `bob@demo.com`
4. Sign out, then sign in as **bob@demo.com**
5. Open **Shared with Me** — the document should appear
6. Bob can edit the document; refresh to confirm persistence

## Supported Upload Types

Only **`.txt`** and **`.md`** files are supported. Other file types are rejected with a clear error message in the UI.

## Deployment (Vercel + Turso)

SQLite works locally but **not** on Vercel serverless (ephemeral filesystem). Use Turso for production.

### 1. Create Turso database

```bash
# Install Turso CLI: https://docs.turso.tech/cli
turso db create raxha-docs
turso db show raxha-docs --url
turso db tokens create raxha-docs
```

Combine URL + token into `DATABASE_URL` (libSQL format).

### 2. Deploy to Vercel

1. Import [github.com/junaid1233/collab-docs-editor](https://github.com/junaid1233/collab-docs-editor) on [vercel.com](https://vercel.com)
2. Set environment variables:
   - `DATABASE_URL` — Turso connection string
   - `JWT_SECRET` — 32+ character random string
3. Deploy (build command: `prisma generate && next build`)

Or via CLI:

```bash
npx vercel login
npx vercel --prod
```

### 3. Seed production database (one time)

```bash
DATABASE_URL="your-turso-url" npm run db:seed
```

### 4. Update docs

Paste your live URL into `README.md`, `SUBMISSION.md`, and record the walkthrough (see `WALKTHROUGH_SCRIPT.md`).

## Walkthrough Video

Script: [`WALKTHROUGH_SCRIPT.md`](./WALKTHROUGH_SCRIPT.md)  
Video URL: [`video-url.txt`](./video-url.txt) _(paste Loom/YouTube link after recording)_

## What's Working

- Full auth flow with HttpOnly session cookies
- Document CRUD with TipTap rich text persistence (JSON)
- Sharing/unsharing with API-level access enforcement
- File upload for `.txt` and `.md`
- Auto-save and manual save with status indicator
- Word-style dark ribbon toolbar
- Public landing page with product overview
- Automated test suite (6 Vitest tests)

## Intentionally Out of Scope

- Real-time collaborative editing (WebSockets/Yjs) — async sharing instead
- Comments, suggestions, version history
- PDF/DOCX export
- OAuth / enterprise RBAC
- Paid third-party services

## Tech Stack

- Next.js 15 (App Router, TypeScript)
- TipTap + ProseMirror
- Prisma ORM + SQLite / Turso
- JWT session cookies (jose)
- Tailwind CSS 4
- Vitest

## Project Structure

```
src/
  app/              # Pages and API routes
  components/       # UI, ribbon, landing, brand
  lib/              # Auth, Prisma, validation, access helpers
prisma/
  schema.prisma     # Database schema
  seed.ts           # Demo user seed
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite file path (local) or Turso URL (prod) |
| `JWT_SECRET` | Secret for signing session tokens |

See `.env.example` for a template.

## Founder

**Muhammad Junaid**

- Portfolio: [junaid-portfolio-mu.vercel.app](https://junaid-portfolio-mu.vercel.app/)
- LinkedIn: [linkedin.com/in/muhammad-junaid-56b051282](https://www.linkedin.com/in/muhammad-junaid-56b051282/)
- GitHub: [github.com/junaid1233](https://github.com/junaid1233)

## Related Docs

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — stack decisions and tradeoffs
- [`SUBMISSION.md`](./SUBMISSION.md) — assessment checklist
- [`AI_WORKFLOW.md`](./AI_WORKFLOW.md) — AI-assisted development notes
