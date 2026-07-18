# Local Development — Ajaia Docs

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| npm | 9+ |

## Environment

Copy `.env.example` → `.env`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="ajaia-dev-secret-change-in-production-32chars"
```

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | SQLite path (local) or Turso URL (prod) |
| `JWT_SECRET` | JWT signing for session cookies |

## First-time setup

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open http://localhost:3000

## Demo accounts

| Email | Password |
|-------|----------|
| alice@demo.com | password123 |
| bob@demo.com | password123 |

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (port 3000) |
| `npm run build` | Production build |
| `npm start` | Run production build |
| `npm test` | Vitest |
| `npm run lint` | ESLint |
| `npm run db:push` | Sync schema to SQLite |
| `npm run db:seed` | Seed demo users |
| `npm run db:migrate` | Prisma migrate dev |

## Code generation

```bash
npx prisma generate   # also runs on postinstall
```

After schema changes: `npx prisma db push` then optionally re-seed.

## Database location

SQLite file: `prisma/dev.db` (gitignored)

## Production deploy notes

- **Vercel**: SQLite file DB does not persist — use Turso/libSQL
- Set `JWT_SECRET` and `DATABASE_URL` in Vercel env
- Run seed against prod DB once: `DATABASE_URL="..." npm run db:seed`

## Common gotchas

| Issue | Fix |
|-------|-----|
| `JWT_SECRET is not set` | Add to `.env` |
| Prisma EPERM on Windows during build | Stop dev server, retry `prisma generate` |
| TipTap hydration errors | Editor uses `ssr: false` via `DocumentEditorLoader` |
| Hydration mismatch on `<body>` | Browser extension attrs — `suppressHydrationWarning` on body |
| Git commit wrong author | Set local `git config user.email` for this repo |
| Cursor adds `Co-authored-by` | Amend commit outside Cursor if needed |

## Project name vs folder

npm package name: `ajaia-docs`. Folder may be `Ajaia-LLC-test` — no impact on runtime.
