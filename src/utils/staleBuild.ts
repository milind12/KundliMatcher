const STALE_BUILD_MESSAGE =
  "The app was updated while this page was open. Refresh the page, then import the biodata again.";

function isDynamicImportFailure(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Expected a JavaScript module script|disallowed MIME type/i.test(
    error.message
  );
}

async function clearAppCaches() {
  if ("caches" in window) {
    const cacheNames = await window.caches.keys();
    await Promise.all(cacheNames.map((cacheName) => window.caches.delete(cacheName)));
  }

  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }
}

export async function recoverFromStaleBuild(error: unknown): Promise<string | null> {
  if (!isDynamicImportFailure(error)) return null;

  try {
    await clearAppCaches();
  } catch {
    // A manual refresh still recovers the page even if cache cleanup is blocked.
  }

  return STALE_BUILD_MESSAGE;
}
