import type { VercelRequest, VercelResponse } from "@vercel/node";
import type {
  SendToKindleErrorResponse,
  SendToKindleSuccessResponse,
} from "../lib/apiTypes";
import { mapSendArticleResultToApiResult } from "../lib/mapApiResults";
import { validateSendToKindleRequest } from "../lib/requestValidation";
import { sendArticlesToKindle } from "../lib/sendArticlesToKindle";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    const errorBody: SendToKindleErrorResponse = {
      error: "Method not allowed.",
    };
    return res.status(405).json(errorBody);
  }

  // Vercel parses JSON request bodies automatically when Content-Type is application/json.
  const body: unknown = req.body;

  const validation = validateSendToKindleRequest(body);
  if (!validation.valid) {
    const errorBody: SendToKindleErrorResponse = { error: validation.error };
    return res.status(400).json(errorBody);
  }

  try {
    const results = await sendArticlesToKindle(
      {
        kindleEmail: validation.request.kindleEmail,
        urls: validation.request.urls,
      },
      { epubOutputDirectory: "/tmp" },
    );

    const responseBody: SendToKindleSuccessResponse = {
      results: results.map(mapSendArticleResultToApiResult),
    };

    return res.status(200).json(responseBody);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const errorBody: SendToKindleErrorResponse = {
      error: `Unexpected server error: ${message}`,
    };
    return res.status(500).json(errorBody);
  }
}
