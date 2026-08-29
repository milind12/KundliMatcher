export type KootaKey =
  | "varna"
  | "vashya"
  | "tara"
  | "yoni"
  | "grahaMaitri"
  | "gana"
  | "bhakoot"
  | "nadi";

export interface BirthDetails {
  id: string;
  name: string;
  date: string;
  time: string;
  place: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface BirthChart {
  details: BirthDetails;
  moonLongitude: number;
  nakshatraIndex: number;
  nakshatraPada: number;
  nakshatraName: string;
  rashiIndex: number;
  rashiName: string;
}

export interface KootaResult {
  key: KootaKey;
  name: string;
  score: number;
  maximum: number;
  summary: string;
  details: string;
}

export interface GunaResult {
  varna: KootaResult;
  vashya: KootaResult;
  tara: KootaResult;
  yoni: KootaResult;
  grahaMaitri: KootaResult;
  gana: KootaResult;
  bhakoot: KootaResult;
  nadi: KootaResult;
  total: number;
  maximum: 36;
  verdict: string;
}

export interface MatchReport {
  personA: BirthChart;
  personB: BirthChart;
  guna: GunaResult;
  createdAt: string;
}

export interface StoredData {
  version: 1;
  personA?: BirthDetails;
  personB?: BirthDetails;
  previousMatches: MatchReport[];
  remember: boolean;
}
