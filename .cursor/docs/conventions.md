# Conventions — Ajaia Docs

## Naming

| Thing | File naming | Symbol naming | Example |
|-------|-------------|---------------|---------|
| API route handler | `route.ts` | `GET`, `POST`, … | `src/app/api/documents/route.ts` |
| Page (App Router) | `page.tsx` | `default function XPage` | `DashboardPage` |
| Layout | `layout.tsx` | `default function RootLayout` | `src/app/layout.tsx` |
| Client component | `PascalCase.tsx` | named export | `export function DashboardClient` |
| Server → client split | `*Client.tsx` suffix | props typed explicitly | `DashboardClient` |
| Lib module | `camelCase.ts` | named functions/types | `getDocumentAccess` |
| Zod schema | `*Schema` | camelCase | `shareDocumentSchema` |
| TipTap extension | descriptive `.ts` | `Extension.create({ name })` | `FontSize`, `CustomBulletList` |
| Test file | `<module>.test.ts` | `describe` blocks | `validation.test.ts` |
| Ribbon UI | `src/components/ribbon/` | `WordRibbon`, `RibbonGroup` | — |

## Imports

| Rule | Detail |
|------|--------|
| Alias | Always `@/` → `src/` (see `tsconfig.json` paths) |
| No barrels | No `index.ts` re-exports — import concrete files |
| Server/client boundary | `"use client"` as first line when using hooks, events, TipTap |
| Lib purity | `src/lib/**` must not import from `src/components/**` or `src/app/**` |

```typescript
// ✅
import { getSession } from "@/lib/auth";
import { WordRibbon } from "@/components/ribbon/WordRibbon";

// ❌
import { getSession } from "../../lib/auth";
```

## Framework patterns

### Server Component page (data fetch)

```typescript
// src/app/dashboard/page.tsx
export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const owned = await prisma.document.findMany({ where: { ownerId: session.id }, ... });
  return <DashboardClient userName={session.name} owned={...} shared={...} />;
}
```

### Client Component (API calls)

```typescript
"use client";
// src/components/DashboardClient.tsx
const response = await fetch("/api/documents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
```

### TipTap SSR guard

```typescript
// src/components/DocumentEditorLoader.tsx
"use client";
const DocumentEditor = dynamic(() => import("@/components/DocumentEditor").then(m => m.DocumentEditor), { ssr: false });
```

### Next.js 15 route params

```typescript
type RouteParams = { params: Promise<{ id: string }> };
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
}
```

## State pattern

- **No global store** (no Redux/Zustand)
- Server state: fetched in RSC pages, passed as props
- Client state: `useState` in `"use client"` components (`DocumentEditor`, `DashboardClient`)
- Editor content: TipTap internal state → serialized JSON string → `PATCH /api/documents/:id`

## Forbidden patterns

| ❌ | Why |
|----|-----|
| `prisma` in components | Leaks DB to client bundle / wrong layer |
| `any` type | Breaks strict TS guarantees |
| Skip `getSession()` in API | Middleware alone is not enough for explicit 401 JSON |
| Store secrets in repo | Use `.env` + `.env.example` |
| Edit generated `.next/` | Ephemeral build output |

## Linting

- ESLint: `eslint.config.mjs` extends `next/core-web-vitals`, `next/typescript`
- Run: `npm run lint`
- No custom annotation rules for coverage
