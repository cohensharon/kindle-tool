import type { ArticleInput, SendArticleResult } from "../types/article.js";
import { extractArticle } from "../services/extractArticle.js";
import { generateEpub } from "../services/generateEpub.js";
import { sendEmail } from "../services/sendEmail.js";
import { validateGeneratedEpub } from "../utils/epubValidation.js";

export async function sendArticleToKindle(
  input: ArticleInput,
): Promise<SendArticleResult> {
  try {
    const article = await extractArticle(input.url);
    const epubFilePath = await generateEpub(article);
    await validateGeneratedEpub(epubFilePath);
    await sendEmail({
      to: input.kindleEmail,
      subject: article.title,
      text: `Attached EPUB for "${article.title}".\n\nSource: ${article.sourceUrl}`,
      attachmentPath: epubFilePath,
    });

    return {
      success: true,
      kindleEmail: input.kindleEmail,
      article,
      epubFilePath,
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
