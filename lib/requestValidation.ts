import { validateArticleUrls } from "./validateArticleUrls.js";
import { validateKindleEmail } from "./validateKindleEmail.js";

export interface SendToKindleRequest {
  kindleEmail: string;
  urls: string[];
}

export type SendToKindleRequestValidationResult =
  | {
      valid: true;
      request: SendToKindleRequest;
    }
  | {
      valid: false;
      error: string;
    };

export function validateSendToKindleRequest(
  body: unknown,
): SendToKindleRequestValidationResult {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return {
      valid: false,
      error: "Request body must be a JSON object.",
    };
  }

  const record = body as Record<string, unknown>;
  const kindleEmail = record.kindleEmail;
  const urls = record.urls;

  if (typeof kindleEmail !== "string") {
    return {
      valid: false,
      error: "kindleEmail is required and must be a string.",
    };
  }

  const emailValidation = validateKindleEmail(kindleEmail);

  if (!emailValidation.valid) {
    return {
      valid: false,
      error: "Invalid Kindle email.",
    };
  }

  if (!Array.isArray(urls)) {
    return {
      valid: false,
      error: "urls is required and must be an array.",
    };
  }

  if (urls.length === 0) {
    return {
      valid: false,
      error: "At least one URL is required.",
    };
  }

  if (!urls.every((url) => typeof url === "string")) {
    return {
      valid: false,
      error: "Each URL must be a string.",
    };
  }

  const urlValidation = validateArticleUrls(urls);

  if (!urlValidation.valid) {
    const firstInvalid = urlValidation.results.find((result) => !result.valid);

    return {
      valid: false,
      error: firstInvalid?.valid === false ? firstInvalid.error : "Invalid URL.",
    };
  }

  return {
    valid: true,
    request: {
      kindleEmail: emailValidation.email,
      urls: urlValidation.results.map((result) =>
        result.valid ? result.url : "",
      ),
    },
  };
}
