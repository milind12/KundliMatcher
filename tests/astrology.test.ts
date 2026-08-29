import { describe, expect, it } from "vitest";
import { birthDateToUtc, julianDay } from "../src/astrology/astronomical";
import { getNakshatraIndex, getNakshatraPada } from "../src/astrology/nakshatra";
import { getRashiIndex } from "../src/astrology/rashi";

describe("astrology helpers", () => {
  it("converts local birth time to UTC with an explicit offset", () => {
    const utc = birthDateToUtc("1990-01-01", "05:30", "+05:30");
    expect(utc.toISOString()).toBe("1990-01-01T00:00:00.000Z");
  });

  it("computes Julian day for Unix epoch", () => {
    expect(julianDay(new Date("1970-01-01T00:00:00.000Z"))).toBe(2440587.5);
  });

  it("maps sidereal longitude to Rashi, Nakshatra and Pada", () => {
    expect(getRashiIndex(29.9)).toBe(0);
    expect(getRashiIndex(30)).toBe(1);
    expect(getNakshatraIndex(0)).toBe(0);
    expect(getNakshatraIndex(13.4)).toBe(1);
    expect(getNakshatraPada(3.4)).toBe(2);
  });
});
