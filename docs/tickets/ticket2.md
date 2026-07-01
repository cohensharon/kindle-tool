## Ticket 2: Extract URL validation service

### Goal

Move article URL validation into a reusable service.

### Scope

- Create a reusable validation function.
- Support one URL and multiple URLs.
- Return structured validation results.
- Update CLI to use the new service if needed.

### Out of Scope

- Do not change EPUB generation.
- Do not change email sending.
- Do not create API route.

### Expected Files

- lib/validateArticleUrls.ts
- tests/validateArticleUrls.test.ts
- existing CLI file if needed

### Acceptance Criteria

- Valid article URLs pass.
- Invalid URLs fail with useful error messages.
- CLI behavior remains unchanged.
- TypeScript compiles.

### Tests

- Valid URL
- Invalid URL
- Empty string
- Non-HTTP URL
- Multiple URLs with mixed validity

### Cursor Prompt

Implement Ticket 2 only. Extract URL validation into lib/validateArticleUrls.ts with typed inputs and outputs. Add tests if the project has a test framework; otherwise document manual tests. Keep CLI behavior unchanged.
