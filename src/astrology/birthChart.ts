import type { BirthChart, BirthDetails } from "../types";
import { birthDateToUtc, julianDay, moonTropicalLongitude } from "./astronomical";
import { toSiderealLongitude } from "./ayanamsha";
import { getNakshatra, getNakshatraIndex, getNakshatraPada } from "./nakshatra";
import { getRashi, getRashiIndex } from "./rashi";

export function calculateBirthChart(details: BirthDetails): BirthChart {
  const utcBirth = birthDateToUtc(details.date, details.time, details.timezone);
  const jd = julianDay(utcBirth);
  const siderealMoon = toSiderealLongitude(moonTropicalLongitude(jd), jd);
  const nakshatra = getNakshatra(siderealMoon);
  const rashi = getRashi(siderealMoon);

  return {
    details,
    moonLongitude: siderealMoon,
    nakshatraIndex: getNakshatraIndex(siderealMoon),
    nakshatraPada: getNakshatraPada(siderealMoon),
    nakshatraName: nakshatra.name,
    rashiIndex: getRashiIndex(siderealMoon),
    rashiName: rashi.name
  };
}
