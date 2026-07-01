# Architecture

## Stack

- Next.js app
- TypeScript
- Vercel deployment
- Serverless API route
- Existing CLI logic refactored into reusable services

## Current vs Target

### Current (CLI-only)

Business logic and the CLI live under `src/`:

- `src/cli.ts` — CLI entrypoint (prompts and user interaction)
- `src/pipeline/sendArticleToKindle.ts` — shared orchestrator
- `src/services/` — extract article, generate EPUB, send email
- `src/types/` — shared input/output types
- `src/utils/` — validation, EPUB checks, logging
- `scripts/` — utility scripts (e.g. cleanup)

There is no `app/` or `lib/` directory yet.

### Target (CLI + web app)

- `app/page.tsx` — single-page UI
- `app/api/send-to-kindle/route.ts` — POST endpoint
- `lib/` — reusable business logic (migrated from `src/services/`, `src/pipeline/`, and related utils/types)
- `src/cli.ts` or `cli/` — thin CLI wrapper that calls the same orchestrator as the API

### Migration

As tickets progress, move reusable logic from `src/` into `lib/` without changing behavior. The CLI and API should both call the same orchestrator; do not re-wire the pipeline separately in each entrypoint.

## Shared Orchestrator

`sendArticleToKindle` is the single integration point for CLI and API.

- **Current location:** `src/pipeline/sendArticleToKindle.ts`
- **Target location:** `lib/sendArticleToKindle.ts`

It coordinates the full per-article flow:

1. Fetch and extract article content
2. Generate EPUB
3. Validate generated EPUB
4. Email EPUB to Kindle
5. Return a typed `SendArticleResult`

CLI and API route handlers should call this function (or a thin wrapper around it for batch URLs). Individual services remain composable for tests and future reuse, but production entrypoints should not duplicate this sequence.

## Modules

### Orchestration

- `lib/sendArticleToKindle.ts` — end-to-end flow for one article (from `src/pipeline/sendArticleToKindle.ts`)

### Services

- `lib/validateArticleUrls.ts` — URL validation (from `src/utils/validation.ts`)
- `lib/extractArticle.ts` — fetch and parse article HTML (from `src/services/extractArticle.ts`)
- `lib/generateEpub.ts` — build Kindle-compatible EPUB (from `src/services/generateEpub.ts`)
- `lib/sendEmail.ts` — SMTP delivery with EPUB attachment (from `src/services/sendEmail.ts`)

### Supporting

- `lib/epubValidation.ts` — validate generated EPUB before send (from `src/utils/epubValidation.ts`)
- `lib/types/article.ts` — `ArticleInput`, `SendArticleResult`, and related types (from `src/types/article.ts`)

### Web

- `app/api/send-to-kindle/route.ts` — parse request, call orchestrator per URL, return structured results
- `app/page.tsx` — form for Kindle email and article URLs

## Data Flow

```
UI form
  → POST /api/send-to-kindle
  → validate request (Kindle email + URLs)
  → for each URL: sendArticleToKindle()
      → extractArticle
      → generateEpub
      → validate EPUB
      → sendEmail
  → return per-URL status
```

CLI follows the same orchestrator path after collecting Kindle email and URLs from prompts.
