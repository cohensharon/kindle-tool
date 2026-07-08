import type { SendArticleOptions, SendArticleResult } from "../src/types/article.js";
import { sendArticleToKindle } from "./sendArticleToKindle.js";

export interface SendArticlesInput {
  urls: readonly string[];
  kindleEmail: string;
}

export interface SendArticlesOptions extends SendArticleOptions {
  onArticleStart?: (context: {
    index: number;
    total: number;
    url: string;
  }) => void | Promise<void>;
}

export async function sendArticlesToKindle(
  input: SendArticlesInput,
  options: SendArticlesOptions = {},
): Promise<SendArticleResult[]> {
  const results: SendArticleResult[] = [];

  for (const [index, url] of input.urls.entries()) {
    await options.onArticleStart?.({
      index: index + 1,
      total: input.urls.length,
      url,
    });

    results.push(
      await sendArticleToKindle(
        { url, kindleEmail: input.kindleEmail },
        options,
      ),
    );
  }

  return results;
}
