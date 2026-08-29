import { RASHIS, RASHI_SPAN } from "../data/rashis";
import { clamp, normalizeDegrees } from "../utils/number";

export function getRashiIndex(siderealLongitude: number): number {
  return clamp(Math.floor(normalizeDegrees(siderealLongitude) / RASHI_SPAN), 0, 11);
}

export function getRashi(siderealLongitude: number) {
  return RASHIS[getRashiIndex(siderealLongitude)];
}
