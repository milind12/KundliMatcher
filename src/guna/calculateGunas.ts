import type { BirthChart, GunaResult, KootaResult, MatchReport } from "../types";
import { calculateBhakoot } from "./bhakoot";
import { calculateGana } from "./gana";
import { calculateGrahaMaitri } from "./grahaMaitri";
import { calculateNadi } from "./nadi";
import { calculateTara } from "./tara";
import { calculateVarna } from "./varna";
import { calculateVashya } from "./vashya";
import { calculateYoni } from "./yoni";

const ORDERED_KOOTAS = [
  calculateVarna,
  calculateVashya,
  calculateTara,
  calculateYoni,
  calculateGrahaMaitri,
  calculateGana,
  calculateBhakoot,
  calculateNadi
];

function verdictFor(total: number): string {
  if (total >= 28) return "Excellent traditional match";
  if (total >= 24) return "Good traditional match";
  if (total >= 18) return "Acceptable with review";
  return "Needs careful review";
}

export function orderedKootas(result: GunaResult): KootaResult[] {
  return [
    result.varna,
    result.vashya,
    result.tara,
    result.yoni,
    result.grahaMaitri,
    result.gana,
    result.bhakoot,
    result.nadi
  ];
}

export function calculateGunas(personA: BirthChart, personB: BirthChart): GunaResult {
  const kootas = ORDERED_KOOTAS.map((calculate) => calculate(personA, personB));
  const total = kootas.reduce((sum, koota) => sum + koota.score, 0);

  return {
    varna: kootas[0],
    vashya: kootas[1],
    tara: kootas[2],
    yoni: kootas[3],
    grahaMaitri: kootas[4],
    gana: kootas[5],
    bhakoot: kootas[6],
    nadi: kootas[7],
    total,
    maximum: 36,
    verdict: verdictFor(total)
  };
}

export function createMatchReport(personA: BirthChart, personB: BirthChart): MatchReport {
  return {
    personA,
    personB,
    guna: calculateGunas(personA, personB),
    createdAt: new Date().toISOString()
  };
}
