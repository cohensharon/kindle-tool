import { NextResponse } from "next/server";
import { mapSendArticleResultToApiResult } from "@/lib/mapApiResults";
import { validateSendToKindleRequest } from "@/lib/requestValidation";
import { sendArticlesToKindle } from "@/lib/sendArticlesToKindle";

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const validation = validateSendToKindleRequest(body);

  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const results = await sendArticlesToKindle({
      kindleEmail: validation.request.kindleEmail,
      urls: validation.request.urls,
    });

    return NextResponse.json({
      results: results.map(mapSendArticleResultToApiResult),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Unexpected server error: ${message}` },
      { status: 500 },
    );
  }
}
