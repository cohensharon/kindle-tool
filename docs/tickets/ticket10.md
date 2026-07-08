## Ticket 10: Improve user experience

### Goal

Polish the web app so users can easily understand outcomes after sending articles to Kindle, completing the MVP in `docs/PRD.md`.

### Scope

- Improve result display (`app/components/ResultsList.tsx` or equivalent):
  - Visual distinction between success and error per URL (color, icon, or badge).
  - Summary line: e.g. "2 of 3 articles sent successfully."
- Improve error display:
  - Form-level errors styled distinctly from field validation errors.
  - Per-URL error messages truncated or wrapped for long URLs/messages.
- Improve form UX (polish only — Ticket 8 owns baseline copy):
  - Refine sender whitelist message styling and readability.
  - Add optional helper text for Kindle email (e.g. "Usually your `@kindle.com` address from Amazon settings"). Guidance only; server accepts any valid email format.
  - Helper text for adding multiple URLs via the **+** button.
  - "Send another batch" or clear-results action after submission (include in this ticket).
- Responsive layout pass: spacing, readable max-width, touch-friendly **+** button and controls on mobile.
- Page metadata: title and description in `app/layout.tsx`.

### Out of Scope

- No new features (accounts, history, payments, bulk paste).
- No deployment (Tickets 11–12).
- No major design system or new dependencies unless clearly justified.

### Expected Files

- `app/page.tsx` — polished form and results flow
- `app/components/UrlInput.tsx` — responsive and touch-friendly controls
- `app/components/ResultsList.tsx` — styled results and batch summary
- `app/layout.tsx` — metadata
- `app/globals.css` — refined styles

### Acceptance Criteria

- User can tell at a glance which URLs succeeded and which failed.
- Batch summary is visible after a multi-URL submit.
- Form instructions and validation messages are clear and non-technical where possible.
- User can start a new batch via clear-results or "Send another batch" without refreshing the page.
- Page looks intentional on mobile and desktop (not unstyled defaults).
- Full PRD user flow works end-to-end: enter email → add URLs → submit → see per-URL status.
- TypeScript compiles.

### Tests

- Manual: submit 2 valid + 1 failing URL → summary and per-URL statuses are correct.
- Manual: resize to mobile width → form, **+** button, and results remain usable.
- Manual: complete happy path with a real article URL and Kindle email (if configured).
- Manual: confirm no secrets or SMTP details appear in the UI or browser network tab responses.
- Manual: use "Send another batch" / clear-results and submit again successfully.

### Cursor Prompt

Read `docs/PRD.md`, `docs/ENGINEERING.md`, and this ticket. Implement Ticket 10 only. Polish `UrlInput`, results display, whitelist copy, helper text, batch summary, clear-results flow, and responsive layout. Do not start deployment work.
