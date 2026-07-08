import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { POST } from "../app/api/send-to-kindle/route.js";

describe("POST /api/send-to-kindle", () => {
  it("returns 400 for malformed JSON", async () => {
    const response = await POST(
      new Request("http://localhost/api/send-to-kindle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{ invalid json",
      }),
    );

    assert.equal(response.status, 400);

    const body = (await response.json()) as { error: string };

    assert.match(body.error, /valid JSON/i);
  });
});
