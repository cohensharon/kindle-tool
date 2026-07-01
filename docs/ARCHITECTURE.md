# Architecture

## Stack

- Next.js app
- TypeScript
- Vercel deployment
- Serverless API route
- Existing CLI logic refactored into reusable services

## Modules

- `lib/validateArticleUrl.ts`
- `lib/generateEpub.ts`
- `lib/sendEmail.ts`
- `app/api/send-to-kindle/route.ts`
- `app/page.tsx`

## Data Flow

UI form → API route → validate URLs → generate EPUBs → send email → return status
