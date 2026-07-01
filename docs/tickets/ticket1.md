## Ticket 1: Audit existing CLI

### Goal

Understand the current CLI flow before refactoring.

### Scope

- Identify where URLs are prompted.
- Identify where Kindle email is prompted.
- Identify where article URLs are validated.
- Identify where EPUBs are generated.
- Identify where emails are sent.
- Document current commands and behavior.

### Out of Scope

- Do not refactor code.
- Do not create API routes.
- Do not create UI.

### Expected Files

- docs/CLI_AUDIT.md

### Acceptance Criteria

- Existing CLI flow is documented.
- Key functions/files are identified.
- Known dependencies are listed.
- Risks are noted.

### Tests

- Run the current CLI once successfully.
- Record command used.

### Cursor Prompt

Read the existing CLI code and project docs. Complete Ticket 1 only. Create docs/CLI_AUDIT.md documenting the current CLI flow, key files, dependencies, commands, and risks. Do not modify application code.
