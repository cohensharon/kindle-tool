## Ticket 11: Restructure API as Vercel Native Serverless Function

### Goal

Replace the Next.js App Router API route with a Vercel native Node.js serverless function so that the API handler is a first-class Vercel function rather than a Next.js route. The Next.js frontend stays unchanged.

### Background

The current API handler lives at `app/api/send-to-kindle/route.ts` and uses Next.js conventions (`NextResponse`). Vercel also supports native serverless functions placed in a top-level `/api/` directory, using `VercelRequest` / `VercelResponse` from `@vercel/node`. These run directly on Vercel's infrastructure without going through the Next.js runtime.

Moving to this format gives the API handler a clear separation from the Next.js page layer and aligns with Vercel's recommended serverless function pattern.

### Scope

- Install `@vercel/node` as a dev dependency.
- Create `api/send-to-kindle.ts` as a Vercel native function using `VercelRequest` / `VercelResponse`.
- Port all logic from `app/api/send-to-kindle/route.ts` into the new handler — the `lib/` services are unchanged.
- Delete `app/api/send-to-kindle/route.ts` (and its empty parent directories) to avoid a routing conflict at `/api/send-to-kindle`.
- Add a `vercel.json` that rewrites `/api/send-to-kindle` to the native function and routes everything else through Next.js.
- The frontend fetch in `app/page.tsx` already calls `/api/send-to-kindle` — no change needed there.

### Out of Scope

- No changes to `lib/` services.
- No changes to the Next.js frontend (`app/page.tsx`, components, styles).
- No deployment yet (that is Ticket 12).
- No retry logic, queuing, or other new features.

### Known Constraint: File System on Vercel

The EPUB pipeline writes temporary files to `generated/`. Vercel serverless functions have a read-only file system everywhere except `/tmp`. Before Ticket 12 (deploy), the EPUB generation service must write to `/tmp` instead of `generated/`. This ticket should document the constraint in a comment inside the handler but does not need to fix it — that fix belongs in Ticket 12.

### Expected Files

| File | Action |
|---|---|
| `api/send-to-kindle.ts` | Create — Vercel native function handler |
| `app/api/send-to-kindle/route.ts` | Delete |
| `app/api/send-to-kindle/` | Delete (empty after route removal) |
| `vercel.json` | Create — routing configuration |
| `package.json` | Add `@vercel/node` dev dependency |

### Handler Shape

```typescript
// api/send-to-kindle.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { validateSendToKindleRequest } from '../lib/requestValidation';
import { sendArticlesToKindle } from '../lib/sendArticlesToKindle';
import { mapSendArticleResultToApiResult } from '../lib/mapApiResults';
import type {
  SendToKindleSuccessResponse,
  SendToKindleErrorResponse,
} from '../lib/apiTypes';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  // NOTE: Vercel serverless functions only allow writes to /tmp.
  // The EPUB pipeline currently writes to generated/ — this must be
  // updated to use /tmp before deploying (see Ticket 12).

  const body = req.body; // Vercel parses JSON body automatically

  const validation = validateSendToKindleRequest(body);
  if (!validation.valid) {
    const errorBody: SendToKindleErrorResponse = { error: validation.error };
    return res.status(400).json(errorBody);
  }

  try {
    const results = await sendArticlesToKindle({
      kindleEmail: validation.request.kindleEmail,
      urls: validation.request.urls,
    });

    const responseBody: SendToKindleSuccessResponse = {
      results: results.map(mapSendArticleResultToApiResult),
    };

    return res.status(200).json(responseBody);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const errorBody: SendToKindleErrorResponse = {
      error: `Unexpected server error: ${message}`,
    };
    return res.status(500).json(errorBody);
  }
}
```

### `vercel.json` Shape

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

> If Vercel correctly resolves the native `/api/` functions and the Next.js app without conflict, `vercel.json` may not need explicit rewrites. Confirm during implementation and simplify if possible.

### Acceptance Criteria

- `GET /api/send-to-kindle` returns `405 Method Not Allowed`.
- `POST /api/send-to-kindle` with a valid body returns `200` with per-URL results.
- `POST /api/send-to-kindle` with an invalid body returns `400` with an error message.
- `app/api/send-to-kindle/route.ts` no longer exists.
- TypeScript compiles (`npx tsc --noEmit`).
- The web UI form still submits and receives results correctly when running `npm run dev:web`.

### Tests

- Manual: start `npm run dev:web`, submit valid URLs via the form, confirm results appear.
- Manual: `curl -X POST http://localhost:3000/api/send-to-kindle -H "Content-Type: application/json" -d '{"kindleEmail":"bad","urls":[]}'` → `400` error response.
- Manual: `curl -X GET http://localhost:3000/api/send-to-kindle` → `405`.

### Cursor Prompt

Read `docs/ENGINEERING.md`, `docs/ARCHITECTURE.md`, `docs/API_SPEC.md`, and this ticket. Install `@vercel/node`. Create `api/send-to-kindle.ts` as a Vercel native function handler, porting logic from the existing Next.js route. Delete `app/api/send-to-kindle/route.ts`. Add `vercel.json`. Do not change any `lib/` services or frontend files. TypeScript must compile.
