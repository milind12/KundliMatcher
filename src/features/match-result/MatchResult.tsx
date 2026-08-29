import { ChevronDown, MoonStar } from "lucide-react";
import { orderedKootas } from "../../guna/calculateGunas";
import type { MatchReport } from "../../types";

interface MatchResultProps {
  report: MatchReport;
}

function scoreClass(total: number): string {
  if (total >= 28) return "score-excellent";
  if (total >= 24) return "score-good";
  if (total >= 18) return "score-review";
  return "score-low";
}

export function MatchResult({ report }: MatchResultProps) {
  const kootas = orderedKootas(report.guna);

  return (
    <section className="result-panel" aria-labelledby="result-title">
      <div className="result-summary">
        <div>
          <p className="eyebrow">Guna Milan result</p>
          <h2 id="result-title">{report.guna.verdict}</h2>
        </div>
        <div className={`score-orb ${scoreClass(report.guna.total)}`}>
          <strong>{report.guna.total}</strong>
          <span>/ 36</span>
        </div>
      </div>

      <div className="chart-pair">
        <article>
          <MoonStar aria-hidden="true" size={20} />
          <div>
            <h3>{report.personA.details.name || "Person 1"}</h3>
            <p>
              {report.personA.nakshatraName} pada {report.personA.nakshatraPada}
              {" - "}
              {report.personA.rashiName}
            </p>
          </div>
        </article>
        <article>
          <MoonStar aria-hidden="true" size={20} />
          <div>
            <h3>{report.personB.details.name || "Person 2"}</h3>
            <p>
              {report.personB.nakshatraName} pada {report.personB.nakshatraPada}
              {" - "}
              {report.personB.rashiName}
            </p>
          </div>
        </article>
      </div>

      <div className="koota-list">
        {kootas.map((koota) => (
          <details key={koota.key} className="koota-row">
            <summary>
              <span>
                <ChevronDown aria-hidden="true" size={18} />
                <strong>{koota.name}</strong>
                <small>{koota.summary}</small>
              </span>
              <b>
                {koota.score} / {koota.maximum}
              </b>
            </summary>
            <p>{koota.details}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
