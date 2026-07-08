## Ticket 12: Deploy to Vercel

### Goal

Deploy the web app to production on Vercel and verify the full end-to-end flow works live: enter email → add URLs → submit → receive EPUBs on Kindle.

### Scope

- Fix the `/tmp` file-system constraint in the API handler (one-line change).
- Create and link a Vercel project.
- Configure all required environment variables in the Vercel dashboard.
- Deploy to production.
- Verify the live URL end-to-end.

### Out of Scope

- No new features.
- No changes to `lib/` services or the frontend.
- No custom domain setup (can be done post-deploy).

---

### Code Change: Fix EPUB Output Directory for Serverless

**Why:** Vercel serverless functions only allow file writes to `/tmp`. The EPUB pipeline currently defaults to writing into `generated/` (a relative path resolved from the function's working directory, which is read-only on Vercel).

**Fix:** Pass `epubOutputDirectory: "/tmp"` explicitly from the API handler. The `lib/` service already accepts this as an option — no service changes are needed. The CLI is unaffected because it does not pass this option and continues to write to `generated/`.

**File:** `api/send-to-kindle.ts`

Change:

```typescript
const results = await sendArticlesToKindle({
  kindleEmail: validation.request.kindleEmail,
  urls: validation.request.urls,
});
```

To:

```typescript
const results = await sendArticlesToKindle(
  {
    kindleEmail: validation.request.kindleEmail,
    urls: validation.request.urls,
  },
  { epubOutputDirectory: "/tmp" },
);
```

Remove the `// NOTE: Vercel serverless ...` comment once this is applied.

---

### Expected Files

| File | Action |
|---|---|
| `api/send-to-kindle.ts` | Update — pass `epubOutputDirectory: "/tmp"` |

No other files need to change.

---

### Acceptance Criteria

- `npx tsc --noEmit` passes.
- `npm test` passes.
- The Vercel project is linked to the git repo.
- All six environment variables are set in the Vercel dashboard.
- The live URL returns the web UI.
- Submitting a valid article URL and Kindle email from the live URL delivers an EPUB to Kindle.
- No SMTP credentials or secrets appear in browser network responses.

---

### Vercel Dashboard Instructions

These are the manual steps to complete in the Vercel web app at [vercel.com](https://vercel.com).

#### Step 1 — Create a new project

1. Log in to [vercel.com](https://vercel.com) and click **Add New → Project**.
2. Click **Import Git Repository** and connect your GitHub / GitLab / Bitbucket account if not already connected.
3. Select the `kindle-tool` repository and click **Import**.
4. Vercel will detect Next.js automatically. Leave **Framework Preset** as **Next.js**.
5. Leave **Root Directory** as `/` (the project root).
6. Do **not** click Deploy yet — set environment variables first (Step 2).

#### Step 2 — Set environment variables

Still on the project creation screen, expand the **Environment Variables** section. Add each variable below. Set the **Environment** to **Production, Preview, Development** for all of them unless noted.

| Name | Value | Notes |
|---|---|---|
| `SMTP_HOST` | e.g. `smtp.gmail.com` | Your SMTP provider hostname |
| `SMTP_PORT` | e.g. `587` | Use `587` for TLS or `465` for SSL |
| `SMTP_USER` | your SMTP username | Usually your email address |
| `SMTP_PASS` | your SMTP password or app password | For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833) |
| `FROM_EMAIL` | the approved sender address | Must be on Amazon's Approved Personal Document E-mail List |
| `NEXT_PUBLIC_FROM_EMAIL` | same value as `FROM_EMAIL` | Displayed in the UI whitelist notice |

> `NEXT_PUBLIC_FROM_EMAIL` will be visible to anyone who views the deployed page's source. Set it to an address you are comfortable sharing publicly.

#### Step 3 — Deploy

Click **Deploy**. Vercel will build and deploy the project. This takes about 1–2 minutes. When the deployment succeeds, Vercel shows a **Congratulations** screen with a live URL (e.g. `https://kindle-tool-abc.vercel.app`).

#### Step 4 — Verify the FROM_EMAIL is whitelisted on Amazon

Before testing, confirm the sender address is approved:

1. Go to [amazon.com](https://amazon.com) → **Account & Lists → Manage Your Content and Devices**.
2. Click the **Preferences** tab.
3. Scroll to **Personal Document Settings**.
4. Under **Approved Personal Document E-mail List**, click **Add a new approved e-mail address**.
5. Enter the value you set for `FROM_EMAIL` and click **Add Address**.

#### Step 5 — End-to-end test

1. Open the live Vercel URL.
2. Enter a `@kindle.com` address in the **Kindle Email** field.
3. Paste a publicly accessible article URL (e.g. a Wikipedia article or a news story).
4. Click **Send to Kindle**.
5. Within a few minutes, check the Kindle device or the Kindle app — the article should appear as a document.

#### Step 6 — (Optional) Add a custom domain

In the Vercel dashboard, go to the project → **Settings → Domains** → **Add** and follow the prompts to configure a custom domain with your DNS provider.

---

### Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| 500 error on submit | Missing env var | Check all six are set in Vercel dashboard → Settings → Environment Variables |
| EPUB sent but never arrives | FROM_EMAIL not whitelisted | Complete Step 4 above |
| SMTP auth error in logs | Wrong credentials or app password needed | Use an App Password for Gmail; check SMTP_USER / SMTP_PASS |
| Build fails | TypeScript error | Run `npx tsc --noEmit` locally and fix before pushing |
| API returns 404 | `vercel.json` misconfigured | Confirm `vercel.json` exists at project root with correct `framework` and `functions` fields |

---

### Cursor Prompt

Read `docs/ENGINEERING.md`, `docs/API_SPEC.md`, and this ticket. Apply the one-line `/tmp` fix to `api/send-to-kindle.ts`. Remove the `// NOTE` comment. Run `npx tsc --noEmit` and `npm test` to confirm everything passes. Do not change any other files.
