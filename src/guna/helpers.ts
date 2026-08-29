import { NAKSHATRAS } from "../data/nakshatras";
import { RASHIS } from "../data/rashis";
import type { BirthChart } from "../types";

export function nakshatraOf(chart: BirthChart) {
  return NAKSHATRAS[chart.nakshatraIndex];
}

export function rashiOf(chart: BirthChart) {
  return RASHIS[chart.rashiIndex];
}

export function inclusiveDistance(fromIndex: number, toIndex: number, cycle: number): number {
  return ((toIndex - fromIndex + cycle) % cycle) + 1;
}

export function pairKey(a: string, b: string): string {
  return [a, b].sort().join(":");
}
