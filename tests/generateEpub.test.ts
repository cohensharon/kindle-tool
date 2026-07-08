import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { extractArticle } from "../src/services/extractArticle.js";
import type { ExtractedArticle } from "../src/types/article.js";
import { generateEpub, tryGenerateEpub } from "../lib/generateEpub.js";

const sampleArticle: ExtractedArticle = {
  title: "Test Article",
  byline: "Test Author",
  contentHtml: "<p>Hello from the test article.</p>",
  sourceUrl: "https://example.com/test-article",
};

describe("generateEpub", () => {
  it("generates an EPUB file for a sample article", async () => {
    const outputDirectory = await mkdtemp(path.join(tmpdir(), "generate-epub-"));

    try {
      const epubPath = await generateEpub(sampleArticle, outputDirectory);
      const fileStats = await stat(epubPath);

      assert.match(epubPath, /\.epub$/);
      assert.equal(fileStats.isFile(), true);
      assert.ok(fileStats.size > 0);

      const contents = await readFile(epubPath);
      assert.ok(contents.length > 0);
    } finally {
      await rm(outputDirectory, { recursive: true, force: true });
    }
  });

  it("generates an EPUB from a known valid article URL via extraction", async () => {
    const outputDirectory = await mkdtemp(path.join(tmpdir(), "generate-epub-url-"));

    try {
      const article = await extractArticle("https://example.com");
      const epubPath = await generateEpub(article, outputDirectory);
      const fileStats = await stat(epubPath);

      assert.match(epubPath, /\.epub$/);
      assert.ok(fileStats.size > 0);
    } finally {
      await rm(outputDirectory, { recursive: true, force: true });
    }
  });

  it("handles failed article fetch before EPUB generation", async () => {
    await assert.rejects(
      extractArticle("https://this-domain-does-not-exist-12345.invalid/article"),
      (error: unknown) => {
        assert.ok(error instanceof Error);
        assert.match(error.message, /Failed to fetch article/);
        return true;
      },
    );
  });

  it("returns structured failure for invalid output directory", async () => {
    const tempRoot = await mkdtemp(path.join(tmpdir(), "generate-epub-invalid-"));
    const blockedPath = path.join(tempRoot, "blocked.txt");

    try {
      await writeFile(blockedPath, "block");
      const result = await tryGenerateEpub(sampleArticle, blockedPath);

      assert.equal(result.success, false);
      if (!result.success) {
        assert.match(result.error, /Failed to generate EPUB:/);
      }
    } finally {
      await rm(tempRoot, { recursive: true, force: true });
    }
  });
});
