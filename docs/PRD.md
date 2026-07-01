# Kindle Tool PRD

## Goal

Turn existing CLI into a web app that accepts article URLs and a Kindle email, converts articles to EPUBs, and emails them to Kindle.

## User Flow

1. User opens web page.
2. User enters Kindle email.
3. User pastes one or more article URLs.
4. App validates URLs.
5. App generates EPUBs.
6. App emails EPUBs to Kindle.
7. User sees success/failure status.

## MVP

- Single-page UI
- API endpoint: POST /api/send-to-kindle
- Validate URLs
- Generate one EPUB per URL
- Email EPUBs
- Show result per URL

## Non-goals

- User accounts
- Payments
- Saved history
- Browser extension
