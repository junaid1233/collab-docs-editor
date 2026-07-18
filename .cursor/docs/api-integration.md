# API Integration — Ajaia Docs

## Request chain

```
Client (DashboardClient / DocumentEditor)
    │ fetch("/api/documents", { credentials: "include" })
    ▼
middleware.ts — JWT cookie `ajaia_session`
    ▼
route.ts — getSession() → Zod → lib helpers → prisma
    ▼
NextResponse.json({ ... })
```

Server pages bypass API for initial SSR (`dashboard/page.tsx` calls `prisma` directly).

## Endpoints inventory

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/auth/login` | Public | Login, set cookie |
| POST/GET | `/api/auth/logout` | Session | Logout / check user |
| GET | `/api/documents` | Session | List owned + shared |
| POST | `/api/documents` | Session | Create document |
| GET/PATCH/DELETE | `/api/documents/[id]` | Session + access | CRUD single doc |
| GET/POST/DELETE | `/api/documents/[id]/share` | Owner only | Share management |
| POST | `/api/documents/upload` | Session | `.txt`/`.md` import |

## Add a new endpoint

### 1. Validation schema (`src/lib/validation.ts`)

```typescript
export const myActionSchema = z.object({
  field: z.string().min(1).max(200),
});
```

### 2. Route handler (`src/app/api/my-path/route.ts`)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { myActionSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = myActionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const result = await prisma.myModel.create({
      data: { ...parsed.data, userId: session.id },
    });

    return NextResponse.json({ result }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to perform action" }, { status: 500 });
  }
}
```

### 3. Client call

```typescript
const res = await fetch("/api/my-path", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ field: "value" }),
});
const data = await res.json();
if (!res.ok) setError(data.error ?? "Request failed");
```

## Document-scoped routes pattern

From `src/app/api/documents/[id]/route.ts`:

```typescript
const { id } = await params;
const access = await getDocumentAccess(id, session.id);
if (!access.canRead) {
  return NextResponse.json({ error: "Document not found" }, { status: 404 });
}
```

Owner-only operations use `access.isOwner` or `isDocumentOwner()`.

## Deserialization / body formats

| Type | Pattern | Example |
|------|---------|---------|
| JSON object | `await request.json()` + Zod | `{ title, content }` |
| Form upload | `await request.formData()` | `upload/route.ts` |
| Query param | `new URL(request.url).searchParams` | share DELETE `?userId=` |
| TipTap content | JSON **string** in DB | `JSON.stringify(editor.getJSON())` |

## POST/PUT body — document update

```typescript
// Client sends
{ title: "My Doc", content: "{\"type\":\"doc\",\"content\":[]}" }

// Server validates with updateDocumentSchema
// Stores content as string in Document.content
```

## Error handling contract

| Layer | Returns | Must never |
|-------|---------|------------|
| `getSession()` | `SessionUser \| null` | Throw on invalid JWT (returns null) |
| Access helpers | `{ canRead, canWrite, isOwner }` | Throw |
| Route handler | `NextResponse.json({ error }, status)` | Raw stack traces to client |
| Login | Generic `"Invalid email or password"` | Reveal which field failed |

## Share endpoint specifics

`POST /api/documents/[id]/share` body: `{ email: string }`

- 403 if not owner
- 404 if target user not found
- 409 if already shared
- 400 if sharing with self

## Upload endpoint

`POST /api/documents/upload` — `multipart/form-data`, field `file`

- Validates extension via `isAllowedUpload()` in `validation.ts`
- Converts to TipTap JSON via `plainTextToTipTapJson` / `markdownToTipTapJson`
- Creates new `Document` owned by session user
