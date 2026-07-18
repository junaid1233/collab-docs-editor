# Raxha — Product Launch Prompt (Copy & Paste in Cursor)

**Brand:** Raxha  
**Founder:** Muhammad Junaid  
**Repo:** collab-docs-editor (Next.js 15 + TipTap + Prisma)

---

## 🚀 ONE-SHOT CURSOR PROMPT (paste this entire block)

```
Rebrand this Next.js project from "Ajaia Docs" to **Raxha** — a polished SaaS product launch with a public landing page and founder social links with icons.

## Brand Identity

| Field | Value |
|-------|-------|
| Product name | **Raxha** |
| Tagline | Write together. Format like Word. Share in one click. |
| Short description | Lightweight collaborative document editor with a familiar Word-style ribbon, auto-save, and email sharing. |
| Founder | Muhammad Junaid |
| Accent color | #0078d4 (already in globals.css as --word-accent) |
| Dark bg | #191919 / #2b2b2b (match existing Word editor theme) |

## Social Links (MUST include with icons in footer + landing page)

| Platform | URL | Icon |
|----------|-----|------|
| Portfolio | https://junaid-portfolio-mu.vercel.app/ | Globe or briefcase / personal site icon |
| LinkedIn | https://www.linkedin.com/in/muhammad-junaid-56b051282/ | LinkedIn logo SVG |
| GitHub | https://github.com/junaid1233 | GitHub logo SVG |

Icons must be inline SVG components (no new npm packages). Each link opens in new tab with `rel="noopener noreferrer"` and has accessible `aria-label`.

## Routing Changes

1. **`/`** → New public landing page (do NOT redirect to dashboard)
2. **`/login`** → Keep existing login (update branding to Raxha)
3. **`/dashboard`** → Keep as-is (update header title to Raxha)
4. Authenticated users visiting `/` can still see landing OR redirect to dashboard — prefer showing landing for everyone (CTA goes to login)

## Files to Create

### 1. `src/components/brand/SocialLinks.tsx`
- Reusable row of 3 social icon links (portfolio, LinkedIn, GitHub)
- Props: `variant?: "light" | "dark"` for icon color on different backgrounds
- SVG icons ~20px, hover scale/color transition

### 2. `src/components/brand/RaxhaLogo.tsx`
- Simple wordmark: "Raxha" with optional doc/pen icon mark
- Props: `size?: "sm" | "md" | "lg"`

### 3. `src/components/landing/LandingPage.tsx`
- Full landing page client or server component
- Sections:

**Navbar**
- Raxha logo (left)
- Links: Features, How It Works (anchor scroll)
- Button: "Sign In" → /login
- Button: "Start Writing" → /login (primary CTA)

**Hero**
- Headline: "Documents that feel like Word. Collaboration that feels simple."
- Subheadline: tagline + one line about auto-save & sharing
- CTAs: "Start Writing Free" + "Try Demo" (demo hint: alice@demo.com / password123)
- Dark gradient background matching editor shell

**Features grid (6 cards)**
- Word-style ribbon toolbar
- Auto-save every 3 seconds
- Share by email
- Rich text formatting
- Import .txt & .md files
- My Documents / Shared with Me dashboard

**How it works (3 steps)**
1. Sign in → 2. Write & format → 3. Share with anyone

**CTA band**
- "Ready to write?" + Start Writing button

**Footer**
- Raxha logo + tagline
- "Built by Muhammad Junaid"
- **SocialLinks component** (portfolio, LinkedIn, GitHub) — prominent
- Copyright © 2026 Raxha
- Links: Login, GitHub repo (optional)

### 4. `src/app/page.tsx`
- Render LandingPage instead of redirect

## Files to Update (user-facing text only)

Replace "Ajaia Docs" → "Raxha" in:
- `src/app/layout.tsx` — metadata title, description, OG tags
- `src/components/LoginForm.tsx` — title + subtitle
- `src/components/DashboardClient.tsx` — header h1
- `src/components/DocumentEditor.tsx` — any visible app name if present

Do NOT rename:
- npm package name (`ajaia-docs`)
- JWT cookie name (`ajaia_session`)
- API routes or database schema

## Styling Rules

- Use existing Tailwind 4 + CSS variables from `globals.css`
- Landing page: dark theme consistent with Word editor (`--word-app-bg`, `--word-accent`)
- Mobile responsive (stack features, hamburger optional — simple stack is fine)
- No new dependencies (no icon libraries — inline SVG only)
- Match quality of a real SaaS launch page

## SVG Icon References (inline, minimal paths)

**GitHub:** octocat silhouette (standard 24x24 viewBox)  
**LinkedIn:** "in" box logo (standard 24x24)  
**Portfolio/Globe:** simple globe or external-link icon for junaid-portfolio-mu.vercel.app

## Metadata (layout.tsx)

```ts
title: "Raxha — Collaborative Document Editor"
description: "Write together with Word-style formatting, auto-save, and simple email sharing. Built by Muhammad Junaid."
openGraph: {
  title: "Raxha",
  description: "...",
  type: "website",
}
```

## Acceptance Criteria

- [ ] Landing page live at `/` with hero, features, footer
- [ ] All "Ajaia Docs" user-facing text says "Raxha"
- [ ] Footer shows Muhammad Junaid + 3 social links WITH icons
- [ ] Social links open correct URLs in new tabs
- [ ] Login and dashboard still work
- [ ] No new npm packages
- [ ] Build passes (`npm run build` — skip if prisma lock issue, at least no TS errors)
- [ ] Responsive on mobile

Implement all of this now. Keep changes focused — do not refactor unrelated editor/ribbon code.
```

