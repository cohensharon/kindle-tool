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
