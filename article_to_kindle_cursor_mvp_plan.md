# Article-to-Kindle CLI MVP — Cursor Agent Build Plan

## MVP Goal

Build a TypeScript Node CLI app that lets the user:

1. Start the program from the terminal.
2. Enter article URLs one by one.
3. Type `done` when finished adding URLs.
4. Enter a Kindle email address.
5. For each article URL:
   - Fetch the page.
   - Extract readable article content.
   - Generate a separate `.epub` file.
   - Email that EPUB as an attachment to the Kindle email.
6. Print success or error for each article.

Each article should become its **own separate EPUB**, not one combined digest.

---

## Suggested Final UX

```bash
npm run start
```

Example flow:

```txt
Welcome to Article to Kindle.

Paste an article URL, or type "done" when finished:
> https://example.com/article-1

Paste another article URL, or type "done":
> https://example.com/article-2

Paste another article URL, or type "done":
> done

Enter Kindle email address:
> myname_123@kindle.com

Processing 2 article(s)...

[1/2] Fetching: https://example.com/article-1
✅ Sent: Article Title 1

[2/2] Fetching: https://example.com/article-2
✅ Sent: Article Title 2

Done.
```

---

# Step 1 — Initialize the TypeScript CLI Project

## Cursor Prompt

```txt
Create a minimal TypeScript Node CLI project for an app called article-to-kindle.

Requirements:
- Use TypeScript.
- Add a src/ folder.
- Add src/cli.ts as the entry point.
- Add package scripts:
  - "dev" to run the CLI in development
  - "build" to compile TypeScript
  - "start" to run the built CLI
- Add a basic tsconfig.json.
- Add basic project structure:
  src/
    cli.ts
    pipeline/
    services/
    types/
    utils/
- In cli.ts, print "Article to Kindle CLI is running."
- Do not implement article extraction, EPUB generation, or email sending yet.
```

## Verify When Done

Run:

```bash
npm install
npm run dev
```

Expected result:

```txt
Article to Kindle CLI is running.
```

Also verify:

```bash
npm run build
```

Should complete without TypeScript errors.

---

# Step 2 — Build the Interactive CLI Input Flow

## Cursor Prompt

```txt
Implement the interactive CLI flow in src/cli.ts.

Requirements:
- Prompt the user to enter article URLs one at a time.
- The user can type "done" to finish adding URLs.
- Validate that at least one URL was entered.
- After URLs are collected, prompt the user for a Kindle email address.
- Validate that the email looks like an email address.
- For now, do not process articles.
- Just print the collected URLs and Kindle email back to the user.
- Keep the code clean and readable.
- If helpful, create utility functions in src/utils/.
```

## Verify When Done

Run:

```bash
npm run dev
```

Test this flow:

```txt
Paste an article URL, or type "done":
> https://example.com/a

Paste another article URL, or type "done":
> https://example.com/b

Paste another article URL, or type "done":
> done

Enter Kindle email address:
> test@kindle.com
```

Expected output should show:

```txt
URLs:
- https://example.com/a
- https://example.com/b

Kindle email:
test@kindle.com
```

Also test edge cases:

```txt
done
```

before entering URLs should show an error and keep prompting.

Invalid email should also show an error and re-prompt.

---

# Step 3 — Add Article Types and Stub Pipeline

## Cursor Prompt

```txt
Create the core type definitions and a stub article processing pipeline.

Requirements:
- Add src/types/article.ts with types for:
  - ArticleInput
  - ExtractedArticle
  - SendArticleResult
- Add src/pipeline/sendArticleToKindle.ts.
- Export a function called sendArticleToKindle(input).
- For now, this function should NOT fetch or send anything.
- It should accept:
  - url
  - kindleEmail
- It should return a fake successful SendArticleResult.
- Update cli.ts so that after collecting URLs and Kindle email, it loops over the URLs and calls sendArticleToKindle for each URL.
- Print success/error per article.
```

## Verify When Done

Run:

```bash
npm run dev
```

Enter 2 URLs.

Expected output should look similar to:

```txt
Processing 2 article(s)...

[1/2] Processing https://example.com/a
✅ Sent: Fake Article Title

[2/2] Processing https://example.com/b
✅ Sent: Fake Article Title

Done.
```

This verifies the CLI orchestration works before adding real integrations.

---

# Step 4 — Implement Article Fetching and Readable Content Extraction

## Cursor Prompt

```txt
Implement article extraction.

Requirements:
- Create src/services/extractArticle.ts.
- Use fetch to load the article HTML from a URL.
- Use jsdom + Mozilla Readability to extract readable article content.
- Return an ExtractedArticle object with:
  - title
  - byline if available
  - contentHtml
  - textContent if available
  - sourceUrl
- Add clear errors for:
  - failed network request
  - non-OK HTTP response
  - Readability unable to parse article
- Update sendArticleToKindle so it calls extractArticle.
- For now, do not generate EPUB or email.
- Return the extracted article title in the result.
```

## Verify When Done

Install any needed packages, then run:

```bash
npm run dev
```

Test with a simple public article URL.

Expected:

```txt
✅ Sent: Real Article Title
```

Even though it is not actually sending yet.

Also verify errors:

- Bad URL should fail cleanly.
- Non-article page should fail cleanly.
- The CLI should keep processing the remaining URLs if one URL fails.

