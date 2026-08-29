import type { PinnedProfile, StoredData } from "../types";

const STORAGE_KEY = "guna-milan:v1";
const PINNED_PROFILE_KEY = "guna-milan:pinned-profile:v1";

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

export function loadPinnedProfile(): PinnedProfile | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(PINNED_PROFILE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PinnedProfile;
    return parsed.version === 1 && (parsed.role === "boy" || parsed.role === "girl")
      ? parsed
      : null;
  } catch {
    return null;
  }
}

export function savePinnedProfile(profile: PinnedProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PINNED_PROFILE_KEY, JSON.stringify(profile));
}

export function clearPinnedProfile(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PINNED_PROFILE_KEY);
}
