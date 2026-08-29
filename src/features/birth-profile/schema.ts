import { z } from "zod";

export const birthDetailsSchema = z.object({
  id: z.string().min(1),
  name: z.string().max(80),
  date: z.string().min(1, "Choose a birth date.").regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().min(1, "Enter the exact birth time.").regex(/^\d{2}:\d{2}$/),
  place: z.string().min(2, "Enter a birthplace or choose a city."),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().regex(/^[+-]\d{2}:?\d{2}$/, "Use a timezone like +05:30.")
});
