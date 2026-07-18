# Raxha — Loom Walkthrough Script (3–5 minutes)

Record this after deploying to Vercel + Turso. Paste the Loom/YouTube URL into `video-url.txt`.

**Demo accounts:** alice@demo.com / bob@demo.com — password: `password123`

---

## 0:00 – 0:25 | Intro + Landing

**Screen:** Open live URL `/` (landing page)

**Say:**
> "Hi, I'm Muhammad Junaid. This is **Raxha** — my submission for the Ajaia LLC assessment: a lightweight document editor inspired by Google Docs. I focused on the core product loop — create, edit, persist, import, and share — rather than rebuilding every Google Docs feature."

**Show:** Hero, features section briefly.

---

## 0:25 – 0:45 | Login

**Screen:** Click **Sign In** → login page

**Say:**
> "Users sign in with email and password. I'll use Alice, our document owner."

**Do:** Login as `alice@demo.com` / `password123`

---

## 0:45 – 1:30 | Create + Edit + Format

**Screen:** Dashboard → **New document**

**Say:**
> "Alice creates a new document. The editor uses a Word-style ribbon for formatting — fonts, bold, lists, colors. Content auto-saves every three seconds."

**Do:**
- Type a title and a few paragraphs
- Apply bold, bullet list, change font size
- Point at save status (Saved / Saving)

---

## 1:30 – 1:50 | Persistence

**Screen:** Refresh the page (F5)

**Say:**
> "After refresh, all formatting and content persist from the database — TipTap JSON stored via Prisma."

**Do:** Show content still there with formatting intact.

---

## 1:50 – 2:30 | Share

**Screen:** Click **Share** in editor header

**Say:**
> "Alice shares the document with Bob by email. Access is enforced on the API — only the owner and explicitly shared users can open the document."

**Do:**
- Enter `bob@demo.com`
- Confirm share success
- Mention this is **async collaboration**, not live multi-cursor editing

---

## 2:30 – 3:10 | Bob — Shared with Me

**Screen:** Sign out → Login as `bob@demo.com`

**Say:**
> "Bob signs in and sees the document under **Shared with Me**. He can open and edit it."

**Do:**
- Open **Shared with Me** tab
- Open shared document
- Add a line of text
- Refresh → show Bob's edit persisted

---

## 3:10 – 3:40 | File Upload

**Screen:** Dashboard → **Upload .txt or .md**

**Say:**
> "Users can import plain text or markdown files as editable documents. Other file types are rejected with a clear error."

**Do:** Upload a small `.md` file → open in editor.

---

## 3:40 – 4:10 | Dashboard + Access

**Screen:** Dashboard — My Documents / Shared with Me tabs

**Say:**
> "The dashboard separates owned and shared documents. Unshare removes access immediately."

**Do:** (Optional) Quick show of both tabs.

---

## 4:10 – 4:45 | Architecture + Wrap

**Screen:** README or ARCHITECTURE.md (optional) OR stay on app

**Say:**
> "I intentionally cut real-time WebSocket collaboration to ship a reliable demo within the timebox. Stack: Next.js 15, TipTap, Prisma, JWT auth. Tests cover validation and access rules. Live demo link is in the README. Thanks for watching."

---

## Recording Tips

- Resolution: 1920×1080 or 1280×720
- Hide browser bookmarks bar
- Use incognito or clear session between Alice/Bob logins
- Keep mouse movements slow and deliberate
- Total target: **3–5 minutes**

## After Recording

1. Upload to [Loom](https://loom.com) or YouTube (unlisted)
2. Paste URL into `video-url.txt`
3. Update `README.md` and this file's submission with live demo URL
