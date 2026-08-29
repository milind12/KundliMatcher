import type { Planet } from "./rashis";

export const VARNA_RANK = {
  Shudra: 1,
  Vaishya: 2,
  Kshatriya: 3,
  Brahmin: 4
} as const;

export const VASHYA_SCORES: Record<string, Record<string, number>> = {
  Chatushpada: { Chatushpada: 2, Manava: 1, Jalachara: 1, Vanachara: 0, Keeta: 1 },
  Manava: { Chatushpada: 1, Manava: 2, Jalachara: 1, Vanachara: 0, Keeta: 1 },
  Jalachara: { Chatushpada: 1, Manava: 1, Jalachara: 2, Vanachara: 1, Keeta: 1 },
  Vanachara: { Chatushpada: 0, Manava: 0, Jalachara: 1, Vanachara: 2, Keeta: 0 },
  Keeta: { Chatushpada: 1, Manava: 1, Jalachara: 1, Vanachara: 0, Keeta: 2 }
};

export const PLANET_RELATIONS: Record<Planet, Record<Planet, "friend" | "neutral" | "enemy">> = {
  Sun: { Sun: "friend", Moon: "friend", Mars: "friend", Mercury: "neutral", Jupiter: "friend", Venus: "enemy", Saturn: "enemy" },
  Moon: { Sun: "friend", Moon: "friend", Mars: "neutral", Mercury: "friend", Jupiter: "neutral", Venus: "neutral", Saturn: "neutral" },
  Mars: { Sun: "friend", Moon: "friend", Mars: "friend", Mercury: "enemy", Jupiter: "friend", Venus: "neutral", Saturn: "neutral" },
  Mercury: { Sun: "friend", Moon: "enemy", Mars: "neutral", Mercury: "friend", Jupiter: "neutral", Venus: "friend", Saturn: "neutral" },
  Jupiter: { Sun: "friend", Moon: "friend", Mars: "friend", Mercury: "enemy", Jupiter: "friend", Venus: "enemy", Saturn: "neutral" },
  Venus: { Sun: "enemy", Moon: "enemy", Mars: "neutral", Mercury: "friend", Jupiter: "neutral", Venus: "friend", Saturn: "friend" },
  Saturn: { Sun: "enemy", Moon: "enemy", Mars: "enemy", Mercury: "friend", Jupiter: "neutral", Venus: "friend", Saturn: "friend" }
};

export const YONI_ENEMIES = new Set([
  "Horse:Buffalo",
  "Elephant:Lion",
  "Sheep:Monkey",
  "Serpent:Mongoose",
  "Dog:Deer",
  "Cat:Rat",
  "Cow:Tiger"
]);

export const GANA_SCORES: Record<string, Record<string, number>> = {
  Deva: { Deva: 6, Manushya: 5, Rakshasa: 1 },
  Manushya: { Deva: 5, Manushya: 6, Rakshasa: 0 },
  Rakshasa: { Deva: 0, Manushya: 0, Rakshasa: 6 }
};
