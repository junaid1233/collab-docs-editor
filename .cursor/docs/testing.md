# Testing — Ajaia Docs

## Test stack

- **Runner**: Vitest 3.x
- **Environment**: `node` (no jsdom)
- **Config**: `vitest.config.ts`

## Directory structure

| Type | Location | Naming |
|------|----------|--------|
| Unit tests | Co-located with source | `src/lib/validation.test.ts` |
| Config | Project root | `vitest.config.ts` |

No integration tests, no E2E, no `__tests__/` folder.

## Unit test template

```typescript
import { describe, expect, it } from "vitest";
import { isAllowedUpload, getFileExtension } from "./validation";

describe("file upload validation", () => {
  it("accepts txt and md extensions", () => {
    expect(isAllowedUpload("notes.txt")).toBe(true);
    expect(getFileExtension("README.MD")).toBe(".md");
  });

  it("rejects unsupported extensions", () => {
    expect(isAllowedUpload("document.docx")).toBe(false);
  });
});
```

## Access rule test pattern

Pure logic mirror (no DB) — from `validation.test.ts`:

```typescript
describe("document access rules", () => {
  function canAccess(
    document: { ownerId: string; sharedUserIds: string[] },
    userId: string
  ) {
    if (document.ownerId === userId) return true;
    return document.sharedUserIds.includes(userId);
  }

  it("allows owners and shared users", () => {
    const document = { ownerId: "alice", sharedUserIds: ["bob"] };
    expect(canAccess(document, "alice")).toBe(true);
    expect(canAccess(document, "bob")).toBe(true);
  });
});
```

For integration-level access tests, would need test DB + Prisma — not set up.

## What to test vs skip

| Test | Priority |
|------|----------|
| `validation.ts` pure functions | High |
| Zod schema edge cases | Medium |
| Access control logic | High |
| TipTap editor UI | Skip (client, no RTL) |
| API routes with supertest | Not configured |
| Prisma queries | Skip unless test DB added |

## Mocks

No jest.mock / vi.mock patterns in repo yet. Prefer testing pure functions over mocking Prisma.

If adding API route tests later:
- Mock `getSession` via dependency injection or `vi.mock("@/lib/auth")`
- Mock `prisma` with `vi.mock("@/lib/prisma")`

## Commands

```bash
npm test                                    # all tests once
npm run test:watch                          # watch mode
npx vitest run src/lib/validation.test.ts   # single file
```

## Coverage

Not configured. No coverage thresholds in CI.

## Adding a test for new lib code

1. Create `src/lib/<module>.test.ts` next to `<module>.ts`
2. Import from `./<module>` (relative OK within same folder)
3. Test pure functions; avoid Next.js server imports in unit tests
4. Run `npm test` before PR

## Current test file

`src/lib/validation.test.ts` — 6 tests:
- File extension validation
- Plain text → TipTap JSON
- Markdown → TipTap JSON
- Access rule logic (inline mirror)
