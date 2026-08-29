import { calculateBirthChart } from "../../astrology/birthChart";
import { birthDetailsSchema } from "../birth-profile/schema";
import { createMatchReport } from "../../guna/calculateGunas";
import type { BirthDetails, MatchReport } from "../../types";

export function calculateReport(personA: BirthDetails, personB: BirthDetails): MatchReport {
  const validA = birthDetailsSchema.parse(personA);
  const validB = birthDetailsSchema.parse(personB);
  return createMatchReport(calculateBirthChart(validA), calculateBirthChart(validB));
}
