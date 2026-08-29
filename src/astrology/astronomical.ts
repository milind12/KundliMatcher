import { normalizeDegrees } from "../utils/number";

const DEG_TO_RAD = Math.PI / 180;

function sinDeg(value: number): number {
  return Math.sin(value * DEG_TO_RAD);
}

export function parseTimezoneOffset(timezone: string): number {
  const match = timezone.trim().match(/^([+-])(\d{2}):?(\d{2})$/);
  if (!match) {
    throw new Error("Timezone must use the format +05:30 or -04:00.");
  }

  const sign = match[1] === "-" ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = Number(match[3]);

  if (hours > 14 || minutes > 59) {
    throw new Error("Timezone offset is outside the supported range.");
  }

  return sign * (hours * 60 + minutes);
}

export function birthDateToUtc(date: string, time: string, timezone: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const offsetMinutes = parseTimezoneOffset(timezone);
  const utcMs = Date.UTC(year, month - 1, day, hour, minute) - offsetMinutes * 60_000;
  return new Date(utcMs);
}

export function julianDay(date: Date): number {
  return date.getTime() / 86_400_000 + 2440587.5;
}

export function moonTropicalLongitude(jd: number): number {
  const t = (jd - 2451545.0) / 36525;
  const l = normalizeDegrees(
    218.3164477 +
      481267.88123421 * t -
      0.0015786 * t * t +
      (t * t * t) / 538841 -
      (t * t * t * t) / 65194000
  );
  const d = normalizeDegrees(
    297.8501921 +
      445267.1114034 * t -
      0.0018819 * t * t +
      (t * t * t) / 545868 -
      (t * t * t * t) / 113065000
  );
  const m = normalizeDegrees(
    357.5291092 +
      35999.0502909 * t -
      0.0001536 * t * t +
      (t * t * t) / 24490000
  );
  const mp = normalizeDegrees(
    134.9633964 +
      477198.8675055 * t +
      0.0087414 * t * t +
      (t * t * t) / 69699 -
      (t * t * t * t) / 14712000
  );
  const f = normalizeDegrees(
    93.272095 +
      483202.0175233 * t -
      0.0036539 * t * t -
      (t * t * t) / 3526000 +
      (t * t * t * t) / 863310000
  );

  const correction =
    6.289 * sinDeg(mp) +
    1.274 * sinDeg(2 * d - mp) +
    0.658 * sinDeg(2 * d) +
    0.214 * sinDeg(2 * mp) -
    0.186 * sinDeg(m) -
    0.114 * sinDeg(2 * f) +
    0.059 * sinDeg(2 * d - 2 * mp) +
    0.057 * sinDeg(2 * d - m - mp) +
    0.053 * sinDeg(2 * d + mp) +
    0.046 * sinDeg(2 * d - m) +
    0.041 * sinDeg(m - mp) -
    0.035 * sinDeg(d) -
    0.031 * sinDeg(m + mp) -
    0.015 * sinDeg(2 * f - 2 * d);

  return normalizeDegrees(l + correction);
}
