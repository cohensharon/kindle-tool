# Engineering Guidelines

## Project Principles

- Preserve existing CLI behavior.
- Prefer small, focused changes.
- Keep business logic reusable between CLI and web API.
- Avoid adding dependencies unless they clearly reduce complexity.

## Folder Structure

- `app/` — Next.js UI and API routes
- `app/api/` — server-side API endpoints
- `lib/` — reusable business logic
- `cli/` or `scripts/` — CLI entrypoints
- `docs/` — project documentation
- `tickets/` — implementation tickets
- `tests/` — test files

## Architecture Rules

- API route handlers should orchestrate only.
- Business logic belongs in `lib/`.
- CLI should be a thin wrapper around reusable services.
- Services should have typed inputs and outputs.
- Avoid duplicating logic between CLI and API.

## Error Handling

- Return structured errors from services.
- Do not throw raw library errors directly to users.
- API responses should distinguish:
  - validation errors
  - EPUB generation errors
  - email sending errors
  - unexpected server errors

## Environment Variables

- Secrets must never be committed.
- Local secrets go in `.env.local`.
- Required variables should be documented in `.env.example`.

Expected variables:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

## Testing

- Add unit tests for pure logic.
- Use manual tests for email sending if automated tests are impractical.
- Every ticket should include a test plan.

## Definition of Done

A ticket is done when:

- Acceptance criteria are met.
- TypeScript compiles.
- Existing CLI still works if touched.
- Relevant tests or manual test notes are included.
- Changed files are summarized.
