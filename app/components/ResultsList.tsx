import type { SendToKindleApiResult } from "../../lib/apiTypes";

interface ResultsListProps {
  results: SendToKindleApiResult[];
}

export default function ResultsList({ results }: ResultsListProps) {
  return (
    <section className="results" aria-label="Results">
      <h2>Results</h2>
      <ul>
        {results.map((result) => (
          <li key={result.url} className={`result-item result-${result.status}`}>
            <span className="result-status">
              {result.status === "success" ? "✓" : "✗"}
            </span>{" "}
            <span className="result-url">{result.url}</span>
            <span className="result-message"> — {result.message}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
