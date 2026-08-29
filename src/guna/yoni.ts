import { YONI_ENEMIES } from "../data/scoring";
import type { BirthChart, KootaResult } from "../types";
import { nakshatraOf, pairKey } from "./helpers";

export function calculateYoni(personA: BirthChart, personB: BirthChart): KootaResult {
  const a = nakshatraOf(personA).yoni;
  const b = nakshatraOf(personB).yoni;
  const score = a === b ? 4 : YONI_ENEMIES.has(pairKey(a, b)) ? 0 : 3;

  return {
    key: "yoni",
    name: "Yoni",
    score,
    maximum: 4,
    summary: `${a} and ${b}`,
    details:
      "Yoni compares animal symbols assigned to the Nakshatras. Same Yoni receives full points, traditional enemy pairs receive zero, and neutral combinations receive a high partial score in this base rule set."
  };
}
