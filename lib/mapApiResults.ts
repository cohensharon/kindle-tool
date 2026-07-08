import type { SendArticleResult } from "../src/types/article.js";

export interface SendToKindleApiResult {
  url: string;
  status: "success" | "error";
  message: string;
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
    message: result.error,
  };
}
