import { describe, expect, it } from "vitest";
import { findCity, searchCities } from "../src/data/cities";

describe("offline city lookup", () => {
  it("resolves Rajkot from its short name", () => {
    expect(findCity("rajkot")).toMatchObject({
      label: "Rajkot, Gujarat, India",
      latitude: 22.29161,
      longitude: 70.79322,
      timezone: "+05:30"
    });
    expect(findCity("Rajkot, India")?.label).toBe("Rajkot, Gujarat, India");
  });

  it("ranks matching city names ahead of state-only matches", () => {
    expect(searchCities("rajkot")[0]?.label).toBe("Rajkot, Gujarat, India");
  });
});
