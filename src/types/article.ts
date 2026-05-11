export interface ArticleInput {
  url: string;
  kindleEmail: string;
}

export interface ExtractedArticle {
  title: string;
  byline?: string;
  contentHtml: string;
  textContent?: string;
  sourceUrl: string;
}

export type SendArticleResult =
  | {
      success: true;
      article: ExtractedArticle;
      kindleEmail: string;
    }
  | {
      success: false;
      url: string;
      kindleEmail: string;
      error: string;
    };
