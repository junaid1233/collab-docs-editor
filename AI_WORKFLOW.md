# AI Workflow Note

**Candidate:** Muhammad Junaid  
**Tools used:** Cursor (Agent mode), Claude via Cursor

## Where AI Materially Sped Up Work

1. **Project scaffolding** — Generated Next.js structure, Prisma schema, API route patterns, and package.json scripts in one pass instead of manual boilerplate.
2. **TipTap integration** — AI suggested StarterKit + Underline extension wiring, toolbar buttons, and JSON serialization pattern for persistence.
3. **Sharing API design** — Rapid iteration on `DocumentShare` model, unique constraint, and owner-only share/unshare endpoints.
4. **Markdown import helper** — AI drafted `markdownToTipTapJson()` for headings and lists; I reviewed and kept the simplified version.
5. **Documentation** — README, architecture note, and submission checklist drafted from the assignment spec, then edited for accuracy.

## What AI Output Was Changed or Rejected

| AI suggestion | Action taken |
|---------------|--------------|
| Separate Express backend | **Rejected** — kept Next.js API routes for faster deploy |
| NextAuth / OAuth | **Rejected** — seeded login sufficient for scope |
| Real-time Yjs collaboration | **Rejected** — explicitly out of scope |
| Full markdown parser (remark) | **Rejected** — basic line parser enough for `.md` import demo |
| `create-next-app` in folder with capitals | **Changed** — manual scaffold due to npm naming restriction |
| POST on `/api/documents/create` | **Changed** — consolidated to `/api/documents` REST pattern |

## How Correctness Was Verified

1. **Automated tests** — `npm test` (6 tests): file validation, content conversion, access rules
2. **Production build** — `npm run build` passes with no type errors
3. **Database seed** — Confirmed alice/bob users created via `npm run db:seed`
4. **Manual flow checklist:**
   - Login as Alice → create doc → format text → refresh → content persists
   - Share with bob@demo.com → login as Bob → doc in Shared tab
   - Upload `.txt` file → opens as editable document
   - Unsupported file type → error message shown

## AI Usage Philosophy

AI was used as an **accelerator**, not a substitute for judgment. Schema design, scope cuts (no real-time collab), access control rules, and deployment constraints (SQLite local / Turso prod) were decided before or during implementation review. Every API route was checked for auth and authorization before considering the feature done.

## Estimated Time Saved

~60–90 minutes on boilerplate, docs, and repetitive CRUD/API patterns — redirected toward sharing logic, editor UX, and test coverage.
