import { INDIA_CITY_ROWS } from "./india-cities";

export interface CityOption {
  name: string;
  label: string;
  latitude: number;
  longitude: number;
  timezone: string;
  population: number;
}

const INDIA_TIMEZONE = "+05:30";

const INDIA_CITY_OPTIONS: CityOption[] = INDIA_CITY_ROWS.map(
  ([name, state, latitude, longitude, population]) => ({
    name,
    label: `${name}, ${state}, India`,
    latitude,
    longitude,
    timezone: INDIA_TIMEZONE,
    population
  })
);

const INTERNATIONAL_CITY_OPTIONS: CityOption[] = [
  {
    name: "New York",
    label: "New York, United States",
    latitude: 40.7128,
    longitude: -74.006,
    timezone: "-05:00",
    population: 8_258_035
  },
  {
    name: "London",
    label: "London, United Kingdom",
    latitude: 51.5072,
    longitude: -0.1276,
    timezone: "+00:00",
    population: 8_866_180
  },
  {
    name: "Dubai",
    label: "Dubai, United Arab Emirates",
    latitude: 25.2048,
    longitude: 55.2708,
    timezone: "+04:00",
    population: 3_655_000
  },
  {
    name: "Singapore",
    label: "Singapore",
    latitude: 1.3521,
    longitude: 103.8198,
    timezone: "+08:00",
    population: 5_917_648
  }
];

export const CITY_OPTIONS: CityOption[] = [
  ...INDIA_CITY_OPTIONS,
  ...INTERNATIONAL_CITY_OPTIONS
];

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
}

function countryOnlyLabel(city: CityOption): string | undefined {
  return city.label.endsWith(", India") ? `${city.name}, India` : undefined;
}

function stateLabel(city: CityOption): string | undefined {
  return city.label.endsWith(", India") ? city.label.slice(0, -", India".length) : undefined;
}

export function findCity(place: string): CityOption | undefined {
  const query = normalize(place);
  if (!query) return undefined;

  const labelMatch = CITY_OPTIONS.find((city) => normalize(city.label) === query);
  if (labelMatch) return labelMatch;

  const countryOnlyMatch = CITY_OPTIONS.find(
    (city) => normalize(countryOnlyLabel(city) ?? "") === query
  );
  if (countryOnlyMatch) return countryOnlyMatch;

  const stateMatch = CITY_OPTIONS.find(
    (city) => normalize(stateLabel(city) ?? "") === query
  );
  if (stateMatch) return stateMatch;

  return CITY_OPTIONS
    .filter((city) => normalize(city.name) === query)
    .sort((a, b) => b.population - a.population)[0];
}

export function searchCities(place: string, limit = 24): CityOption[] {
  const query = normalize(place);

  return CITY_OPTIONS
    .map((city) => {
      const name = normalize(city.name);
      const label = normalize(city.label);
      const shortLabel = normalize(countryOnlyLabel(city) ?? "");
      let rank = 5;

      if (!query) rank = 4;
      else if (name === query) rank = 0;
      else if (name.startsWith(query)) rank = 1;
      else if (label.startsWith(query) || shortLabel.startsWith(query)) rank = 2;
      else if (name.includes(query)) rank = 3;
      else if (label.includes(query) || shortLabel.includes(query)) rank = 4;

      return { city, rank };
    })
    .filter(({ rank }) => rank < 5)
    .sort((a, b) => a.rank - b.rank || b.city.population - a.city.population)
    .slice(0, limit)
    .map(({ city }) => city);
}
