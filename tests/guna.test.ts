import { describe, expect, it } from "vitest";
import { calculateGunas } from "../src/guna/calculateGunas";
import type { BirthChart } from "../src/types";

function chart(nakshatraIndex: number, rashiIndex: number): BirthChart {
  return {
    details: {
      id: `${nakshatraIndex}-${rashiIndex}`,
      name: "",
      date: "1990-01-01",
      time: "12:00",
      place: "Mumbai, India",
      latitude: 19.076,
      longitude: 72.8777,
      timezone: "+05:30"
    },
    moonLongitude: rashiIndex * 30,
    nakshatraIndex,
    nakshatraPada: 1,
    nakshatraName: "",
    rashiIndex,
    rashiName: ""
  };
}

describe("calculateGunas", () => {
  it("returns a complete 36 point report", () => {
    const result = calculateGunas(chart(0, 0), chart(0, 0));

    expect(result.maximum).toBe(36);
    expect(result.varna.maximum).toBe(1);
    expect(result.vashya.maximum).toBe(2);
    expect(result.tara.maximum).toBe(3);
    expect(result.yoni.maximum).toBe(4);
    expect(result.grahaMaitri.maximum).toBe(5);
    expect(result.gana.maximum).toBe(6);
    expect(result.bhakoot.maximum).toBe(7);
    expect(result.nadi.maximum).toBe(8);
  });

  it("scores same Nadi as zero and different Nadi as full", () => {
    expect(calculateGunas(chart(0, 0), chart(5, 2)).nadi.score).toBe(0);
    expect(calculateGunas(chart(0, 0), chart(1, 1)).nadi.score).toBe(8);
  });

  it("marks 2/12, 5/9 and 6/8 Bhakoot distances as unfavorable", () => {
    expect(calculateGunas(chart(0, 0), chart(1, 1)).bhakoot.score).toBe(0);
    expect(calculateGunas(chart(0, 0), chart(11, 4)).bhakoot.score).toBe(0);
    expect(calculateGunas(chart(0, 0), chart(13, 5)).bhakoot.score).toBe(0);
  });
});
