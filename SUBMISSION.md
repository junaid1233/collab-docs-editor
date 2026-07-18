# Submission — Raxha (Collaborative Document Editor)

**Product:** Raxha  
**Assessment:** Ajaia LLC AI-Native Full Stack Developer  
**Candidate:** Muhammad Junaid  
**Email:** muhammadjunaid@gmail.com  
**Date:** July 18, 2026

## Google Drive Folder Contents

| Item | Location |
|------|----------|
| Source code | This repository (full project) |
| README.md | `/README.md` |
| Architecture note | `/ARCHITECTURE.md` |
| AI workflow note | `/AI_WORKFLOW.md` |
| Submission index | `/SUBMISSION.md` (this file) |
| Walkthrough script | `/WALKTHROUGH_SCRIPT.md` |
| Walkthrough video URL | `/video-url.txt` |

## Live Deployment

**URL:** `https://YOUR-APP.vercel.app` _(replace after Vercel + Turso deploy)_

Deploy steps: see README → [Deployment (Vercel + Turso)](./README.md#deployment-vercel--turso)

## Walkthrough Video

**URL:** See [`video-url.txt`](./video-url.txt)  
**Script:** [`WALKTHROUGH_SCRIPT.md`](./WALKTHROUGH_SCRIPT.md)

## Demo Credentials

| User | Email | Password |
|------|-------|----------|
| Alice (owner) | alice@demo.com | password123 |
| Bob (shared) | bob@demo.com | password123 |

## Product Judgment (Summary)

Built for a **complete document lifecycle** within the timebox: auth → create → edit → persist → import → share. **Async collaboration** via email sharing (owner + shared user edit access). Real-time multi-cursor editing was cut intentionally — see `ARCHITECTURE.md` tradeoffs.

## Feature Checklist

| Feature | Status |
|---------|--------|
| Login / logout | ✅ Working |
| Create document | ✅ Working |
| Rename document | ✅ Working (inline title edit) |
| Rich text editing (ribbon + B/I/U, lists, fonts, colors) | ✅ Working |
| Save & reopen (formatting preserved) | ✅ Working |
| Auto-save (3s debounce) | ✅ Working |
| File upload (.txt, .md) | ✅ Working |
| Share document by email | ✅ Working |
| Unshare document | ✅ Working |
| My Documents / Shared with Me tabs | ✅ Working |
| Access control (owner + shared only) | ✅ Working |
| Persistence after refresh | ✅ Working |
| Async collaboration (share + edit, not live co-editing) | ✅ Working |
| Public landing page | ✅ Working |
| Automated tests | ✅ 6 tests passing |
| Live deployment | ⚠️ Pending — paste URL after Vercel + Turso |
| Walkthrough video | ⚠️ Pending — record using WALKTHROUGH_SCRIPT.md |

## What's Incomplete (Post-Submission)

- Production URL (requires Turso + Vercel — ~15 min manual setup)
- Loom walkthrough recording (~5 min using provided script)
- Playwright E2E test (optional follow-up)
- View-only vs edit share roles (optional follow-up)

## How to Run Locally

```bash
npm install
cp .env.example .env
npx prisma db push
npm run db:seed
npm run dev
```

Open http://localhost:3000 → Sign In with demo accounts above.

## How to Test Sharing

1. Login as alice@demo.com
2. Create a document → Share → enter bob@demo.com
3. Logout → Login as bob@demo.com
4. Check **Shared with Me** tab → open document → edit → refresh

## Tech Stack Summary

Next.js 15 · React 19 · TipTap · Prisma · SQLite/Turso · JWT sessions · Tailwind 4 · Vitest

## Repository

https://github.com/junaid1233/collab-docs-editor
