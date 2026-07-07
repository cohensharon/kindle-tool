# CLI Audit

Audit of the existing `article-to-kindle` CLI before Phase 1 refactoring. No application code was changed for this document.

## Summary

The CLI is a TypeScript Node program that interactively collects article URLs and a Kindle email address, then processes each URL through a shared pipeline: extract article → generate EPUB → validate EPUB → email attachment. Business logic is already split across services and a pipeline orchestrator under `src/`. The CLI handles prompts, batch iteration, and final reporting.

This aligns with `DECISIONS.md` (preserve CLI, reusable services) and `ARCHITECTURE.md` (orchestrator is `sendArticleToKindle`). Phase 1 tickets will likely **move** existing modules into `lib/` rather than extract logic that does not yet exist.

## Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Run CLI via `tsx src/cli.ts` (development) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled CLI from `dist/cli.js` |
| `npm run clean` | Delete `.epub` files in `generated/` via `scripts/cleanGenerated.ts` |

The package also exposes a bin entry: `article-to-kindle` → `dist/cli.js` (after build).

## User Flow

1. CLI starts (`src/cli.ts` → `main()`).
2. User is prompted for article URLs one at a time (`collectArticleUrls`).
3. Each URL is validated before being added to the list (`getArticleUrlValidationError`).
4. User types `done` to finish URL entry (at least one URL required).
5. User is prompted for a Kindle email address (`collectKindleEmail`).
6. Email is validated with a simple regex (`looksLikeEmail`).
7. CLI processes each URL sequentially (`processArticles` → `sendArticleToKindle`).
8. CLI prints a per-article report and success/failure summary (`printArticleReport`).

**Prompt order:** URLs first, then Kindle email. The web app PRD describes Kindle email first, then URLs. Behavior is the same; only collection order differs.

## Where Key Behaviors Live

### URL prompts

- **File:** `src/cli.ts`
- **Functions:** `collectArticleUrls`, `createPrompt`
- Uses Node `readline` to read from stdin. Loops until user types `done` with at least one valid URL.

### Kindle email prompt

- **File:** `src/cli.ts`
- **Function:** `collectKindleEmail`
- Loops until `looksLikeEmail` passes.

### Article URL validation

- **File:** `src/utils/validation.ts`
- **Function:** `getArticleUrlValidationError`
- Checks non-empty input, valid URL parse, and `http:` / `https:` protocol only.
- Called from CLI during URL collection (before URLs are stored).

Kindle email validation is separate (`looksLikeEmail` in the same file) and only used at prompt time, not inside the pipeline.

### EPUB generation

- **Orchestrator:** `src/pipeline/sendArticleToKindle.ts` calls generation after extraction.
- **Service:** `src/services/generateEpub.ts` — `generateEpub(article, outputDirectory?)`
- Writes EPUBs to `generated/` by default using `yazl` (ZIP-based EPUB 2 structure).
- **Post-generation check:** `src/utils/epubValidation.ts` — `validateGeneratedEpub(epubPath)`

### Email sending

- **Orchestrator:** `src/pipeline/sendArticleToKindle.ts` calls email after EPUB validation.
- **Service:** `src/services/sendEmail.ts` — `sendEmail({ to, subject, text, attachmentPath })`
- Uses `nodemailer` with SMTP settings from environment variables.

### Article extraction (upstream of EPUB)

- **Service:** `src/services/extractArticle.ts` — `extractArticle(url)`
- Fetches HTML via `fetch`, parses with `jsdom` + `@mozilla/readability`.

## Key Files and Functions

```
src/cli.ts                          Entrypoint; prompts, batch loop, report
src/pipeline/sendArticleToKindle.ts Per-article orchestrator
src/services/extractArticle.ts      Fetch and parse article HTML
src/services/generateEpub.ts        Build EPUB file
src/services/sendEmail.ts           SMTP send with attachment
src/utils/validation.ts             URL and email validation helpers
src/utils/epubValidation.ts         File existence/size/extension checks
src/utils/log.ts                    Colored console logging (chalk)
src/types/article.ts                ArticleInput, SendArticleResult, etc.
scripts/cleanGenerated.ts           Utility to remove generated EPUBs
```

### Orchestrator: `sendArticleToKindle`

**Input:** `ArticleInput` (`url`, `kindleEmail`), optional `SendArticleOptions` (`onProgress`, `epubOutputDirectory`).

**Steps:**

1. Optional progress callback: `fetching`
2. `extractArticle(url)`
3. `generateEpub(article, epubOutputDirectory)`
4. `validateGeneratedEpub(epubPath)`
5. Optional progress callbacks: `epubGenerated`, `sending`
6. `sendEmail(...)` with EPUB attachment
7. Returns `SendArticleResult` (`success: true | false` with typed fields)

Errors inside the orchestrator are caught and returned as `{ success: false, error }` rather than thrown.

### CLI batch handling: `processArticles`

Iterates URLs, calls `sendArticleToKindle` for each, collects results, prints report. Failures on one URL do not stop remaining URLs.

Note: `processArticles` wraps `sendArticleToKindle` in an extra `try/catch`, but the orchestrator already returns structured failures. The outer catch only matters if something unexpected throws.

## Dependencies

### Runtime (`package.json`)

