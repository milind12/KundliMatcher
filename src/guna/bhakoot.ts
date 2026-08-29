import type { BirthChart, KootaResult } from "../types";
import { inclusiveDistance } from "./helpers";

export function calculateBhakoot(personA: BirthChart, personB: BirthChart): KootaResult {
  const aToB = inclusiveDistance(personA.rashiIndex, personB.rashiIndex, 12);
  const bToA = inclusiveDistance(personB.rashiIndex, personA.rashiIndex, 12);
  const distances = [aToB, bToA].sort((a, b) => a - b).join("-");
  const unfavorable = ["2-12", "5-9", "6-8"].includes(distances);
  const score = unfavorable ? 0 : 7;

  return {
    key: "bhakoot",
    name: "Bhakoot",
    score,
    maximum: 7,
    summary: `${aToB}/${bToA} Rashi distance`,
    details:
      "Bhakoot compares the distance between the two Moon signs. The base Ashtakoota rule marks 2/12, 5/9 and 6/8 sign relationships as unfavorable unless a tradition applies exceptions."
  };
}
