export interface Nakshatra {
  index: number;
  name: string;
  lord: string;
  gana: "Deva" | "Manushya" | "Rakshasa";
  nadi: "Adi" | "Madhya" | "Antya";
  yoni: string;
}

export const NAKSHATRAS: Nakshatra[] = [
  { index: 0, name: "Ashwini", lord: "Ketu", gana: "Deva", nadi: "Adi", yoni: "Horse" },
  { index: 1, name: "Bharani", lord: "Venus", gana: "Manushya", nadi: "Madhya", yoni: "Elephant" },
  { index: 2, name: "Krittika", lord: "Sun", gana: "Rakshasa", nadi: "Antya", yoni: "Sheep" },
  { index: 3, name: "Rohini", lord: "Moon", gana: "Manushya", nadi: "Antya", yoni: "Serpent" },
  { index: 4, name: "Mrigashira", lord: "Mars", gana: "Deva", nadi: "Madhya", yoni: "Serpent" },
  { index: 5, name: "Ardra", lord: "Rahu", gana: "Manushya", nadi: "Adi", yoni: "Dog" },
  { index: 6, name: "Punarvasu", lord: "Jupiter", gana: "Deva", nadi: "Adi", yoni: "Cat" },
  { index: 7, name: "Pushya", lord: "Saturn", gana: "Deva", nadi: "Madhya", yoni: "Sheep" },
  { index: 8, name: "Ashlesha", lord: "Mercury", gana: "Rakshasa", nadi: "Antya", yoni: "Cat" },
  { index: 9, name: "Magha", lord: "Ketu", gana: "Rakshasa", nadi: "Antya", yoni: "Rat" },
  { index: 10, name: "Purva Phalguni", lord: "Venus", gana: "Manushya", nadi: "Madhya", yoni: "Rat" },
  { index: 11, name: "Uttara Phalguni", lord: "Sun", gana: "Manushya", nadi: "Adi", yoni: "Cow" },
  { index: 12, name: "Hasta", lord: "Moon", gana: "Deva", nadi: "Adi", yoni: "Buffalo" },
  { index: 13, name: "Chitra", lord: "Mars", gana: "Rakshasa", nadi: "Madhya", yoni: "Tiger" },
  { index: 14, name: "Swati", lord: "Rahu", gana: "Deva", nadi: "Antya", yoni: "Buffalo" },
  { index: 15, name: "Vishakha", lord: "Jupiter", gana: "Rakshasa", nadi: "Antya", yoni: "Tiger" },
  { index: 16, name: "Anuradha", lord: "Saturn", gana: "Deva", nadi: "Madhya", yoni: "Deer" },
  { index: 17, name: "Jyeshtha", lord: "Mercury", gana: "Rakshasa", nadi: "Adi", yoni: "Deer" },
  { index: 18, name: "Mula", lord: "Ketu", gana: "Rakshasa", nadi: "Adi", yoni: "Dog" },
  { index: 19, name: "Purva Ashadha", lord: "Venus", gana: "Manushya", nadi: "Madhya", yoni: "Monkey" },
  { index: 20, name: "Uttara Ashadha", lord: "Sun", gana: "Manushya", nadi: "Antya", yoni: "Mongoose" },
  { index: 21, name: "Shravana", lord: "Moon", gana: "Deva", nadi: "Antya", yoni: "Monkey" },
  { index: 22, name: "Dhanishta", lord: "Mars", gana: "Rakshasa", nadi: "Madhya", yoni: "Lion" },
  { index: 23, name: "Shatabhisha", lord: "Rahu", gana: "Rakshasa", nadi: "Adi", yoni: "Horse" },
  { index: 24, name: "Purva Bhadrapada", lord: "Jupiter", gana: "Manushya", nadi: "Adi", yoni: "Lion" },
  { index: 25, name: "Uttara Bhadrapada", lord: "Saturn", gana: "Manushya", nadi: "Madhya", yoni: "Cow" },
  { index: 26, name: "Revati", lord: "Mercury", gana: "Deva", nadi: "Antya", yoni: "Elephant" }
];

export const NAKSHATRA_SPAN = 360 / 27;
export const PADA_SPAN = NAKSHATRA_SPAN / 4;
