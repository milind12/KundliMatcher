import { beforeEach, describe, expect, it } from "vitest";
import {
  clearPinnedProfile,
  loadPinnedProfile,
  savePinnedProfile
} from "../src/storage/profiles";

describe("pinned profile storage", () => {
  beforeEach(() => window.localStorage.clear());

  it("persists one explicitly pinned role", () => {
    savePinnedProfile({
      version: 1,
      role: "boy",
      details: {
        id: "boy",
        name: "Rahul",
        date: "1992-02-14",
        time: "22:45",
        place: "Rajkot, Gujarat, India",
        latitude: 22.29161,
        longitude: 70.79322,
        timezone: "+05:30"
      }
    });

    expect(loadPinnedProfile()).toMatchObject({ role: "boy", details: { name: "Rahul" } });
    clearPinnedProfile();
    expect(loadPinnedProfile()).toBeNull();
  });
});
