import { normalizeDegrees } from "../utils/number";

export function lahiriAyanamsha(jd: number): number {
  const daysSinceJ2000 = jd - 2451545.0;
  const yearsSinceJ2000 = daysSinceJ2000 / 365.2425;
  return 23.853055 + (50.290966 * yearsSinceJ2000) / 3600;
}

export function toSiderealLongitude(tropicalLongitude: number, jd: number): number {
  return normalizeDegrees(tropicalLongitude - lahiriAyanamsha(jd));
}
