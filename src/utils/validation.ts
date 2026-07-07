import { validateArticleUrl } from "../../lib/validateArticleUrls.js";

export function getArticleUrlValidationError(value: string): string | null {
  const result = validateArticleUrl(value);
  return result.valid ? null : result.error;
}

export function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
