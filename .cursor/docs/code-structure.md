# Code Structure — Ajaia Docs

Primary language: **TypeScript** (Next.js 15, React 19).

## Universal thresholds

| Rule | Warn | Hard limit | Notes |
|------|------|------------|-------|
| File length | >300 lines | >500 lines | Excludes generated, lockfiles |
| Function/method length | >40 lines | >75 lines | |
| Class/component module | >200 lines | — | Split sub-UI into files |
| Nesting depth (inside function) | >3 levels | — | Extract helpers |
| Function parameters | >4 | — | Use options object |
| Single responsibility | — | — | One primary concern per file |

## TypeScript / React rules (this repo)

| Rule | Detail |
|------|--------|
| No `any` | Use explicit types; `unknown` + type guards when needed |
| Named exports | Lib and shared components; default export only for Next pages/layouts |
| One component per file | Primary export; private helpers OK in same file |
| Hooks >60 lines | Split into smaller hooks |
| No business logic in UI | Access → `src/lib/documents.ts`; validation → `src/lib/validation.ts` |
| No direct DB in UI | Server pages or `/api/*` only |
| No API calls in lib | Except `auth.ts` using `next/headers` cookies |

## Next.js API route rules (adapted for App Router)

This project uses **Route Handlers** (not Express), but the same thin-handler principle applies:

| Rule | Limit |
|------|-------|
| Handler readability | Extract repeated logic to `src/lib/**` |
| Auth first line | `getSession()` → 401 |
| Validation | Zod `safeParse` before prisma |
| Errors | try/catch → 500 JSON; never unhandled throw |
| Params | `await params` (Next 15 async params) |

```typescript
// ✅ Thin handler — logic in lib
const access = await getDocumentAccess(id, session.id);
if (!access.canWrite) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

// ❌ Inline access check duplicated across routes
const doc = await prisma.document.findUnique(...);
if (doc.ownerId !== session.id && !doc.shares.some(...)) ...
```

## How to use this doc

Before completing any task, scan modified files against thresholds. Fix clear violations (extract function, split file) or flag with path + line range.

## Current violations (fix when touching these files)

| File | Lines | Issue | Suggested fix |
|------|-------|-------|---------------|
| `src/components/ribbon/WordRibbon.tsx` | ~504 | Hard file limit | Split into `ClipboardGroup.tsx`, `FontGroup.tsx`, `ParagraphGroup.tsx` |
| `src/components/DocumentEditor.tsx` | ~336 | Warn threshold | Extract `ShareModal.tsx`, `useDocumentSave.ts` |
| `src/components/ribbon/RibbonPrimitives.tsx` | ~335 | Warn threshold | Split `RibbonMenus.tsx` from button primitives |
| `src/app/globals.css` | ~700+ | Styles OK | Not subject to TS file limits |

## ✅ Good examples in repo

| File | Lines | Why good |
|------|-------|----------|
| `src/lib/documents.ts` | ~65 | Single concern: access control |
| `src/lib/auth.ts` | ~72 | Session only |
| `src/lib/validation.ts` | ~120 | Schemas + pure helpers |
| `src/app/api/auth/login/route.ts` | ~45 | Auth → validate → respond |

## Refactor patterns

```typescript
// Extract long handler helper
async function updateDocumentForUser(id: string, userId: string, data: UpdateInput) {
  const access = await getDocumentAccess(id, userId);
  if (!access.canWrite) return { error: "Forbidden", status: 403 as const };
  // ...
}

// Split large component
// DocumentEditor.tsx → DocumentEditor.tsx + ShareDocumentModal.tsx + useAutoSave.ts
```
