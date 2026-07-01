## Ticket 4: Extract email service

### Goal

Move email-to-Kindle logic into a reusable service.

### Scope

- Create reusable email sending function.
- Accept Kindle email and EPUB attachment.
- Use environment variables for credentials.
- Return structured success/failure result.

### Out of Scope

- Do not create API route.
- Do not create UI.
- Do not change EPUB generation.

### Expected Files

- lib/sendToKindleEmail.ts
- .env.example
- existing CLI file if needed

### Acceptance Criteria

- CLI can still send email to Kindle.
- Email credentials are not hardcoded.
- Missing env vars produce clear errors.
- Function has typed input/output.

### Tests

- Missing env vars
- Invalid Kindle email
- Successful send, manual if needed

### Cursor Prompt

Implement Ticket 4 only. Extract email sending into lib/sendToKindleEmail.ts. Use environment variables and update .env.example. Preserve CLI behavior.
