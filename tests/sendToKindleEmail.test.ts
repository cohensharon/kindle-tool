import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { trySendToKindleEmail } from "../lib/sendToKindleEmail.js";

const requiredSmtpVariables = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "FROM_EMAIL",
] as const;

function saveSmtpEnvironment(): Record<string, string | undefined> {
  return Object.fromEntries(
    requiredSmtpVariables.map((name) => [name, process.env[name]]),
  );
}

function restoreSmtpEnvironment(
  saved: Record<string, string | undefined>,
): void {
  for (const name of requiredSmtpVariables) {
    const value = saved[name];

    if (value === undefined) {
      delete process.env[name];
    } else {
      process.env[name] = value;
    }
  }
}

describe("trySendToKindleEmail", () => {
  it("returns structured failure when SMTP env vars are missing", async () => {
    const saved = saveSmtpEnvironment();

    try {
      for (const name of requiredSmtpVariables) {
        delete process.env[name];
      }

      const result = await trySendToKindleEmail({
        kindleEmail: "reader@kindle.com",
        subject: "Test",
        text: "Test body",
        epubPath: "generated/example.epub",
      });

      assert.equal(result.success, false);
      if (!result.success) {
        assert.match(result.error, /Missing SMTP configuration/);
        assert.match(result.error, /SMTP_HOST/);
      }
    } finally {
      restoreSmtpEnvironment(saved);
    }
  });

  it("returns structured failure for invalid Kindle email", async () => {
    const result = await trySendToKindleEmail({
      kindleEmail: "not-an-email",
      subject: "Test",
      text: "Test body",
      epubPath: "generated/example.epub",
    });

    assert.equal(result.success, false);
    if (!result.success) {
      assert.match(result.error, /valid Kindle email address/);
    }
  });
});
