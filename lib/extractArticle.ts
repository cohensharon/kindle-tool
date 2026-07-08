import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import type { ExtractedArticle } from "../src/types/article.js";

export async function extractArticle(url: string): Promise<ExtractedArticle> {
  let response: Response;

  try {
    response = await fetch(url);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to fetch article: ${message}`);
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch article: received ${response.status} ${response.statusText}`,
    );
  }

  const html = await response.text();
  const dom = new JSDOM(html, { url });
  const article = new Readability(dom.window.document).parse();

  if (article === null || article.content === null || article.content === undefined) {
    throw new Error("Readability was unable to parse article content.");
  }

  return {
    title: article.title ?? "Untitled Article",
    byline: article.byline ?? undefined,
    contentHtml: article.content,
    textContent: article.textContent ?? undefined,
    sourceUrl: url,
  };
}
