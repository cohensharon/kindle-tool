export function getArticleUrlValidationError(value: string): string | null {
  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return 'Please enter a URL, or type "done" when finished.';
  }

  let url: URL;

  try {
    url = new URL(trimmedValue);
  } catch {
    return "Please enter a valid HTTP or HTTPS URL.";
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return "Only HTTP and HTTPS URLs are supported.";
  }

  return null;
}

export function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
