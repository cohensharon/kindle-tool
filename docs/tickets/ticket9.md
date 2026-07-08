## Ticket 9: Connect UI to API

### Goal

Wire the form from Ticket 8 to `POST /api/send-to-kindle` and display per-URL results per `docs/API_SPEC.md`.

### Scope

- On submit, run client validation first; only then POST `{ kindleEmail, urls }` to `/api/send-to-kindle`. API `400` responses are a fallback if client and server rules diverge.
- Lift URL array state to `app/page.tsx` (or parent client component). Page state holds `urls`, `kindleEmail`, submit enabled flag, loading flag, results, and form-level error.
- Parse URL inputs into a trimmed array (drop empty strings).
- Show loading state while the request is in flight (disable form, show "Sending…" or a spinner). No per-URL progress indicator in this ticket (batch may take several minutes).
- On success, render a minimal unstyled list of each result: URL, status (`success` / `error`), and message. Visual polish is Ticket 10.
- On top-level API errors (`400`, `500`), show a clear form-level error from `{ error: string }`.
- Handle network failures gracefully.
- Use `"use client"` only where needed; keep the page structure from Ticket 8.

### Out of Scope

- No UX polish beyond functional feedback (that is Ticket 10).
- No authentication.
- No retry logic or request queuing.

### Expected Files

- `app/page.tsx` — submit handler, fetch, lifted state, results area
- `app/components/UrlInput.tsx` — wire to page-level URL state (from Ticket 8)
- `app/components/ResultsList.tsx` (optional) — minimal per-URL result list
- `lib/clientValidation.ts` (if created in Ticket 8) — reuse before submit

### Acceptance Criteria

- Valid submission calls the API and displays per-URL results in a functional (unstyled) list.
- Mixed success/failure batches show each URL's status independently.
- Client validation blocks invalid submits before any network request.
- `400` validation errors appear as a visible form-level message.
- `500` and network errors show a user-friendly message without exposing secrets or stack traces.
- Form cannot be double-submitted while loading.
- TypeScript compiles.

### Tests

- Manual: submit valid email + URL → success result shown.
- Manual: submit with invalid email → client validation blocks submit (no request).
- Manual: submit URL that fails processing → error result for that URL only.
- Manual: stop dev server and submit → network error message shown.

Example API check (same payload the UI should send):

```bash
curl -s -X POST http://localhost:3000/api/send-to-kindle \
  -H "Content-Type: application/json" \
  -d '{"kindleEmail":"reader@kindle.com","urls":["https://example.com/article"]}' | jq
```

### Cursor Prompt

Read `docs/PRD.md`, `docs/API_SPEC.md`, `docs/ENGINEERING.md`, and this ticket. Implement Ticket 9 only. Connect the Ticket 8 form and `UrlInput` to `POST /api/send-to-kindle` with page-level state, client validation before fetch, loading state, and a minimal results list. Do not do Ticket 10 polish yet.
