# Decisions

## 2026-07-01 — Use Next.js for web app

### Decision

Use Next.js with API routes instead of a separate Express backend.

### Reason

- Easier deployment to Vercel.
- One repo for frontend and backend.
- Simple MVP architecture.
- API route is enough for this use case.

### Alternatives Considered

- Express backend + separate frontend
- Serverless function only
- CLI-only tool

### Tradeoffs

- Serverless runtime may limit long-running EPUB generation.
- Some EPUB or article-fetch libraries may require extra deployment configuration.

## 2026-07-08 — Move API handler to Vercel native serverless function (supersedes above)

### Decision

Replace the Next.js App Router API route (`app/api/send-to-kindle/route.ts`) with a Vercel native Node.js function (`api/send-to-kindle.ts`) using `VercelRequest` / `VercelResponse` from `@vercel/node`.

### Reason

- Cleaner separation between the Next.js frontend and the API layer.
- Aligns with Vercel's native serverless function model.
- The `lib/` service layer is unchanged — only the handler adapter changes.

### Alternatives Considered

- Keep the Next.js App Router route (simpler, but ties the API to the Next.js runtime)

### Tradeoffs

- Local development requires `vercel dev` instead of `next dev` to serve both the Next.js pages and the native function together.
- The Vercel CLI must be installed as a dev dependency.

## 2026-07-01 — Preserve CLI while adding web app

### Decision

Refactor the CLI into reusable services instead of replacing it.

### Reason

- Reduces risk.
- Existing working behavior remains available.
- Same services can power both CLI and API.

### Tradeoffs

- Slightly more upfront refactoring.
- Need to maintain both CLI and web entrypoints.

## 2026-07-01 — Use service layer in `lib/`

### Decision

Move validation, EPUB generation, and email sending into `lib/`.

### Reason

- Keeps API routes thin.
- Makes logic reusable.
- Easier to test.
- Cleaner separation between interface and business logic.

### Tradeoffs

- More files than a small script.
- Requires clearer types and boundaries.
