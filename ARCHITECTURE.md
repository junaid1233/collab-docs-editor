# Architecture Note — Raxha

*Ajaia LLC assessment submission — lightweight collaborative document editor.*

## Overview

Raxha is a monolithic Next.js application using the App Router for both UI and API routes. This keeps deployment simple (single Vercel project) while still demonstrating full stack capability: auth, persistence, sharing logic, file handling, and a rich-text editor.

**Collaboration model:** Asynchronous sharing by email (owner + shared user edit access). Real-time simultaneous editing was intentionally excluded — see Tradeoffs.

## Prioritization

| Priority | Area | Rationale |
|----------|------|-----------|
| P0 | Auth + document CRUD | Core product loop must work end-to-end |
| P0 | TipTap editor + persistence | Primary user value; formatting must survive refresh |
| P1 | Sharing model | Required differentiator; demonstrates access control |
| P1 | File upload (.txt/.md) | Product-relevant import path without heavy parsing |
| P2 | UI polish, auto-save | Improves demo quality without blocking core flows |
| Cut | Real-time collab | High complexity, low ROI within 4–6 hours |

## Stack Decisions

### Next.js App Router
Single codebase for frontend pages and REST-style API routes. Server Components fetch document lists on the dashboard; the editor is client-side (TipTap requires DOM).

### TipTap (ProseMirror)
Chosen over raw `contentEditable` or Quill because it provides structured JSON output, extension-based formatting, and reliable list/heading support with minimal custom code.

### Prisma + SQLite (local) / Turso (prod)
Prisma gives type-safe queries and fast schema iteration. SQLite keeps local setup zero-config. Turso (libSQL) is the production path because Vercel's serverless functions cannot persist SQLite files.

### JWT session cookies (jose)
Lightweight auth without adding NextAuth complexity. HttpOnly cookies protect tokens; middleware guards routes.

## Data Model

```
User ──owns──▶ Document ◀──shares── DocumentShare ──▶ User
```

- **User**: email, name, bcrypt password hash
- **Document**: title, content (TipTap JSON string), ownerId
- **DocumentShare**: many-to-many link between documents and shared users

## Access Control

Access is enforced at the API layer on every document operation:

1. **Owner** — full read/write/delete/share
2. **Shared user** — read/write (no delete/share)
3. **Everyone else** — 404 (no information leakage)

Helper functions in `src/lib/documents.ts`:
- `getDocumentAccess()` — returns canRead, canWrite, isOwner
- `canAccessDocument()` — boolean gate for middleware-level checks
- `isDocumentOwner()` — owner-only operations (share, delete)

## Content Persistence

Document content is stored as a JSON string (TipTap document tree). On load, the editor parses JSON and hydrates ProseMirror state. This preserves bold, italic, underline, headings, and lists across save/reload cycles.

## File Upload Flow

1. Client sends multipart form with `.txt` or `.md` file
2. Server validates extension
3. Plain text → paragraph nodes; markdown → basic heading/list parsing
4. New document created with imported content

Supported types are limited intentionally and surfaced in the UI.

## Auto-Save

The editor debounces saves 3 seconds after the last change. A visible status indicator shows Saved / Saving / Unsaved / Error. Users can also trigger manual save.

## Deployment Architecture

```
Browser → Vercel (Next.js) → Turso (libSQL)
                ↓
         JWT cookie session
```

Local development uses SQLite at `prisma/dev.db`.

## Testing Strategy

Vitest tests cover:
- Upload file type validation
- Markdown/plain text → TipTap JSON conversion
- Document access rule logic (owner vs shared vs denied)

These tests protect the highest-risk business rules without requiring a full E2E harness within the timebox.

## Tradeoffs

| Decision | Tradeoff |
|----------|----------|
| No real-time collab | Simpler architecture; single-user edit sessions |
| Basic markdown import | Fast to build; not a full markdown compiler |
| Shared users can edit | Simpler than read-only/edit roles; enough for demo |
| Monolith vs separate API | Faster delivery; less infra overhead |
