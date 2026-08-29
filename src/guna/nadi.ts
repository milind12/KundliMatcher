import type { BirthChart, KootaResult } from "../types";
import { nakshatraOf } from "./helpers";

export function calculateNadi(personA: BirthChart, personB: BirthChart): KootaResult {
  const a = nakshatraOf(personA).nadi;
  const b = nakshatraOf(personB).nadi;
  const score = a === b ? 0 : 8;

  return {
    key: "nadi",
    name: "Nadi",
    score,
    maximum: 8,
    summary: `${a} and ${b}`,
    details:
      "Nadi is the highest-weighted Koota. Different Nadis receive full points in the base rule set; the same Nadi receives zero unless exception rules are intentionally added."
  };
}
