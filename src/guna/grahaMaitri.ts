import { PLANET_RELATIONS } from "../data/scoring";
import type { Planet } from "../data/rashis";
import type { BirthChart, KootaResult } from "../types";
import { rashiOf } from "./helpers";

function relationScore(aLord: Planet, bLord: Planet): number {
  if (aLord === bLord) return 5;

  const aToB = PLANET_RELATIONS[aLord][bLord];
  const bToA = PLANET_RELATIONS[bLord][aLord];
  const pair = [aToB, bToA].sort().join("-");

  if (pair === "friend-friend") return 5;
  if (pair === "friend-neutral") return 4;
  if (pair === "neutral-neutral") return 3;
  if (pair === "enemy-friend") return 1;
  if (pair === "enemy-neutral") return 0.5;
  return 0;
}

export function calculateGrahaMaitri(personA: BirthChart, personB: BirthChart): KootaResult {
  const aLord = rashiOf(personA).lord;
  const bLord = rashiOf(personB).lord;
  const score = relationScore(aLord, bLord);

  return {
    key: "grahaMaitri",
    name: "Graha Maitri",
    score,
    maximum: 5,
    summary: `${aLord} and ${bLord}`,
    details:
      "Graha Maitri evaluates the natural relationship between the lords of the Moon signs. Friendlier planetary relationships receive higher compatibility points."
  };
}
