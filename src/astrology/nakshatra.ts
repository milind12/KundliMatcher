import { NAKSHATRAS, NAKSHATRA_SPAN, PADA_SPAN } from "../data/nakshatras";
import { clamp, normalizeDegrees } from "../utils/number";

export function getNakshatraIndex(siderealLongitude: number): number {
  return clamp(Math.floor(normalizeDegrees(siderealLongitude) / NAKSHATRA_SPAN), 0, 26);
}

export function getNakshatraPada(siderealLongitude: number): number {
  const withinNakshatra = normalizeDegrees(siderealLongitude) % NAKSHATRA_SPAN;
  return clamp(Math.floor(withinNakshatra / PADA_SPAN) + 1, 1, 4);
}

export function getNakshatra(siderealLongitude: number) {
  return NAKSHATRAS[getNakshatraIndex(siderealLongitude)];
}
