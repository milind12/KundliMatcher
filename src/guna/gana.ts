import { GANA_SCORES } from "../data/scoring";
import type { BirthChart, KootaResult } from "../types";
import { nakshatraOf } from "./helpers";

export function calculateGana(personA: BirthChart, personB: BirthChart): KootaResult {
  const a = nakshatraOf(personA).gana;
  const b = nakshatraOf(personB).gana;
  const score = GANA_SCORES[a][b];

  return {
    key: "gana",
    name: "Gana",
    score,
    maximum: 6,
    summary: `${a} and ${b}`,
    details:
      "Gana classifies Nakshatras as Deva, Manushya or Rakshasa. Similar or traditionally harmonious temperaments score higher than difficult pairings."
  };
}
