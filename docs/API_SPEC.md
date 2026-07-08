# API Spec

## POST /api/send-to-kindle

### Request

{
"kindleEmail": "name@kindle.com",
"urls": ["https://example.com/article"]
}

### Response

{
"results": [
{
"url": "https://example.com/article",
"status": "success",
"message": "Sent to Kindle"
}
]
}

### HTTP status codes

| Status | When |
|--------|------|
| `200` | Request passed validation. Body is `{ results: [...] }`. Each URL has `status: "success"` or `status: "error"`. A batch may mix successes and failures; one failed URL does not fail the whole request. |
| `400` | Request-level validation failed before processing (invalid JSON, missing fields, invalid Kindle email, invalid URL in the list). Body is `{ error: string }`. |
| `500` | Unexpected server failure in the route handler (not a per-URL processing error). Body is `{ error: string }`. |

Per-URL processing failures (article fetch, EPUB generation, email send) return `200` with `status: "error"` on the affected result, not `500` for the whole request.

### Errors (request-level)

- `400`: invalid Kindle email
- `400`: invalid URL
- `400`: malformed JSON or missing required fields
- `500`: unexpected server error in the handler

Per-URL failures appear in `results[].message` with `status: "error"` at HTTP `200`.
