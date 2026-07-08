import type { SendToKindleApiResult } from "./apiTypes.js";
import type { SendArticleResult } from "../src/types/article.js";

export function mapServiceErrorToUserMessage(error: string): string {
  if (
    error.includes("Failed to fetch article") ||
    error.includes("Readability")
  ) {
    return "Could not fetch or extract this article.";
  }

  if (
    error.includes("Failed to generate EPUB") ||
    error.includes("EPUB validation failed")
  ) {
    return "Could not create a valid EPUB for this article.";
  }

  const lowerError = error.toLowerCase();

  if (
    error.includes("SMTP") ||
    lowerError.includes("kindle email") ||
    lowerError.includes("email")
  ) {
    return "Could not send the EPUB to your Kindle.";
  }

  return error;
}

export function mapSendArticleResultToApiResult(
  result: SendArticleResult,
): SendToKindleApiResult {
  if (result.success) {
    return {
      url: result.url,
      status: "success",
      message: "Sent to Kindle",
    };
  }

  return {
    url: result.url,
    status: "error",
    message: mapServiceErrorToUserMessage(result.error),
  };
}
