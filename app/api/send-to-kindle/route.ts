import { NextResponse } from "next/server";
import type {
  SendToKindleErrorResponse,
  SendToKindleSuccessResponse,
} from "@/lib/apiTypes";
import { mapSendArticleResultToApiResult } from "@/lib/mapApiResults";
import { validateSendToKindleRequest } from "@/lib/requestValidation";
import { sendArticlesToKindle } from "@/lib/sendArticlesToKindle";

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    const body: SendToKindleErrorResponse = {
      error: "Request body must be valid JSON.",
    };

    return NextResponse.json(body, { status: 400 });
  }

  const validation = validateSendToKindleRequest(body);

  if (!validation.valid) {
    const errorBody: SendToKindleErrorResponse = { error: validation.error };

    return NextResponse.json(errorBody, { status: 400 });
  }

  try {
    const results = await sendArticlesToKindle({
      kindleEmail: validation.request.kindleEmail,
      urls: validation.request.urls,
    });

    const responseBody: SendToKindleSuccessResponse = {
      results: results.map(mapSendArticleResultToApiResult),
    };

    return NextResponse.json(responseBody);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const errorBody: SendToKindleErrorResponse = {
      error: `Unexpected server error: ${message}`,
    };

    return NextResponse.json(errorBody, { status: 500 });
  }
}
