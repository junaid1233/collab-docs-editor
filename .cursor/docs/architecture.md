# Architecture — Ajaia Docs

## Overview

Monolithic **Next.js 15 App Router** app: collaborative document editor with JWT cookie auth, Prisma/SQLite, TipTap rich text, document sharing.

## Data flow

```
┌─────────┐     ┌──────────────┐     ┌─────────────────┐
│ Browser │────▶│ middleware.ts │────▶│ page.tsx (RSC)  │──▶ prisma (SSR)
└─────────┘     │  JWT verify   │     └─────────────────┘
     │          └──────────────┘              │
     │                 │                       ▼
     │                 └──────────────▶ route.ts (API) ──▶ lib + prisma
     │                                        │
     └──────── fetch /api/* ◀─────────────────┘
```

## Layer table

| Layer | Path | Responsibility | Must NOT |
|-------|------|----------------|----------|
| Middleware | `src/middleware.ts` | Protect routes; JWT from `ajaia_session` cookie | Query database |
| API routes | `src/app/api/**/route.ts` | HTTP, Zod validation, status codes | Import React, TipTap |
| Server pages | `src/app/**/page.tsx` | Load data server-side; redirect if no session | Use `useState` without `"use client"` |
| Client UI | `src/components/**` | Interactivity, editor, dashboard tabs | Import `@/lib/prisma` |
| Domain | `src/lib/**` | Auth, access control, validation, TipTap extensions | Return `NextResponse` |
| Persistence | `prisma/schema.prisma` | User, Document, DocumentShare models | Business rules |

## Import patterns

```typescript
// ✅ src/app/api/documents/[id]/route.ts
import { getSession } from "@/lib/auth";
import { getDocumentAccess } from "@/lib/documents";
import { updateDocumentSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";

// ✅ src/app/dashboard/page.tsx
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/DashboardClient";

// ❌ src/components/DashboardClient.tsx
import { prisma } from "@/lib/prisma";
```

## Dependency wiring

| Concern | Access pattern |
|---------|----------------|
| DB | `import { prisma } from "@/lib/prisma"` — singleton, global cached in dev |
| Session (server) | `await getSession()` from `@/lib/auth` |
| Session (middleware) | `jwtVerify` + `COOKIE_NAME` from `@/lib/auth` |
| Document access | `getDocumentAccess(id, userId)` → `{ canRead, canWrite, isOwner }` |
| Env | `process.env.JWT_SECRET`, `process.env.DATABASE_URL` |

## Directory structure

```
ajaia-docs/
├── prisma/
│   ├── schema.prisma      # User, Document, DocumentShare
│   └── seed.ts            # alice@demo.com, bob@demo.com
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/login/route.ts
│   │   │   ├── auth/logout/route.ts
│   │   │   └── documents/         # CRUD, upload, share
│   │   ├── dashboard/page.tsx     # SSR doc lists
│   │   ├── documents/[id]/page.tsx
│   │   ├── login/page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css            # Word ribbon + ProseMirror styles
│   ├── components/
│   │   ├── ribbon/                # WordRibbon, primitives, icons
│   │   ├── DocumentEditor.tsx     # TipTap + save + share modal
│   │   ├── DocumentEditorLoader.tsx  # dynamic ssr:false
│   │   ├── DashboardClient.tsx
│   │   └── LoginForm.tsx
│   ├── lib/
│   │   ├── auth.ts                # JWT session cookies (jose)
│   │   ├── documents.ts           # Access control helpers
│   │   ├── validation.ts            # Zod schemas + import helpers
│   │   ├── prisma.ts
│   │   └── tiptap/                  # FontSize, custom lists, underline
│   └── middleware.ts
└── vitest.config.ts
```

## New feature checklist

1. **Schema** — add Zod schema to `src/lib/validation.ts` if new input shape
2. **Prisma** — update `prisma/schema.prisma` → `npx prisma db push`
3. **Lib** — business rules in `src/lib/` (not in route handler)
4. **API** — `src/app/api/.../route.ts` with auth + validation
5. **UI** — server page for SSR data OR client component with `fetch`
6. **Test** — unit test pure logic in `src/lib/*.test.ts`
7. **Docs** — update README if setup/deploy changes

## Auth flow

1. `POST /api/auth/login` — bcrypt verify → `createSession()` → httpOnly cookie
2. `middleware.ts` — verifies JWT on all routes except `/login`, `/api/auth/login`
3. API routes double-check with `getSession()` (defense in depth)
4. `POST /api/auth/logout` — `destroySession()`

## Document access model

- **Owner**: full CRUD + share + delete
- **Shared user** (`DocumentShare` row): read + write
- **Others**: 404 on GET (no information leak)

Implemented in `src/lib/documents.ts`, enforced in `src/app/api/documents/[id]/route.ts`.
