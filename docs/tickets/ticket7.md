## Ticket 7: API validation and error handling

### Goal

Harden the API layer so request validation, response shapes, and error handling match `docs/API_SPEC.md` and `docs/ENGINEERING.md`.

### Context

Ticket 6 created the route, basic request validation, and per-URL result mapping. This ticket completes the API contract: typed responses, consistent error payloads, and tests for edge cases.

### Already done in Ticket 6

- `app/api/send-to-kindle/route.ts` — POST handler with JSON parsing
- `lib/requestValidation.ts` — Kindle email and URL validation
- `lib/mapApiResults.ts` — maps `SendArticleResult` to API result shape
- `tests/requestValidation.test.ts` — basic validation cases

Focus this ticket on gaps: typed exports, error message categorization, mapper tests, status-code documentation in `docs/API_SPEC.md`, and any validation edge cases not yet covered.

### Scope

- Define shared API request/response/error types in `lib/apiTypes.ts`.
- Ensure validation errors return `400` with a clear `{ error: string }` body.
- Ensure per-URL processing failures are returned in `{ results: [...] }` with `status: "error"` and a useful `message`.
- Map service-level failures to user-facing messages by inspecting error text prefixes from services:
  - Fetch/extract: messages containing `Failed to fetch article` or `Readability`
  - EPUB: messages containing `Failed to generate EPUB` or `EPUB validation failed`
  - Email: messages containing `SMTP`, `email`, or `Kindle email`
  - Fallback: return the original service message
- Keep route handler thin; move formatting logic into `lib/mapApiResults.ts` (or a small helper it calls).
- Document HTTP status code rules in `docs/API_SPEC.md` (see Acceptance Criteria).

### Out of Scope

- No UI changes.
- No authentication.
- No changes to core EPUB or email service behavior unless needed for clearer error messages.
- No deployment work.

### Expected Files

- `lib/apiTypes.ts`
- `lib/mapApiResults.ts` (extend error message mapping if needed)
- `lib/requestValidation.ts` (only if gaps remain vs API spec)
- `app/api/send-to-kindle/route.ts` (wire typed responses only)
- `docs/API_SPEC.md` (status code rules)
- `tests/mapApiResults.test.ts`
- `tests/requestValidation.test.ts` (extend if needed)

### Acceptance Criteria

- Valid request returns `{ results: [{ url, status: "success", message: "Sent to Kindle" }] }`.
- Invalid Kindle email returns `400` with `{ error: "Invalid Kindle email." }` (or equivalent documented message).
- Invalid URL returns `400` with a clear `{ error: ... }` message.
- Malformed JSON body returns `400` with `{ error: ... }`.
- Per-URL EPUB or email failures return `200` with `status: "error"` on the affected result (batch requests must not fail entirely when one URL fails).
- Unexpected handler failures return `500` with `{ error: ... }`.
- `docs/API_SPEC.md` documents when to use `400`, `200` with per-URL errors, and `500`.
- Response types are exported from `lib/apiTypes.ts` and used by the route handler.
- TypeScript compiles.
- Existing CLI behavior is unchanged.

### Tests

- Unit test `mapSendArticleResultToApiResult` for success and failed `SendArticleResult` inputs
- Unit test error categorization (fetch vs EPUB vs email prefixes)
- Missing Kindle email → `400`
- Empty URLs → `400`
- Invalid URL → `400`
- Malformed JSON body → `400`
- Manual: POST a URL that fails extraction; confirm `200` with per-URL `status: "error"` in `results`

### Manual Test

1. Run `npm run dev:web`.
2. POST a valid payload to `http://localhost:3000/api/send-to-kindle` and confirm the success shape.
3. POST invalid email, empty URLs, and invalid URL; confirm `400` responses.
4. POST a URL that fails extraction or EPUB generation; confirm per-URL error in `results`.

Example:

```bash
curl -s -X POST http://localhost:3000/api/send-to-kindle \
  -H "Content-Type: application/json" \
  -d '{"kindleEmail":"reader@kindle.com","urls":["https://example.com/article"]}' | jq
```

### Cursor Prompt

Read `docs/PRD.md`, `docs/API_SPEC.md`, `docs/ENGINEERING.md`, and this ticket. Implement Ticket 7 only. Focus on gaps not covered by Ticket 6: add `lib/apiTypes.ts`, extend error mapping in `lib/mapApiResults.ts`, add mapper tests, and update `docs/API_SPEC.md` with HTTP status rules. Do not build UI.
