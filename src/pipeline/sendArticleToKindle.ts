import type { ArticleInput, SendArticleResult } from "../types/article.js";
import { extractArticle } from "../services/extractArticle.js";

export async function sendArticleToKindle(
  input: ArticleInput,
): Promise<SendArticleResult> {
  try {
    const article = await extractArticle(input.url);

    return {
      success: true,
      kindleEmail: input.kindleEmail,
      article,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      url: input.url,
      kindleEmail: input.kindleEmail,
      error: message,
    };
  }
}
