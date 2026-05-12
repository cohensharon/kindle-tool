# article-to-kindle

`article-to-kindle` is a TypeScript Node CLI that takes one or more article URLs, extracts readable article content, generates one EPUB per article, and emails each EPUB to a Kindle email address.

## MVP Scope

This MVP supports a single local CLI workflow:

- Prompt for article URLs one at a time.
- Validate that each URL is HTTP or HTTPS.
- Prompt for a Kindle email address.
- Extract readable article content with Mozilla Readability.
- Generate a separate EPUB file for each article in `generated/`.
- Validate generated EPUB files with lightweight checks.
- Email each EPUB as an attachment through SMTP.
- Continue processing remaining URLs if one article fails.
- Print a one-line report for each article at the end.

## Commands

- `npm install`: install project dependencies.
- `npm run dev`: run the TypeScript CLI locally.
- `npm run build`: compile TypeScript into `dist/`.
- `npm start`: run the compiled CLI from `dist/`.
- `npm run clean`: delete generated `.epub` files from `generated/`.

## Not Included Yet

This MVP intentionally does not include:

- A web server or Express API.
- A frontend.
- User accounts or authentication.
- A database.
- A background queue.
- A Chrome extension.
- Retry logic.
- EPUB spec validation beyond lightweight file checks.

## Setup

Install dependencies:

```bash
npm install
```

Create a local `.env` file:

```bash
cp .env.example .env
```

Fill in your SMTP settings in `.env`.

Important: the `FROM_EMAIL` sender address must be approved in your Amazon Kindle settings before Kindle will accept emailed EPUB attachments.

## Environment Variables

Required variables:

- `SMTP_HOST`: SMTP server hostname.
- `SMTP_PORT`: SMTP server port, usually `587` or `465`.
- `SMTP_USER`: SMTP username.
- `SMTP_PASS`: SMTP password or app password.
- `FROM_EMAIL`: sender email address approved in Amazon Kindle settings.

Example:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
FROM_EMAIL=approved-sender@example.com
```

## Run The CLI

Start the CLI in development:

```bash
npm run dev
```

Enter article URLs one at a time. Type `done` when finished, then enter your Kindle email address.

Example flow:

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

## Generated Files

EPUB files are written to `generated/`. This directory is ignored by git.

To remove generated EPUB files:

```bash
npm run clean
```

## Troubleshooting

### Kindle Sender Email Not Approved

If the email sends successfully but the document never appears on Kindle, confirm that `FROM_EMAIL` is approved in your Amazon Kindle settings.

### SMTP Auth Failure

If you see an SMTP authentication error, check `SMTP_USER`, `SMTP_PASS`, and whether your provider requires an app password instead of your normal account password.

### Article Extraction Failed

Some pages block fetch requests, require JavaScript, or do not contain readable article content. Try another article URL and confirm the URL is publicly reachable.

### EPUB Generated But Not Delivered

Check that the EPUB file exists in `generated/`, the file is larger than 5KB, the SMTP provider accepted the message, and the Kindle email address is correct.

## Future Improvements

- Main article image as cover image
- Express API wrapper.
- Chrome extension.
- Article queue.
- Retry logic.
- Daily digest mode.
- User accounts.
- Database-backed article history.
