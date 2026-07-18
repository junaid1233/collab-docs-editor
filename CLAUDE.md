# Ajaia Docs (collab-docs-editor)

Lightweight collaborative document editor: rich text (TipTap), document sharing, file upload (.txt/.md), JWT session auth. Built for Ajaia LLC assessment; demo users alice/bob@demo.com.

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 App Router |
| UI | React 19, Tailwind CSS 4, Word-style ribbon toolbar |
| Editor | TipTap 2 + custom extensions |
| DB | Prisma 6 + SQLite (local) / Turso (prod) |
| Auth | jose JWT httpOnly cookies, bcrypt passwords |
| Validation | Zod 3 |
| Tests | Vitest 3 |

## Architecture rules

- Monolith: pages + API routes in `src/app/`, domain logic in `src/lib/`
- Middleware JWT gate; API routes also call `getSession()`
- Server pages fetch with prisma; client components call `/api/*`
- Document access enforced in `src/lib/documents.ts`
- No global state store — RSC props + local `useState`

## Naming (condensed)

| Thing | Pattern | Example |
|-------|---------|---------|
| API | `route.ts` | `src/app/api/documents/route.ts` |
| Client UI | `*Client.tsx` | `DashboardClient` |
| Lib | named exports | `getDocumentAccess` |
| Tests | `*.test.ts` co-located | `validation.test.ts` |

## Tests

```bash
npm test
```

## Key guidelines — Cursor

### Always-on rules (`.cursor/rules/`)

| File | Purpose |
|------|---------|
| `architecture.mdc` | Layers, data flow, hard constraints |
| `conventions.mdc` | Naming, imports, TS/React patterns |
| `code-structure.mdc` | File/function limits + known violations |

### Scoped rules

| File | Globs | Purpose |
|------|-------|---------|
| `api-integration.mdc` | `src/app/api/**`, `src/lib/auth.ts`, etc. | Endpoint patterns, errors |
| `testing.mdc` | `**/*.test.ts`, `vitest.config.ts` | Vitest conventions |

### Reference docs (`.cursor/docs/` — @mention for detail)

| Doc | Topic |
|-----|-------|
| `architecture.md` | Full layer diagram, new feature checklist |
| `conventions.md` | Patterns with real code examples |
| `code-structure.md` | Thresholds, refactor targets |
| `api-integration.md` | All endpoints, templates |
| `testing.md` | Test templates, commands |
| `local-dev.md` | Setup, env, gotchas |

## Gotchas

1. SQLite does not persist on Vercel — use Turso for production
2. `Document.content` is TipTap JSON **as string** — always `JSON.stringify` / `JSON.parse`
3. Next 15 route `params` is a Promise — must `await params`
4. TipTap must not SSR — use `DocumentEditorLoader`
5. Sharing returns 404 (not 403) for unauthorized doc read — intentional
6. Only `.txt` and `.md` uploads supported
7. `WordRibbon.tsx` exceeds 500 lines — split before adding toolbar features
8. Git global config may differ from GitHub account — set local repo config
9. Cursor may inject `Co-authored-by` on commits — amend outside Cursor if needed
10. `postinstall` runs `prisma generate` — stop dev server if EPERM on Windows
