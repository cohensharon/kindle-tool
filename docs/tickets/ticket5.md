## Ticket 5: Refactor CLI to use services

### Goal

Make the CLI a thin wrapper around reusable services.

### Scope

- CLI handles prompts.
- Services handle validation, EPUB generation, and email sending.
- Remove duplicated business logic.

### Out of Scope

- No web API.
- No UI.
- No deployment changes.

### Expected Files

- CLI entry file
- lib/\* service files

### Acceptance Criteria

- CLI behavior is unchanged.
- CLI code is mostly orchestration.
- Services are reusable by future API route.
- TypeScript compiles.

### Tests

- Run full CLI flow.
- Verify EPUB is generated.
- Verify email is sent.
