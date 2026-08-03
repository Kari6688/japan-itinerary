export type PlaceCategory =
  | "food"
  | "temple"
  | "museum"
  | "nature"
  | "cafe"
  | "culture"
  | "shopping";

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  subtype: string | null;
  sourceList: string;
  sourceListName: string;
  sourceUrl: string;
  rating: number | null;
  reviewCount: number | null;
  price: string | null;
  mapsUrl: string;
  lat: number | null;
  lng: number | null;
  neighbourhood: string;
  city: string;
  address: string | null;
  notes: string | null;
  priority: string;
}

export const CATEGORY_CONFIG: Record<
  PlaceCategory,
  { label: string; color: string; css: string }
> = {
  food: { label: "Food", color: "var(--food)", css: "#E07830" },
  temple: { label: "Temple / Shrine", color: "var(--accent)", css: "#2E29EB" },
  museum: { label: "Museum / Gallery", color: "var(--fuji)", css: "#5B57F0" },
  nature: { label: "Nature", color: "var(--nature)", css: "#2F9E6F" },
  cafe: { label: "Cafe", color: "var(--cafe)", css: "#C9A227" },
  culture: { label: "Culture", color: "var(--accent)", css: "#2E29EB" },
  shopping: { label: "Shopping", color: "var(--shopping)", css: "#C45B8C" },
};