---

## 📋 Follow-Up Prompts (after main implementation)

### Prompt 2 — Favicon & OG Image
```
For Raxha, add:
1. SVG favicon at public/favicon.svg — "R" lettermark on #0078d4 blue, dark bg
2. Update layout.tsx icons metadata
3. Add twitter:card meta tags
Do not add image generation dependencies.
```

### Prompt 3 — Product Hunt / Social Copy
```
Write launch copy for Raxha (collaborative doc editor by Muhammad Junaid):
- Product Hunt tagline (60 chars)
- Product Hunt description (260 chars)
- LinkedIn launch post (150 words) mentioning portfolio github linkedin
- Tweet thread (5 tweets)
Founder links:
- https://junaid-portfolio-mu.vercel.app/
- https://www.linkedin.com/in/muhammad-junaid-56b051282/
- https://github.com/junaid1233
```

### Prompt 4 — Deploy & README
```
Update README.md for Raxha product launch:
- Product name Raxha (note: repo folder may still be ajaia-docs)
- Add founder section with social links and icons as markdown badges
- Add live demo URL placeholder
- Keep technical setup instructions
Links:
- Portfolio: https://junaid-portfolio-mu.vercel.app/
- LinkedIn: https://www.linkedin.com/in/muhammad-junaid-56b051282/
- GitHub: https://github.com/junaid1233
```

---

## 🔗 Social Links Quick Reference

```tsx
const SOCIAL_LINKS = [
  {
    label: "Muhammad Junaid Portfolio",
    href: "https://junaid-portfolio-mu.vercel.app/",
    icon: "portfolio", // globe icon
  },
  {
    label: "LinkedIn — Muhammad Junaid",
    href: "https://www.linkedin.com/in/muhammad-junaid-56b051282/",
    icon: "linkedin",
  },
  {
    label: "GitHub — junaid1233",
    href: "https://github.com/junaid1233",
    icon: "github",
  },
];
```

---

## 🎨 Brand Voice

| Do | Don't |
|----|-------|
| Professional, clean, confident | Corporate jargon |
| "Write together" / "Share in one click" | "Revolutionary" / "Disruptive" |
| Highlight Word-familiar UI | Compare negatively to competitors |
| Credit founder naturally in footer | Oversell or fake testimonials |

---

## 📦 Launch Checklist

- [ ] Run ONE-SHOT prompt in Cursor → implement landing + rebrand
- [ ] Deploy to Vercel → get live URL
- [ ] Add URL to README + portfolio site
- [ ] Post on LinkedIn with link to live demo
- [ ] Add Raxha to GitHub profile pinned repos
- [ ] Record 3-min demo video (login → edit → share)

---

*Raxha — by [Muhammad Junaid](https://junaid-portfolio-mu.vercel.app/) | [LinkedIn](https://www.linkedin.com/in/muhammad-junaid-56b051282/) | [GitHub](https://github.com/junaid1233)*
