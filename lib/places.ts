import placesData from "@/data/places.json";
import listsData from "@/data/lists.json";
import type { Place } from "@/lib/types";

export const places = placesData as Place[];

export type ListFilter = "all" | string;

const listOrder = new Map(
  (listsData as { id: string }[]).map((l, i) => [l.id, i]),
);

export function getSourceLists(list: Place[] = places) {
  const map = new Map<
    string,
    { id: string; name: string; url: string; count: number }
  >();
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
  return [...map.values()].sort((a, b) => {
    const ai = listOrder.get(a.id) ?? 999;
    const bi = listOrder.get(b.id) ?? 999;
    return ai - bi || a.name.localeCompare(b.name);
  });
}

export function filterByList(list: Place[], filter: ListFilter) {
  if (filter === "all") return list;
  return list.filter((p) => p.sourceList === filter);
}

export function neighbourhoodKey(place: Place) {
  const nb =
    !place.neighbourhood ||
    place.neighbourhood === "Unknown" ||
    place.neighbourhood === "Japan"
      ? "Other"
      : place.neighbourhood;
  const city =
    !place.city || place.city === "Japan" || place.city === "Unknown"
      ? null
      : place.city;
  return city && city !== nb ? `${city} · ${nb}` : nb;
}

export function groupByNeighbourhood(list: Place[]) {
  const map = new Map<string, Place[]>();
  for (const p of list) {
    const key = neighbourhoodKey(p);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  }
  return [...map.entries()].sort((a, b) => {
    if (a[0] === "Other") return 1;
    if (b[0] === "Other") return -1;
    return a[0].localeCompare(b[0]);
  });
}

export function mappablePlaces(list: Place[]) {
  return list.filter(
    (p): p is Place & { lat: number; lng: number } =>
      p.lat != null && p.lng != null,
  );
}
