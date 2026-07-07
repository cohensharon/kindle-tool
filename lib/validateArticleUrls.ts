export type ArticleUrlValidationResult =
  | {
      valid: true;
      url: string;
    }
  | {
      valid: false;
      url: string;
      error: string;
    };

export interface ValidateArticleUrlsResult {
  valid: boolean;
  results: ArticleUrlValidationResult[];
}

export function validateArticleUrl(value: string): ArticleUrlValidationResult {
  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return {
      valid: false,
      url: trimmedValue,
      error: 'Please enter a URL, or type "done" when finished.',
    };
  }

  let url: URL;

  try {
    url = new URL(trimmedValue);
  } catch {
    return {
      valid: false,
      url: trimmedValue,
      error: "Please enter a valid HTTP or HTTPS URL.",
    };
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return {
      valid: false,
      url: trimmedValue,
      error: "Only HTTP and HTTPS URLs are supported.",
    };
  }

  return {
    valid: true,
    url: trimmedValue,
  };
}

export function validateArticleUrls(
  urls: readonly string[],
): ValidateArticleUrlsResult {
  const results = urls.map((url) => validateArticleUrl(url));

  return {
    valid: results.every((result) => result.valid),
    results,
  };
}
