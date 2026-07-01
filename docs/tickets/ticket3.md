## Ticket 3: Extract EPUB generation service

### Goal

Move article-to-EPUB generation into a reusable service.

### Scope

- Create a reusable EPUB generation function.
- Accept a validated URL.
- Return EPUB file path or buffer.
- Preserve current EPUB output behavior.

### Out of Scope

- Do not change email sending.
- Do not create API route.
- Do not change UI.

### Expected Files

- lib/generateEpub.ts
- tests/generateEpub.test.ts if practical
- existing CLI file if needed

### Acceptance Criteria

- Existing CLI still generates EPUBs.
- Service can be called independently.
- Errors are structured.
- Temporary files are handled safely.

### Tests

- Generate EPUB from a known valid article URL.
- Handle failed article fetch.
- Handle invalid input gracefully.

### Cursor Prompt

Implement Ticket 3 only. Extract EPUB generation into lib/generateEpub.ts. Preserve existing CLI behavior. Do not modify email logic except to adapt to the new function output if necessary.
