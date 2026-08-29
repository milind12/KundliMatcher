import { Clock3 } from "lucide-react";
import type { MatchReport } from "../../types";

interface SavedMatchesProps {
  matches: MatchReport[];
  onSelect: (match: MatchReport) => void;
}

export function SavedMatches({ matches, onSelect }: SavedMatchesProps) {
  if (matches.length === 0) return null;

  return (
    <section className="history" aria-labelledby="history-title">
      <div className="section-heading">
        <h2 id="history-title">Previous matches</h2>
      </div>
      <div className="history-grid">
        {matches.map((match) => (
          <button
            className="history-item"
            key={`${match.createdAt}-${match.personA.details.id}`}
            type="button"
            onClick={() => onSelect(match)}
          >
            <Clock3 aria-hidden="true" size={18} />
            <span>
              <strong>
                {match.personA.details.name || "Person 1"} and{" "}
                {match.personB.details.name || "Person 2"}
              </strong>
              <small>
                {new Date(match.createdAt).toLocaleDateString()} - {match.guna.total}/36
              </small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
