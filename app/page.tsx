"use client";

import { useMemo, useState } from "react";
import UrlInput from "./components/UrlInput";
import ResultsList from "./components/ResultsList";
import {
  validateKindleEmail,
  validateArticleUrlForWeb,
} from "../lib/clientValidation";
import type {
  SendToKindleApiResult,
  SendToKindleSuccessResponse,
  SendToKindleErrorResponse,
} from "../lib/apiTypes";

export default function HomePage() {
  const [kindleEmail, setKindleEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const [urls, setUrls] = useState<string[]>([""]);
  const [urlsTouched, setUrlsTouched] = useState<boolean[]>([false]);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SendToKindleApiResult[] | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const emailResult = useMemo(
    () => (kindleEmail.trim() ? validateKindleEmail(kindleEmail) : null),
    [kindleEmail],
  );

  const emailError = useMemo(() => {
    if (!emailTouched) return null;
    if (!kindleEmail.trim()) return "Please enter your Kindle email address.";
    return emailResult && !emailResult.valid ? emailResult.error : null;
  }, [emailTouched, kindleEmail, emailResult]);

  const urlValidations = useMemo(
    () => urls.map((u) => validateArticleUrlForWeb(u)),
    [urls],
  );

  const urlErrors = useMemo(
    () =>
      urlValidations.map((result, i) => {
        if (!urlsTouched[i] || result === null) return null;
        return result.valid ? null : result.error;
      }),
    [urlValidations, urlsTouched],
  );

  const isFormValid = useMemo(() => {
    if (!kindleEmail.trim() || !emailResult?.valid) return false;
    const nonEmpty = urlValidations.filter((r) => r !== null);
    return nonEmpty.length > 0 && nonEmpty.every((r) => r!.valid);
  }, [kindleEmail, emailResult, urlValidations]);

  function handleUrlsChange(next: string[]) {
    setUrls(next);
    setUrlsTouched((prev) => {
      const updated = [...prev];
      while (updated.length < next.length) updated.push(false);
      return updated.slice(0, next.length);
    });
  }

  function handleUrlBlur(index: number) {
    setUrlsTouched((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid || loading) return;

    const payload = {
      kindleEmail: kindleEmail.trim(),
      urls: urls.map((u) => u.trim()).filter((u) => u.length > 0),
    };

    setLoading(true);
    setFormError(null);
    setResults(null);

    try {
      const res = await fetch("/api/send-to-kindle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = (await res.json()) as SendToKindleSuccessResponse;
        setResults(data.results);
      } else {
        const data = (await res.json()) as SendToKindleErrorResponse;
        setFormError(
          data.error ?? "An unexpected error occurred. Please try again.",
        );
      }
    } catch {
      setFormError(
        "Network error. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>Send to Kindle</h1>
      <p className="instructions">
        Enter your Kindle email and one or more article URLs. Each article will
        be converted to an EPUB and emailed to your device.
      </p>

      <div className="notice" role="note">
        <strong>Important:</strong> The sending address for this app must be on
        your{" "}
        <strong>Approved Personal Document E&#8209;mail List</strong> in Amazon.
        Go to <em>Manage Your Content and Devices → Preferences → Personal
        Document Settings</em> to add it. This is not the Kindle address you
        enter below.
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <fieldset disabled={loading} style={{ border: "none", padding: 0, margin: 0 }}>
          <div className="field">
            <label htmlFor="kindleEmail">Kindle Email</label>
            <input
              id="kindleEmail"
              type="email"
              value={kindleEmail}
              onChange={(e) => setKindleEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              placeholder="you@kindle.com"
              aria-describedby={emailError ? "email-error" : undefined}
              aria-invalid={emailError ? "true" : undefined}
              autoComplete="email"
            />
            {emailError && (
              <p id="email-error" className="field-error" role="alert">
                {emailError}
              </p>
            )}
          </div>

          <div className="field">
            <label>Article URLs</label>
            <UrlInput
              urls={urls}
              errors={urlErrors}
              onChange={handleUrlsChange}
              onBlur={handleUrlBlur}
            />
          </div>

          {formError && (
            <p className="form-error" role="alert">
              {formError}
            </p>
          )}

          <button
            type="submit"
            className="btn-submit"
            disabled={!isFormValid || loading}
            aria-disabled={!isFormValid || loading}
          >
            {loading ? "Sending…" : "Send to Kindle"}
          </button>
        </fieldset>
      </form>

      {results && <ResultsList results={results} />}
    </main>
  );
}
