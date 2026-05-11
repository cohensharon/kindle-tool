import type { ArticleInput, SendArticleResult } from "../types/article.js";

export async function sendArticleToKindle(
  input: ArticleInput,
): Promise<SendArticleResult> {
  return {
    success: true,
    kindleEmail: input.kindleEmail,
    article: {
      title: "Fake Article Title",
      contentHtml: "<p>Fake article content.</p>",
      textContent: "Fake article content.",
      sourceUrl: input.url,
    },
  };
}