---

# Step 5 — Generate One EPUB Per Article

## Cursor Prompt

```txt
Implement EPUB generation.

Requirements:
- Create src/services/generateEpub.ts.
- It should accept an ExtractedArticle.
- It should generate one separate .epub file for that article.
- Store generated EPUB files in a local generated/ directory.
- Use a safe filename based on the article title.
- Include:
  - title
  - byline if available
  - source URL
  - article content
- Return the path to the generated EPUB file.
- Update sendArticleToKindle so it:
  1. extracts the article
  2. generates the EPUB
  3. returns success with title and epub file path
- Do not email yet.
```

## Verify When Done

Run:

```bash
npm run dev
```

Enter 1–2 article URLs.

Expected:

```txt
✅ Sent: Article Title
EPUB generated at: generated/article-title.epub
```

Then manually verify:

```bash
ls generated
```

You should see one `.epub` per article.

Optional check:

- Open the EPUB in Apple Books, Calibre, or another EPUB reader.
- Confirm the article title and content are readable.

---

# Step 6 — Add Email Sending Service

## Cursor Prompt

```txt
Implement email sending for Kindle delivery.

Requirements:
- Create src/services/sendEmail.ts.
- Use nodemailer.
- Read SMTP configuration from environment variables:
  - SMTP_HOST
  - SMTP_PORT
  - SMTP_USER
  - SMTP_PASS
  - FROM_EMAIL
- sendEmail should accept:
  - to
  - subject
  - text body
  - attachment path
- It should send the EPUB file as an attachment.
- Add helpful errors if SMTP config is missing.
- Do not hardcode credentials.
- Add a .env.example file documenting required variables.
- Update README or comments with a note that the sender email must be approved in Amazon Kindle settings.
```

## Verify When Done

Before running, create a local `.env` file:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
FROM_EMAIL=approved-sender@example.com
```

Run:

```bash
npm run dev
```

Expected:

- No TypeScript errors.
- If SMTP variables are missing, app shows a clear config error.
- If SMTP variables are present, the app attempts to send the email.

Important manual check:

- Make sure `FROM_EMAIL` is approved in Amazon Kindle settings.
- Use your actual Kindle email as the destination.

---

# Step 7 — Connect Full Pipeline

## Cursor Prompt

```txt
Connect the full article-to-Kindle pipeline.

Requirements:
- Update sendArticleToKindle so it does the full flow:
  1. Extract article from URL.
  2. Generate a separate EPUB for that article.
  3. Email that EPUB to the Kindle email.
  4. Return a SendArticleResult with:
     - success boolean
     - url
     - title if available
     - epubPath if generated
     - error message if failed
- Update cli.ts so it prints clean progress:
  - [1/3] Fetching...
  - Generated EPUB...
  - Sending to Kindle...
  - success/error
- If one URL fails, continue processing the rest.
- Do not add database, server, frontend, auth, queue, or Chrome extension.
```

## Verify When Done

Run:

```bash
npm run dev
```

Test with 2–3 URLs.

Expected:

```txt
Processing 3 article(s)...

[1/3] https://example.com/article-1
✅ Sent to Kindle: Article Title 1

[2/3] https://bad-url.com
❌ Failed: Could not fetch article

[3/3] https://example.com/article-3
✅ Sent to Kindle: Article Title 3

Done.
Successful: 2
Failed: 1
```

Also verify:

- `generated/` contains separate EPUB files.
- Kindle receives one document per successful article.
- Failed article does not stop the whole run.

---

# Step 8 — Add README and Cleanup

## Cursor Prompt

```txt
Add a clear README for this MVP.

Include:
- What the app does.
- MVP scope.
- What it intentionally does not do yet.
- Setup instructions.
- Environment variables.
- How to run the CLI.
- Example CLI flow.
- Troubleshooting:
  - Kindle sender email not approved.
  - SMTP auth failure.
  - Article extraction failed.
  - EPUB generated but not delivered.
- Future improvements:
  - Express API wrapper.
  - Chrome extension.
  - Article queue.
  - Retry logic.
  - Daily digest mode.
  - User accounts.
  - Database-backed article history.
```

## Verify When Done

Open README and confirm:

- A new developer could run the project from scratch.
- MVP scope is clearly described.
- Future features are listed but not implemented.

Run final checks:

```bash
npm run build
npm run dev
```

---

# Final MVP Acceptance Criteria

The MVP is complete when:

- The app runs from the terminal.
- The user can enter multiple article URLs.
- The user can type `done`.
- The user can enter a Kindle email.
- Each article is extracted.
- Each article becomes its own EPUB.
- Each EPUB is emailed separately to the Kindle email.
- The CLI prints success/error per article.
- One failure does not stop the whole batch.
- The code is split into clean services.
- There is no server, frontend, database, auth, queue, or Chrome extension yet.

---

# Recommended Architecture After MVP

Keep the pipeline reusable:

```txt
CLI
  ↓
sendArticleToKindle()
  ↓
extractArticle()
  ↓
generateEpub()
  ↓
sendEmail()
```

Later you can add:

```txt
Express API
  ↓
same sendArticleToKindle()
```

Then:

```txt
Chrome Extension
  ↓
POST to Express API
  ↓
same sendArticleToKindle()
```

This keeps the MVP simple while still teaching real architecture.