| Package | Used for |
|---------|----------|
| `@mozilla/readability` | Extract main article content from HTML |
| `jsdom` | DOM parsing for Readability |
| `yazl` | EPUB (ZIP) file creation |
| `nodemailer` | SMTP email with attachment |
| `dotenv` | Load `.env` at CLI startup (`import "dotenv/config"`) |
| `chalk` | Terminal output styling |

### Dev

| Package | Used for |
|---------|----------|
| `typescript` | Compilation |
| `tsx` | Run TypeScript directly in development |
| `@types/node`, `@types/jsdom`, `@types/nodemailer`, `@types/yazl` | Type definitions |

### Node built-ins

`node:readline`, `node:fs`, `node:fs/promises`, `node:path`, `node:crypto`, `fetch` (Node 18+).

No test framework is installed yet.

## Environment Variables

Required for email sending (read in `src/services/sendEmail.ts`):

| Variable | Purpose |
|----------|---------|
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP port (465 enables TLS via `secure: true`) |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `FROM_EMAIL` | Sender address (must be approved in Kindle settings) |

Documented in `.env.example` and `README.md`.

**Doc drift:** `ENGINEERING.md` lists `SMTP_FROM`, but the code and `.env.example` use `FROM_EMAIL`. Align naming during a later ticket; do not change behavior silently.

Secrets are loaded via `dotenv/config` at CLI startup. For Next.js, local secrets should use `.env.local` per `ENGINEERING.md`.

## Error Handling

| Layer | Pattern |
|-------|---------|
| CLI prompts | Log error, re-prompt (validation loops) |
| `extractArticle` | Throws `Error` with message |
| `generateEpub` | Throws on filesystem/ZIP errors |
| `validateGeneratedEpub` | Throws with descriptive messages |
| `sendEmail` | Throws on missing env vars or SMTP failure |
| `sendArticleToKindle` | Catches errors, returns `{ success: false, error }` |
| CLI `main` | Top-level catch sets `process.exitCode = 1` |

This differs slightly from the future API goal in `ENGINEERING.md` (typed error categories for HTTP responses). The orchestrator’s `SendArticleResult` is a good basis for per-URL API results in `API_SPEC.md`.

## Generated Artifacts

- EPUB files written to `generated/` (gitignored).
- Filename derived from article title (`toSafeFileName` in `generateEpub.ts`).
- `npm run clean` removes `.epub` files from that directory.

## Observations for Upcoming Refactor

These are audit notes, not ticket scope:

1. **Services already exist** under `src/services/` with a pipeline orchestrator. Tickets 2–4 may relocate/rename modules into `lib/` more than introduce new logic.
2. **CLI is not yet a thin wrapper** — it owns prompts, batch iteration, and reporting. Ticket 5 target: keep interaction/reporting in CLI, delegate per-article work to `sendArticleToKindle`.
3. **Validation is in `src/utils/validation.ts`**, not a dedicated service module. Ticket 2 will extract or move this.
4. **No Kindle-specific email validation** beyond generic email shape. API spec calls for invalid Kindle email handling; current CLI does not distinguish `@kindle.com` from other addresses.
5. **Prompt order vs PRD** — harmless for MVP but worth matching in the web UI if desired.

## Risks

| Risk | Detail |
|------|--------|
| **Serverless timeouts** | Full pipeline (fetch + EPUB + SMTP) may exceed Vercel limits when exposed via API (`DECISIONS.md`). |
| **Fetch failures** | Sites may block server-side `fetch`, require auth, or lack Readability-compatible content. |
| **SMTP / Kindle config** | Email can succeed at SMTP layer but Kindle rejects unapproved `FROM_EMAIL` or unsupported attachments. |
| **EPUB validation threshold** | `epubValidation.ts` uses `minimumEpubSizeBytes = 1 * 1024` (1 KB) but the error message says “greater than 5KB”. Misleading for debugging. |
| **Env var naming** | `FROM_EMAIL` in code vs `SMTP_FROM` in `ENGINEERING.md` may cause setup mistakes. |
| **No automated tests** | Regressions during `src/` → `lib/` migration will rely on manual CLI runs unless tests are added later. |
| **Sequential processing** | CLI processes URLs one at a time; large batches may be slow in serverless contexts. |
| **EPUB spec depth** | Validation is lightweight (file exists, extension, size), not full EPUB spec compliance. |

## Manual Test Record

**Command used:**

```bash
printf 'https://example.com\ndone\ntest@kindle.com\n' | npm run dev
```

**Result:** Exit code 0. CLI collected one URL and email, processed `https://example.com`, and reported success:

```txt
✓ [1/1] Sent to Kindle: Example Domain (https://example.com)
✓ Done. Successful: 1 Failed: 0
```

EPUB written to `generated/example-domain.epub`.

**Prerequisites:** SMTP environment variables must be set (via `.env` or shell environment). This run used configured SMTP credentials present in the local environment.

**Also verified:** `npm run build` completes successfully (TypeScript compiles).

## Alignment with Project Docs

| Doc | Alignment |
|-----|-----------|
| `DECISIONS.md` | CLI preserved; services reusable; target is Next.js API calling same logic. No conflicts. |
| `ENGINEERING.md` | Current layout matches “Current” folder structure. Migration to `lib/` pending. `SMTP_FROM` naming differs from code. |
| `API_SPEC.md` | Future API should call `sendArticleToKindle` (or equivalent in `lib/`) per URL and map `SendArticleResult` to `{ status, message }` responses. |
