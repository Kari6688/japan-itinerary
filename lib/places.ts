import placesData from "@/data/places.json";
import type { Place, PlaceCategory } from "@/lib/types";

export const places = placesData as Place[];

export function getCities(list: Place[] = places) {
  const counts = new Map<string, number>();
  for (const p of list) {
    if (p.city === "Japan" || p.city === "Unknown") continue;
    counts.set(p.city, (counts.get(p.city) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
}

export function getNeighbourhoods(list: Place[] = places, city?: string) {
  const filtered = city ? list.filter((p) => p.city === city) : list;
  const counts = new Map<string, number>();
  for (const p of filtered) {
    if (!p.neighbourhood || p.neighbourhood === "Unknown" || p.neighbourhood === "Japan") {
      continue;
    }
    counts.set(p.neighbourhood, (counts.get(p.neighbourhood) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, count }));
}

export function getCategories(list: Place[] = places) {
  const counts = new Map<PlaceCategory, number>();
  for (const p of list) {
    counts.set(p.category, (counts.get(p.category) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
}

export function getSourceLists(list: Place[] = places) {
  const map = new Map<string, { id: string; name: string; url: string; count: number }>();
  for (const p of list) {
    const existing = map.get(p.sourceList);
    if (existing) existing.count += 1;
    else {
      map.set(p.sourceList, {
        id: p.sourceList,
        name: p.sourceListName,
        url: p.sourceUrl,
        count: 1,
      });
    }
  }
  return [...map.values()];
}

export function filterPlaces(
  list: Place[],
  opts: {
    city?: string;
    neighbourhood?: string;
    category?: string;
    query?: string;
    sourceList?: string;
    savedOnly?: boolean;
    savedIds?: Set<string>;
  },
) {
  const q = opts.query?.trim().toLowerCase();
  return list.filter((p) => {
    if (opts.city && p.city !== opts.city) return false;
    if (opts.neighbourhood && p.neighbourhood !== opts.neighbourhood) return false;
    if (opts.category && p.category !== opts.category) return false;
    if (opts.sourceList && p.sourceList !== opts.sourceList) return false;
    if (opts.savedOnly && opts.savedIds && !opts.savedIds.has(p.id)) return false;
    if (q) {
      const hay = `${p.name} ${p.neighbourhood} ${p.city} ${p.subtype ?? ""} ${p.address ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export const tripStats = {
  total: places.length,
  withCoords: places.filter((p) => p.lat != null && p.lng != null).length,
  cities: getCities().length,
  neighbourhoods: getNeighbourhoods().length,
};
