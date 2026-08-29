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

  it("aligns labels and values extracted as separate PDF columns", () => {
    const result = parseBiodataText(`
      Name
      Age
      Date of Birth
      Height
      Weight
      Location
      Birth Time
      Hobbies
      Caste
      Tanvi Patel
      26 years
      13 June 2000
      5'2"
      48 kg
      Godhra, Gujarat
      06:20 PM
      Reading
      Patel
    `);

    expect(result).toMatchObject({
      name: "Tanvi Patel",
      date: "2000-06-13",
      time: "18:20",
      place: "Godhra, Gujarat"
    });
  });

  it("defaults missing birth time to 12 PM", () => {
    const result = parseBiodataText(`
      Name: Neha Shah
      Date of Birth: 21/09/1994
      Place of Birth: Mumbai, Maharashtra
    `);

    expect(result.time).toBe("12:00");
  });

  it("uses the first name-like line when the name has no label", () => {
    const result = parseBiodataText(`
      Krishna Dharmendra Mehta
      Date of Birth: 22-07-1998
      Birth Place: Ahmedabad
      Caste: Vaishnav Vaniya
    `);

    expect(result.name).toBe("Krishna Dharmendra Mehta");
  });

  it("skips biodata headings when finding an unlabeled name", () => {
    const result = parseBiodataText(`
      MARRIAGE BIODATA
      Riya Sanjay Patel
      Date of Birth: 05-11-1997
    `);

    expect(result.name).toBe("Riya Sanjay Patel");
  });
});
