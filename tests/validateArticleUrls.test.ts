import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  validateArticleUrl,
  validateArticleUrls,
} from "../lib/validateArticleUrls.js";

describe("validateArticleUrl", () => {
  it("accepts a valid HTTP URL", () => {
    const result = validateArticleUrl("https://example.com/article");

    assert.equal(result.valid, true);
    if (result.valid) {
      assert.equal(result.url, "https://example.com/article");
    }
  });

  it("rejects an invalid URL", () => {
    const result = validateArticleUrl("not-a-url");

    assert.equal(result.valid, false);
    if (!result.valid) {
      assert.equal(result.error, "Please enter a valid HTTP or HTTPS URL.");
    }
  });

  it("rejects an empty string", () => {
    const result = validateArticleUrl("   ");

    assert.equal(result.valid, false);
    if (!result.valid) {
      assert.equal(result.error, 'Please enter a URL, or type "done" when finished.');
    }
  });

  it("rejects a non-HTTP URL", () => {
    const result = validateArticleUrl("ftp://example.com/article");

    assert.equal(result.valid, false);
    if (!result.valid) {
      assert.equal(result.error, "Only HTTP and HTTPS URLs are supported.");
    }
  });
});

describe("validateArticleUrls", () => {
  it("returns mixed validity results for multiple URLs", () => {
    const result = validateArticleUrls([
      "https://example.com/ok",
      "not-a-url",
      "mailto:test@example.com",
    ]);

    assert.equal(result.valid, false);
    assert.equal(result.results.length, 3);
    assert.equal(result.results[0]?.valid, true);
    assert.equal(result.results[1]?.valid, false);
    assert.equal(result.results[2]?.valid, false);
  });
});
