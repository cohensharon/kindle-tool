import type { SendToKindleApiResult } from "../../lib/apiTypes";

interface ResultsListProps {
  results: SendToKindleApiResult[];
  onClear: () => void;
}

export default function ResultsList({ results, onClear }: ResultsListProps) {
  const successCount = results.filter((r) => r.status === "success").length;
  const total = results.length;
  const allSucceeded = successCount === total;

  const summaryText = allSucceeded
    ? `All ${total} article${total !== 1 ? "s" : ""} sent successfully.`
    : `${successCount} of ${total} article${total !== 1 ? "s" : ""} sent successfully.`;

  return (
    <section className="results" aria-label="Results">
      <div className="results-header">
        <h2>Results</h2>
        <button type="button" className="btn-new-batch" onClick={onClear}>
          Send another batch
        </button>
      </div>

      <p
        className={`results-summary ${allSucceeded ? "results-summary-success" : "results-summary-partial"}`}
      >
        {summaryText}
      </p>

      <ul>
        {results.map((result) => (
          <li key={result.url} className={`result-item result-${result.status}`}>
            <div className="result-top">
              <span
                className={`result-badge result-badge-${result.status}`}
                aria-label={result.status === "success" ? "Success" : "Failed"}
              >
                {result.status === "success" ? "✓ Sent" : "✗ Failed"}
              </span>
              <span className="result-url">{result.url}</span>
            </div>
            {result.message && (
              <p className="result-message">{result.message}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
