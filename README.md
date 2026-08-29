# Kundli Matcher

A private, client-side Kundli matching and 36 Guna Milan calculator built with
React, TypeScript and Vite.

## What it includes

- Browser-only birth profile entry with optional local storage.
- Offline birthplace search covering more than 6,000 Indian cities and towns.
- Sidereal Moon, Nakshatra and Rashi calculation using a Lahiri ayanamsha approximation.
- Separate Ashtakoota modules for Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot and Nadi.
- Expandable result explanations and previous match history.
- SEO-ready `index.html`, structured data, `robots.txt`, `sitemap.xml`, favicon and web manifest.
- Vitest unit tests, a Playwright smoke test and a GitHub Pages deployment workflow.

## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npm test
npm run build
npm run test:e2e
```

## Before publishing

Replace `https://example.com/` in `index.html`, `public/robots.txt` and
`public/sitemap.xml` with the final GitHub Pages or custom-domain URL.

## Privacy

The app has no backend. Birth details are calculated in the browser and are saved
only to `localStorage` when "Remember profiles and matches" is enabled.

## City data

Indian city names and coordinates are derived from the GeoNames `cities5000` and
`admin1CodesASCII` datasets, licensed under CC BY 4.0. Regenerate the bundled
offline index with `npm run cities:generate`.

## Accuracy note

This version implements a transparent base Ashtakoota rule set. Some traditions
use different mappings or exception rules, especially for Bhakoot and Nadi. Those
rules live in `src/data` and `src/guna` so they can be reviewed and adjusted.
