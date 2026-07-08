export interface SendToKindleApiResult {
  url: string;
  status: "success" | "error";
  message: string;
}

export interface SendToKindleSuccessResponse {
  results: SendToKindleApiResult[];
}

export interface SendToKindleErrorResponse {
  error: string;
}
