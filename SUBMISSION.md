# Submission — Ajaia Docs

**Candidate:** Muhammad Junaid  
**Email:** muhamadjunaid@gmail.com  
**Date:** July 18, 2026

## Google Drive Folder Contents

| Item | Location |
|------|----------|
| Source code | This repository (full project) |
| README.md | `/README.md` |
| Architecture note | `/ARCHITECTURE.md` |
| AI workflow note | `/AI_WORKFLOW.md` |
| Submission index | `/SUBMISSION.md` (this file) |
| Walkthrough video URL | `/video-url.txt` |

## Live Deployment

**URL:** _To be added after Vercel + Turso deploy_

## Demo Credentials

| User | Email | Password |
|------|-------|----------|
| Alice (owner) | alice@demo.com | password123 |
| Bob (shared) | bob@demo.com | password123 |

## Feature Checklist

| Feature | Status |
|---------|--------|
| Login / logout | ✅ Working |
| Create document | ✅ Working |
| Rename document | ✅ Working (inline title edit) |
| Rich text editing (B/I/U, H1/H2, lists) | ✅ Working |
| Save & reopen (formatting preserved) | ✅ Working |
| Auto-save (3s debounce) | ✅ Working |
| File upload (.txt, .md) | ✅ Working |
| Share document by email | ✅ Working |
| Unshare document | ✅ Working |
| My Documents / Shared with Me tabs | ✅ Working |
| Access control (owner + shared only) | ✅ Working |
| Persistence after refresh | ✅ Working |
| Automated tests | ✅ 6 tests passing |
| Live deployment | ⚠️ Pending Vercel + Turso setup |

## What's Incomplete

- Production deployment URL (requires Turso account + Vercel deploy)
- Walkthrough video (record after deploy smoke test)

## Next 2–4 Hours

1. Deploy to Vercel with Turso database
2. Record 3–5 minute Loom walkthrough
3. Add Playwright E2E test for share flow
4. Role-based permissions (view-only vs edit)

## How to Run Locally

```bash
npm install
cp .env.example .env
npx prisma db push
npm run db:seed
npm run dev
```

Open http://localhost:3000 — sign in with demo accounts above.

## How to Test Sharing

1. Login as alice@demo.com
2. Create a document → Share → enter bob@demo.com
3. Logout → Login as bob@demo.com
4. Check "Shared with Me" tab

## Tech Stack Summary

Next.js 15 · TipTap · Prisma · SQLite/Turso · JWT sessions · Tailwind · Vitest
