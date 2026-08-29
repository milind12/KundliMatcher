import type { StoredData } from "../types";

const STORAGE_KEY = "guna-milan:v1";

export const EMPTY_STORAGE: StoredData = {
  version: 1,
  previousMatches: [],
  remember: false
};

export function loadStoredData(): StoredData {
  if (typeof window === "undefined") return EMPTY_STORAGE;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return EMPTY_STORAGE;

  try {
    const parsed = JSON.parse(raw) as StoredData;
    return parsed.version === 1
      ? { ...EMPTY_STORAGE, ...parsed, previousMatches: parsed.previousMatches ?? [] }
      : EMPTY_STORAGE;
  } catch {
    return EMPTY_STORAGE;
  }
}

export function saveStoredData(data: StoredData): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearStoredData(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
