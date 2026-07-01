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

export type ArticlePipelineProgress =
  | {
      step: "fetching";
      url: string;
    }
  | {
      step: "epubGenerated";
      url: string;
      title: string;
      epubPath: string;
    }
  | {
      url: string;
      step: "sending";
      title: string;
      epubPath: string;
    };

export interface SendArticleOptions {
  onProgress?: (progress: ArticlePipelineProgress) => void | Promise<void>;
  epubOutputDirectory?: string;
}

export type SendArticleResult =
  | {
      success: true;
      url: string;
      title: string;
      epubPath: string;
    }
  | {
      success: false;
      url: string;
      title?: string;
      epubPath?: string;
      error: string;
    };
