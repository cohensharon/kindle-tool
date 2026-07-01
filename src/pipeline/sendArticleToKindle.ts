import type {
  ArticleInput,
  SendArticleOptions,
  SendArticleResult,
} from "../types/article.js";
import { extractArticle } from "../services/extractArticle.js";
import { generateEpub } from "../services/generateEpub.js";
import { sendEmail } from "../services/sendEmail.js";
import { validateGeneratedEpub } from "../utils/epubValidation.js";

export async function sendArticleToKindle(
  input: ArticleInput,
  options: SendArticleOptions = {},
): Promise<SendArticleResult> {
  let title: string | undefined;
  let epubPath: string | undefined;

  try {
    await options.onProgress?.({ step: "fetching", url: input.url });

    const article = await extractArticle(input.url);
    title = article.title;
    epubPath = await generateEpub(article, options.epubOutputDirectory);
    await validateGeneratedEpub(epubPath);
    await options.onProgress?.({
      step: "epubGenerated",
      url: input.url,
      title,
      epubPath,
    });

    await options.onProgress?.({
      step: "sending",
      url: input.url,
      title,
      epubPath,
    });
    await sendEmail({
      to: input.kindleEmail,
      subject: title,
      text: `Attached EPUB for "${title}".\n\nSource: ${article.sourceUrl}`,
      attachmentPath: epubPath,
    });

    return {
      success: true,
      url: input.url,
      title,
      epubPath,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      url: input.url,
      title,
      epubPath,
      error: message,
    };
  }
}
