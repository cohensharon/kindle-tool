## Ticket 6: Create POST API endpoint

### Goal

Create web API endpoint for sending articles to Kindle.

### Scope

- Create POST /api/send-to-kindle.
- Accept kindleEmail and urls.
- Validate request body.
- Call existing services.
- Return per-URL results.

### Out of Scope

- No UI.
- No authentication.
- No database.

### Expected Files

- app/api/send-to-kindle/route.ts
- lib/requestValidation.ts if needed

### Acceptance Criteria

- Valid request returns structured success response.
- Invalid request returns 400.
- Internal failure returns structured error.
- Secrets are server-only.

### Tests

- Valid request
- Missing Kindle email
- Empty URLs
- Invalid URL
