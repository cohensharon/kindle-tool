import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { ZipFile } from "yazl";
import type { ExtractedArticle } from "../src/types/article.js";

const generatedDirectory = "generated";

export type GenerateEpubResult =
  | {
      success: true;
      epubPath: string;
    }
  | {
      success: false;
      error: string;
    };

export async function generateEpub(
  article: ExtractedArticle,
  outputDirectory = generatedDirectory,
): Promise<string> {
  const result = await tryGenerateEpub(article, outputDirectory);

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.epubPath;
}

export async function tryGenerateEpub(
  article: ExtractedArticle,
  outputDirectory = generatedDirectory,
): Promise<GenerateEpubResult> {
  try {
    await mkdir(outputDirectory, { recursive: true });

    const fileName = `${toSafeFileName(article.title)}.epub`;
    const epubPath = path.join(outputDirectory, fileName);
    const bookId = randomUUID();
    const zipFile = new ZipFile();
    const output = createWriteStream(epubPath);

    zipFile.outputStream.pipe(output);
    zipFile.addBuffer(Buffer.from("application/epub+zip"), "mimetype", {
      compress: false,
    });
    zipFile.addBuffer(
      Buffer.from(createContainerXml()),
      "META-INF/container.xml",
    );
    zipFile.addBuffer(
      Buffer.from(createPackageDocument(article, bookId)),
      "OEBPS/content.opf",
    );
    zipFile.addBuffer(
      Buffer.from(createTableOfContents(article, bookId)),
      "OEBPS/toc.ncx",
    );
    zipFile.addBuffer(
      Buffer.from(createArticleXhtml(article)),
      "OEBPS/article.xhtml",
    );
    zipFile.end();

    await waitForZipWrite(output, zipFile);

    return {
      success: true,
      epubPath,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: `Failed to generate EPUB: ${message}`,
    };
  }
}

function waitForZipWrite(
  output: NodeJS.WritableStream,
  zipFile: ZipFile,
): Promise<void> {
  return new Promise((resolve, reject) => {
    output.on("close", resolve);
    output.on("error", reject);
    zipFile.outputStream.on("error", reject);
  });
}

function toSafeFileName(value: string): string {
  const safeName = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return safeName.length > 0 ? safeName : "article";
}

function createContainerXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
}

function createPackageDocument(article: ExtractedArticle, bookId: string): string {
  const creator = article.byline
    ? `\n    <dc:creator>${escapeXml(article.byline)}</dc:creator>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<package version="2.0" unique-identifier="BookId" xmlns="http://www.idpf.org/2007/opf">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${escapeXml(article.title)}</dc:title>${creator}
    <dc:language>en</dc:language>
    <dc:identifier id="BookId">urn:uuid:${bookId}</dc:identifier>
    <dc:source>${escapeXml(article.sourceUrl)}</dc:source>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="article" href="article.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="article"/>
  </spine>
</package>`;
}

function createTableOfContents(article: ExtractedArticle, bookId: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<ncx version="2005-1" xmlns="http://www.daisy.org/z3986/2005/ncx/">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${bookId}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle>
    <text>${escapeXml(article.title)}</text>
  </docTitle>
  <navMap>
    <navPoint id="article" playOrder="1">
      <navLabel>
        <text>${escapeXml(article.title)}</text>
      </navLabel>
      <content src="article.xhtml"/>
    </navPoint>
  </navMap>
</ncx>`;
}

function createArticleXhtml(article: ExtractedArticle): string {
  const byline = article.byline
    ? `\n    <p class="byline">${escapeXml(article.byline)}</p>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>${escapeXml(article.title)}</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  </head>
  <body>
    <h1>${escapeXml(article.title)}</h1>${byline}
    <p class="source">Source: <a href="${escapeXml(article.sourceUrl)}">${escapeXml(article.sourceUrl)}</a></p>
    <section>
      ${article.contentHtml}
    </section>
  </body>
</html>`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
