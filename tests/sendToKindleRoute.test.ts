import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import handler from "../api/send-to-kindle.js";

function makeReq(overrides: Partial<VercelRequest> = {}): VercelRequest {
  return { method: "POST", body: undefined, ...overrides } as VercelRequest;
}

function makeRes() {
  let statusCode = 200;
  let responseBody: unknown;
  const res = {
    status(code: number) {
      statusCode = code;
      return res;
    },
    json(body: unknown) {
      responseBody = body;
      return res;
    },
    get statusCode() {
      return statusCode;
    },
    get responseBody() {
      return responseBody;
    },
  };
  return res as unknown as VercelResponse & {
    statusCode: number;
    responseBody: unknown;
  };
}

describe("handler /api/send-to-kindle", () => {
  it("returns 405 for non-POST methods", async () => {
    const req = makeReq({ method: "GET" });
    const res = makeRes();
    await handler(req, res);
    assert.equal(res.statusCode, 405);
  });

  it("returns 400 when body is missing", async () => {
    const req = makeReq({ body: undefined });
    const res = makeRes();
    await handler(req, res);
    assert.equal(res.statusCode, 400);
    const body = res.responseBody as { error: string };
    assert.ok(typeof body.error === "string");
  });

  it("returns 400 for invalid Kindle email", async () => {
    const req = makeReq({
      body: { kindleEmail: "not-an-email", urls: ["https://example.com"] },
    });
    const res = makeRes();
    await handler(req, res);
    assert.equal(res.statusCode, 400);
    const body = res.responseBody as { error: string };
    assert.ok(typeof body.error === "string");
  });
});
