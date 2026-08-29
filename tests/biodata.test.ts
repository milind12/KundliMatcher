import { describe, expect, it } from "vitest";
import { parseBiodataText } from "../src/features/biodata/biodataParser";

describe("biodata parser", () => {
  it("extracts common Indian biodata fields", () => {
    const result = parseBiodataText(`
      MARRIAGE BIODATA
      Name: Rahul Sharma
      Date of Birth: 14/02/1992
      Time of Birth: 10:45 PM
      Place of Birth: Rajkot, Gujarat
    `);

    expect(result).toMatchObject({
      name: "Rahul Sharma",
      date: "1992-02-14",
      time: "22:45",
      place: "Rajkot, Gujarat"
    });
  });

  it("supports dates written with month names and 12-hour times", () => {
    const result = parseBiodataText(`
      Full Name - Asha Mehta
      DOB - 3rd August 1995
      Birth Time - 12:05 a.m.
      Birthplace - Surat
    `);

    expect(result).toMatchObject({
      name: "Asha Mehta",
      date: "1995-08-03",
      time: "00:05",
      place: "Surat"
    });
  });
});
