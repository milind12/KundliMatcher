import { VARNA_RANK } from "../data/scoring";
import type { BirthChart, KootaResult } from "../types";
import { rashiOf } from "./helpers";

export function calculateVarna(personA: BirthChart, personB: BirthChart): KootaResult {
  const brideVarna = rashiOf(personA).varna;
  const groomVarna = rashiOf(personB).varna;
  const score = VARNA_RANK[groomVarna] >= VARNA_RANK[brideVarna] ? 1 : 0;

  return {
    key: "varna",
    name: "Varna",
    score,
    maximum: 1,
    summary: `${brideVarna} matched with ${groomVarna}`,
    details:
      "Varna compares the spiritual temperament traditionally assigned to the Moon signs. This implementation awards the point when Person 2's Varna rank is equal to or higher than Person 1's."
  };
}
