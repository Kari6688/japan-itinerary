export type PlaceCategory =
  | "food"
  | "temple"
  | "museum"
  | "nature"
  | "cafe"
  | "culture";

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
  food: { label: "Food", color: "var(--kuchiba)", css: "#E2943B" },
  temple: { label: "Temple / Shrine", color: "var(--kurenai)", css: "#CB1B45" },
  museum: { label: "Museum / Gallery", color: "var(--fuji)", css: "#8B81C3" },
  nature: { label: "Nature", color: "var(--wakatake)", css: "#5DAC81" },
  cafe: { label: "Cafe", color: "var(--yamabuki)", css: "#FFB11B" },
  culture: { label: "Culture", color: "var(--fuji)", css: "#8B81C3" },
};
