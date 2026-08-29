import type { BirthChart, KootaResult } from "../types";
import { inclusiveDistance } from "./helpers";

function taraIsFavorable(distance: number): boolean {
  const remainder = distance % 9 || 9;
  return ![3, 5, 7].includes(remainder);
}

export function calculateTara(personA: BirthChart, personB: BirthChart): KootaResult {
  const aToB = inclusiveDistance(personA.nakshatraIndex, personB.nakshatraIndex, 27);
  const bToA = inclusiveDistance(personB.nakshatraIndex, personA.nakshatraIndex, 27);
  const favorableCount = Number(taraIsFavorable(aToB)) + Number(taraIsFavorable(bToA));
  const score = favorableCount * 1.5;

  return {
    key: "tara",
    name: "Tara",
    score,
    maximum: 3,
    summary: `${aToB} and ${bToA} Nakshatra counts`,
    details:
      "Tara evaluates birth-star harmony by counting from each Nakshatra to the other. Counts falling on the 3rd, 5th or 7th Tara positions in a 9-star cycle are treated as unfavorable."
  };
}
