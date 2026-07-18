# Ajaia Docs

A lightweight collaborative document editor built for the Ajaia LLC AI-Native Full Stack Developer assessment.

## Live Demo

**Production URL:** _Deploy to Vercel + Turso and paste URL here_

## Features

- Email/password login with seeded demo users
- Create, rename, edit, save, and reopen documents
- Rich text editing (bold, italic, underline, H1/H2, bullet/numbered lists)
- Auto-save every 3 seconds with manual save option
- Share documents with other users by email
- Dashboard tabs: **My Documents** | **Shared with Me**
- Upload `.txt` or `.md` files to create editable documents
- Persistent storage via Prisma + SQLite (local) / Turso (production)

## Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| alice@demo.com | password123 | Document owner (use for create/share flows) |
| bob@demo.com | password123 | Shared user (use to verify shared access) |

## Quick Start (Local)

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Create database and seed users
npx prisma db push
npm run db:seed

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with a demo account.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm test` | Run automated tests |
| `npm run db:push` | Sync Prisma schema to database |
| `npm run db:seed` | Seed demo users |

## Supported Upload Types

Only **`.txt`** and **`.md`** files are supported. Other file types are rejected with a clear error message in the UI.

## Testing the Sharing Flow

1. Sign in as **alice@demo.com**
2. Create a document and add content
3. Click **Share** and enter `bob@demo.com`
4. Sign out, then sign in as **bob@demo.com**
5. Open **Shared with Me** — the document should appear
6. Bob can edit the document; refresh to confirm persistence

## Deployment (Vercel + Turso)

SQLite works locally but not on Vercel serverless (ephemeral filesystem). For production:

1. Create a free [Turso](https://turso.tech) database
2. Set `DATABASE_URL` in Vercel to your Turso connection string
3. Set `JWT_SECRET` to a long random string
4. Deploy:

```bash
npx vercel --prod
```

5. Run seed against production DB (one time):

```bash
DATABASE_URL="your-turso-url" npm run db:seed
```

## What's Working

- Full auth flow with session cookies
- Document CRUD with TipTap rich text persistence (JSON)
- Sharing/unsharing with access enforcement
- File upload for `.txt` and `.md`
- Auto-save and manual save
- One automated test suite (6 tests)

## Intentionally Out of Scope

- Real-time collaborative editing (WebSockets/Yjs)
- Comments, suggestions, version history
- PDF/DOCX export
- OAuth / enterprise RBAC
- Paid third-party services

## Next Steps (2–4 Hours)

- Deploy to Vercel + Turso with CI seed step
- Add read-only vs edit share permissions
- Improve markdown import (nested lists, inline formatting)
- Document version snapshots
- E2E tests with Playwright

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
  components/       # UI components
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
