import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  mapSendArticleResultToApiResult,
  mapServiceErrorToUserMessage,
} from "../lib/mapApiResults.js";

describe("mapSendArticleResultToApiResult", () => {
  it("maps a successful result", () => {
    const result = mapSendArticleResultToApiResult({
      success: true,
      url: "https://example.com/article",
      title: "Example Article",
      epubPath: "/tmp/example.epub",
    });

    assert.deepEqual(result, {
      url: "https://example.com/article",
      status: "success",
      message: "Sent to Kindle",
    });
  });

  it("maps a failed result with a categorized message", () => {
    const result = mapSendArticleResultToApiResult({
      success: false,
      url: "https://example.com/article",
      error: "Failed to fetch article: network error",
    });

    assert.deepEqual(result, {
      url: "https://example.com/article",
      status: "error",
      message: "Could not fetch or extract this article.",
    });
  });
});

describe("mapServiceErrorToUserMessage", () => {
  it("categorizes fetch and extraction errors", () => {
    assert.equal(
      mapServiceErrorToUserMessage("Failed to fetch article: timeout"),
      "Could not fetch or extract this article.",
    );
    assert.equal(
      mapServiceErrorToUserMessage("Readability was unable to parse article content."),
      "Could not fetch or extract this article.",
    );
  });

  it("categorizes EPUB generation and validation errors", () => {
    assert.equal(
      mapServiceErrorToUserMessage("Failed to generate EPUB: disk full"),
      "Could not create a valid EPUB for this article.",
    );
    assert.equal(
      mapServiceErrorToUserMessage(
        "Generated EPUB validation failed: file does not exist.",
      ),
      "Could not create a valid EPUB for this article.",
    );
  });

  it("categorizes email and SMTP errors", () => {
    assert.equal(
      mapServiceErrorToUserMessage("Missing SMTP configuration: SMTP_HOST."),
      "Could not send the EPUB to your Kindle.",
    );
    assert.equal(
      mapServiceErrorToUserMessage("Failed to send email: connection refused"),
      "Could not send the EPUB to your Kindle.",
    );
    assert.equal(
      mapServiceErrorToUserMessage("Please enter a valid Kindle email address."),
      "Could not send the EPUB to your Kindle.",
    );
  });

  it("returns the original message when no category matches", () => {
    const message = "Something unexpected happened.";

    assert.equal(mapServiceErrorToUserMessage(message), message);
  });
});
