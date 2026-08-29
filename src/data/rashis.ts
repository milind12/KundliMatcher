export type Planet =
  | "Sun"
  | "Moon"
  | "Mars"
  | "Mercury"
  | "Jupiter"
  | "Venus"
  | "Saturn";

export interface Rashi {
  index: number;
  name: string;
  lord: Planet;
  varna: "Brahmin" | "Kshatriya" | "Vaishya" | "Shudra";
  vashya: "Chatushpada" | "Manava" | "Jalachara" | "Vanachara" | "Keeta";
}

export const RASHIS: Rashi[] = [
  { index: 0, name: "Mesha", lord: "Mars", varna: "Kshatriya", vashya: "Chatushpada" },
  { index: 1, name: "Vrishabha", lord: "Venus", varna: "Vaishya", vashya: "Chatushpada" },
  { index: 2, name: "Mithuna", lord: "Mercury", varna: "Shudra", vashya: "Manava" },
  { index: 3, name: "Karka", lord: "Moon", varna: "Brahmin", vashya: "Jalachara" },
  { index: 4, name: "Simha", lord: "Sun", varna: "Kshatriya", vashya: "Vanachara" },
  { index: 5, name: "Kanya", lord: "Mercury", varna: "Vaishya", vashya: "Manava" },
  { index: 6, name: "Tula", lord: "Venus", varna: "Shudra", vashya: "Manava" },
  { index: 7, name: "Vrishchika", lord: "Mars", varna: "Brahmin", vashya: "Keeta" },
  { index: 8, name: "Dhanu", lord: "Jupiter", varna: "Kshatriya", vashya: "Chatushpada" },
  { index: 9, name: "Makara", lord: "Saturn", varna: "Vaishya", vashya: "Chatushpada" },
  { index: 10, name: "Kumbha", lord: "Saturn", varna: "Shudra", vashya: "Manava" },
  { index: 11, name: "Meena", lord: "Jupiter", varna: "Brahmin", vashya: "Jalachara" }
];

export const RASHI_SPAN = 30;
