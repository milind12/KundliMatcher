#!/usr/bin/env bash

set -euo pipefail

repo_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
work_dir=$(mktemp -d)
trap 'rm -rf "$work_dir"' EXIT

curl -fsSL https://download.geonames.org/export/dump/cities5000.zip \
  -o "$work_dir/cities5000.zip"
curl -fsSL https://download.geonames.org/export/dump/admin1CodesASCII.txt \
  -o "$work_dir/admin1CodesASCII.txt"
unzip -q "$work_dir/cities5000.zip" -d "$work_dir"

awk -F '\t' '
  NR == FNR {
    if ($1 ~ /^IN\./) {
      state[$1] = $3
    }
    next
  }

  $9 == "IN" && $7 == "P" {
    city = $3
    region = state["IN." $11]
    if (city == "" || region == "") {
      next
    }

    key = city SUBSEP region
    population = $15 + 0
    if (!(key in best_population) || population > best_population[key]) {
      best_population[key] = population
      latitude[key] = $5
      longitude[key] = $6
    }
  }

  END {
    for (key in best_population) {
      split(key, parts, SUBSEP)
      city = parts[1]
      region = parts[2]
      gsub(/\\/, "\\\\", city)
      gsub(/"/, "\\\"", city)
      gsub(/\\/, "\\\\", region)
      gsub(/"/, "\\\"", region)
      printf "  [\"%s\", \"%s\", %s, %s, %d],\n", city, region, latitude[key], longitude[key], best_population[key]
    }
  }
' "$work_dir/admin1CodesASCII.txt" "$work_dir/cities5000.txt" \
  | LC_ALL=C sort > "$work_dir/city-rows.txt"

{
  printf '%s\n' '// Generated from GeoNames cities5000 and admin1CodesASCII.'
  printf '%s\n' '// Source: https://download.geonames.org/export/dump/'
  printf '%s\n' '// License: CC BY 4.0 https://creativecommons.org/licenses/by/4.0/'
  printf '%s\n' 'export type IndiaCityRow = readonly ['
  printf '%s\n' '  name: string,'
  printf '%s\n' '  state: string,'
  printf '%s\n' '  latitude: number,'
  printf '%s\n' '  longitude: number,'
  printf '%s\n' '  population: number'
  printf '%s\n' '];'
  printf '\n%s\n' 'export const INDIA_CITY_ROWS: readonly IndiaCityRow[] = ['
  sed '$ s/,$//' "$work_dir/city-rows.txt"
  printf '%s\n' '];'
} > "$work_dir/india-cities.ts"

mv "$work_dir/india-cities.ts" "$repo_dir/src/data/india-cities.ts"
