import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateSendToKindleRequest } from "../lib/requestValidation.js";

describe("validateSendToKindleRequest", () => {
  it("accepts a valid request", () => {
    const result = validateSendToKindleRequest({
      kindleEmail: "reader@kindle.com",
      urls: ["https://example.com/article"],
    });

    assert.equal(result.valid, true);
    if (result.valid) {
      assert.equal(result.request.kindleEmail, "reader@kindle.com");
      assert.deepEqual(result.request.urls, ["https://example.com/article"]);
    }
  });

  it("rejects a missing Kindle email", () => {
    const result = validateSendToKindleRequest({
      urls: ["https://example.com/article"],
    });

    assert.equal(result.valid, false);
    if (!result.valid) {
      assert.match(result.error, /kindleEmail/i);
    }
  });

  it("rejects an invalid Kindle email", () => {
    const result = validateSendToKindleRequest({
      kindleEmail: "not-an-email",
      urls: ["https://example.com/article"],
    });

    assert.equal(result.valid, false);
    if (!result.valid) {
      assert.equal(result.error, "Invalid Kindle email.");
    }
  });

  it("rejects empty URLs", () => {
    const result = validateSendToKindleRequest({
      kindleEmail: "reader@kindle.com",
      urls: [],
    });

    assert.equal(result.valid, false);
    if (!result.valid) {
      assert.match(result.error, /At least one URL is required/);
    }
  });

  it("rejects an invalid URL", () => {
    const result = validateSendToKindleRequest({
      kindleEmail: "reader@kindle.com",
      urls: ["not-a-url"],
    });

    assert.equal(result.valid, false);
    if (!result.valid) {
      assert.match(result.error, /valid HTTP or HTTPS URL/);
    }
  });
});
