# article-to-kindle

`article-to-kindle` converts article URLs to EPUBs and sends them to a Kindle email address. It ships as both a **web app** (Next.js) and a **CLI** (Node.js). Both use the same underlying pipeline.

## Web App

A single-page form where you enter your Kindle email and one or more article URLs. The app converts each article to an EPUB and emails it to your device.

**Live demo:** [https://kindle-tool-jmpbbwx10-cohensharon1995-8830s-projects.vercel.app/](https://kindle-tool-jmpbbwx10-cohensharon1995-8830s-projects.vercel.app/)

### Run the web app locally

Install dependencies:

```bash
npm install
```

Create a `.env.local` file for Next.js:

```bash
cp .env.example .env.local
```

Fill in your SMTP credentials and sending address (see [Environment Variables](#environment-variables) below).

Start the development server:

```bash
npm run dev:web
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Web app commands

| Command | Description |
|---|---|
| `npm run dev:web` | Start the Next.js development server |
| `npm run build:web` | Build the Next.js app for production |
| `npm run start:web` | Start the built Next.js app |

## CLI

The original command-line interface. Prompts for article URLs one at a time, then sends each EPUB to the Kindle address you provide.

### Run the CLI locally

Install dependencies:

```bash
npm install
```

Create a `.env` file for the CLI:

```bash
cp .env.example .env
```

Fill in your SMTP credentials and sending address.

Start the CLI:

```bash
npm run dev
```

Enter article URLs one at a time. Type `done` when finished, then enter your Kindle email address.

Example session:

```txt
Paste an article URL, or type "done":
> https://example.com/article-1

Paste another article URL, or type "done":
> https://example.com/article-2

Paste another article URL, or type "done":
> done

Enter Kindle email address:
> your-name@kindle.com

Processing 2 article(s)...
[1/2] Processing https://example.com/article-1
[2/2] Processing https://example.com/article-2

Report:
[1/2] Sent to Kindle: Article Title 1 (https://example.com/article-1)
[2/2] Failed: Could not fetch article (https://example.com/article-2)

Done. Successful: 1 Failed: 1
```

### CLI commands

| Command | Description |
|---|---|
| `npm run dev` | Run the CLI with `tsx` (no build step) |
| `npm run build` | Compile TypeScript CLI into `dist/` |
| `npm start` | Run the compiled CLI from `dist/` |
| `npm run clean` | Delete generated `.epub` files from `generated/` |

## Environment Variables

Both the web app and the CLI share the same SMTP variables. The web app reads from `.env.local`; the CLI reads from `.env`.

| Variable | Required | Description |
|---|---|---|
| `SMTP_HOST` | Yes | SMTP server hostname (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | Yes | SMTP port — usually `587` (TLS) or `465` (SSL) |
| `SMTP_USER` | Yes | SMTP username |
| `SMTP_PASS` | Yes | SMTP password or app password |
| `FROM_EMAIL` | Yes | Sender address — must be approved in Amazon Kindle settings |
| `NEXT_PUBLIC_FROM_EMAIL` | Web only | Same value as `FROM_EMAIL`. Displayed in the UI so users know which address to whitelist on Amazon. |

Example `.env` / `.env.local`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=you@gmail.com
NEXT_PUBLIC_FROM_EMAIL=you@gmail.com
```

> **Important:** `FROM_EMAIL` must be on your **Approved Personal Document E-mail List** in Amazon before Kindle will accept the emailed EPUBs. Add it at *Manage Your Content and Devices → Preferences → Personal Document Settings*.

> **Gmail note:** Use an [App Password](https://support.google.com/accounts/answer/185833) rather than your normal account password if you have 2-Step Verification enabled.

## Tests

```bash
npm test
```

Runs unit tests for URL validation, EPUB generation, email sending, request validation, and API result mapping.

## Generated Files

EPUB files are written to `generated/`. This directory is ignored by git.

To remove them:

```bash
npm run clean
```

## Troubleshooting

### Kindle address not found or document never appears

Confirm `FROM_EMAIL` is on your Approved Personal Document E-mail List. This is separate from your main Amazon address. Find it at *Manage Your Content and Devices → Preferences → Personal Document Settings*.

### SMTP authentication error

Check `SMTP_USER` and `SMTP_PASS`. Gmail and many other providers require an **app password** rather than your normal login password when 2FA is enabled.

### Article extraction failed

Some pages block server-side fetch requests, require JavaScript rendering, or contain no readable article content. Confirm the URL is publicly accessible and try a different article.

### EPUB sent but never arrived on Kindle

Check that the EPUB exists in `generated/` and is larger than 5 KB, verify that your SMTP provider accepted the message without error, and confirm the Kindle email address is correct.
