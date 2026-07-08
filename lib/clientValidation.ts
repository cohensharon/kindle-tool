import { validateKindleEmail } from "./validateKindleEmail";
import { validateArticleUrl } from "./validateArticleUrls";

export { validateKindleEmail };
export type { KindleEmailValidationResult } from "./validateKindleEmail";
export type { ArticleUrlValidationResult } from "./validateArticleUrls";

/**
 * Validates a URL field for web use. Returns null for empty strings so that
 * empty fields are ignored rather than shown as errors.
 */
export function validateArticleUrlForWeb(
  value: string,
): ReturnType<typeof validateArticleUrl> | null {
  if (value.trim().length === 0) return null;
  return validateArticleUrl(value);
}
