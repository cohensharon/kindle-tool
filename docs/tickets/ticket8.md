## Ticket 8: Build user interface

### Goal

Create the single-page web UI described in `docs/PRD.md`: a form for Kindle email and article URLs.

### Scope

- Replace the placeholder home page with a usable form.
- Above the form, show an info message about Amazon sender approval. The **sender address** (`FROM_EMAIL`, configured server-side) must be on the user's **Approved Personal Document E-mail List** (Amazon → Manage Your Content and Devices → Preferences → Personal Document Settings). Clarify this is not about the Kindle address the user enters. Wording may reference "the sending address for this app" unless a public env var (e.g. `NEXT_PUBLIC_FROM_EMAIL`) is added later.
- Fields:
  - Kindle email (single-line input). Any valid email format is accepted (same as server); `@kindle.com` hint is optional polish in Ticket 10.
  - Article URLs: one URL per input field. Start with one field; a **+** button adds another. At least one URL field is always visible. Empty fields are ignored for validation and submit. Users may remove extra fields but cannot remove the last remaining field.
- Client-side validation before submit. Reuse `lib/validateKindleEmail.ts` and `lib/validateArticleUrls.ts` where possible; wrap in `lib/clientValidation.ts` if needed so web-specific messages do not surface CLI copy (e.g. "type done when finished").
- Disable submit while client validation fails.
- Basic layout: title, short instructions, form, submit button.
- Minimal styling that works on mobile and desktop (no external UI library required).
- Accessible labels and focus states for inputs.

### Out of Scope

- No API integration yet (submit handler may be a stub or `preventDefault` only).
- No loading or result display.
- No authentication or saved history.
- No bulk paste / split-on-newlines (MVP uses one URL per field; adding URLs via **+** only).

### Expected Files

- `app/page.tsx` — main form UI and page-level URL state
- `app/components/UrlInput.tsx` — URL input list with **+** button, per-field validation, and inline errors
- `app/layout.tsx` — page title/metadata if needed
- `app/globals.css` — base styles (create if missing)
- `lib/clientValidation.ts` (optional) — thin wrappers around existing `lib/` validators for client use

### Acceptance Criteria

- Page loads at `/` with a clear heading and instructions matching the PRD user flow.
- Sender whitelist info message is visible above the form and explains approved-sender requirement (not the destination Kindle address).
- User can enter a Kindle email and one or more URLs via dynamic input fields.
- **+** button adds another URL field; at least one URL field is always present.
- Invalid email or URLs show inline validation messages next to the relevant field without calling the API.
- Submit button is disabled when the form is invalid or empty.
- Layout is readable on a phone-width viewport.
- TypeScript compiles.

### Tests

- Manual: empty form → submit disabled or blocked with message.
- Manual: invalid email → inline error on email field.
- Manual: invalid URL in URL list → inline error next to that input field.
- Manual: **+** adds a field; removing extras works; last field cannot be removed.
- Manual: valid inputs → submit enabled (no API call required yet).

### Cursor Prompt

Read `docs/PRD.md`, `docs/ENGINEERING.md`, and this ticket. Implement Ticket 8 only. Build the single-page form with `UrlInput`, sender whitelist notice above the form, and client-side validation reusing `lib/` validators. Do not wire up the API yet. Keep styling simple and responsive.
