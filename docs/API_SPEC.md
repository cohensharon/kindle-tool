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

### Errors

- 400: invalid Kindle email
- 400: invalid URL
- 500: EPUB generation failed
- 500: email sending failed
