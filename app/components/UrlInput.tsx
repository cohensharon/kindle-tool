"use client";

interface UrlInputProps {
  urls: string[];
  errors: (string | null)[];
  onChange: (urls: string[]) => void;
  onBlur: (index: number) => void;
}

export default function UrlInput({
  urls,
  errors,
  onChange,
  onBlur,
}: UrlInputProps) {
  function handleChange(index: number, value: string) {
    const next = [...urls];
    next[index] = value;
    onChange(next);
  }

  function handleRemove(index: number) {
    if (urls.length <= 1) return;
    onChange(urls.filter((_, i) => i !== index));
  }

  return (
    <div>
      {urls.map((url, index) => (
        <div key={index} className="url-row">
          <div className="url-field">
            <input
              type="url"
              value={url}
              onChange={(e) => handleChange(index, e.target.value)}
              onBlur={() => onBlur(index)}
              placeholder="https://example.com/article"
              aria-label={`Article URL ${index + 1}`}
              aria-invalid={errors[index] != null ? "true" : undefined}
              autoComplete="off"
            />
            {errors[index] && (
              <p className="field-error" role="alert">
                {errors[index]}
              </p>
            )}
          </div>
          <button
            type="button"
            className="btn-remove"
            onClick={() => handleRemove(index)}
            disabled={urls.length <= 1}
            aria-label={`Remove URL ${index + 1}`}
          >
            −
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn-add"
        onClick={() => onChange([...urls, ""])}
      >
        + Add URL
      </button>
    </div>
  );
}
