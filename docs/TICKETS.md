Kindle Tool – Implementation Plan

Overview

This document tracks the overall implementation roadmap. Each ticket has its own detailed specification in `docs/tickets/` (tickets 1–10).

The project should be completed one ticket at a time. Before starting a ticket, Cursor should read:

- docs/PRD.md
- docs/ARCHITECTURE.md
- docs/API_SPEC.md
- docs/ENGINEERING.md
- docs/DECISIONS.md
- The specific ticket file

Only the current ticket should be implemented unless explicitly instructed otherwise.

⸻

Phase 1 – Refactor Existing CLI

The goal of this phase is to separate business logic from the command-line interface while preserving existing functionality.

Ticket 1 – Audit Existing CLI

Goal

Understand and document the current CLI implementation before making changes.

Deliverable

- CLI audit document
- Current execution flow documented
- Dependencies identified

⸻

Ticket 2 – Extract URL Validation Service

Goal

Move article URL validation into a reusable service.

Deliverable

- Reusable validation module
- CLI updated to use the new service
- Validation tests completed

⸻

Ticket 3 – Extract EPUB Generation Service

Goal

Move article-to-EPUB generation into a reusable service.

Deliverable

- Reusable EPUB generation module
- CLI updated to use the new service
- Existing behavior preserved

⸻

Ticket 4 – Extract Email Service

Goal

Move Kindle email sending into a reusable service.

Deliverable

- Reusable email service
- Environment variables configured
- CLI updated to use the service

⸻

Ticket 5 – Refactor CLI

Goal

Convert the CLI into a thin orchestration layer that calls the reusable services.

Deliverable

- CLI only handles user interaction
- Business logic lives in lib/
- Existing CLI functionality unchanged

⸻

Phase 2 – Backend API

The goal of this phase is to expose the existing functionality through a web API.

Ticket 6 – Create API Endpoint

Goal

Create a POST /api/send-to-kindle endpoint.

Deliverable

- API route
- Request parsing
- Response formatting

⸻

Ticket 7 – API Validation & Error Handling

Goal

Add request validation and structured error handling.

Deliverable

- Request validation
- Consistent error responses
- Typed API responses

⸻

Phase 3 – Frontend

The goal of this phase is to create a simple web interface.

Ticket 8 – Build User Interface

Goal

Create a single-page form for Kindle email and article URLs.

Deliverable

- Responsive page with sender whitelist notice
- Dynamic URL inputs (`UrlInput` with **+** button)
- Client-side validation (reuse `lib/` validators)

⸻

Ticket 9 – Connect UI to API

Goal

Submit requests from the UI to the backend.

Deliverable

- API integration with page-level state
- Minimal per-URL results list
- Loading and form-level error handling

⸻

Ticket 10 – Improve User Experience

Goal

Polish the application.

Deliverable

- Styled results, batch summary, clear-results flow
- Refined helper copy and error display
- Responsive layout and touch-friendly controls

⸻

Phase 4 – Deployment

Ticket 11 – Environment Configuration

Goal

Document and configure required environment variables.

Deliverable

- .env.example
- Deployment documentation
- Local setup instructions

⸻

Ticket 12 – Deploy to Vercel

Goal

Deploy the application.

Deliverable

- Production deployment
- Environment variables configured
- End-to-end verification

⸻

Definition of Done

A ticket is complete when:

- Scope is fully implemented.
- Acceptance criteria are satisfied.
- TypeScript compiles successfully.
- Existing functionality is preserved.
- Tests (or documented manual verification) pass.
- Changes are reviewed before moving to the next ticket.

Each ticket’s detailed implementation, acceptance criteria, expected files, testing steps, and Cursor prompt live in its corresponding file under `docs/tickets/` when one exists (e.g. `docs/tickets/ticket1.md`).
