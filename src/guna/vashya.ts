import { VASHYA_SCORES } from "../data/scoring";
import type { BirthChart, KootaResult } from "../types";
import { rashiOf } from "./helpers";

export function calculateVashya(personA: BirthChart, personB: BirthChart): KootaResult {
  const a = rashiOf(personA).vashya;
  const b = rashiOf(personB).vashya;
  const score = VASHYA_SCORES[a][b];

  return {
    key: "vashya",
    name: "Vashya",
    score,
    maximum: 2,
    summary: `${a} and ${b}`,
    details:
      "Vashya groups Moon signs by traditional influence or attraction categories. Same groups receive the highest score; difficult pairs receive less."
  };
}
