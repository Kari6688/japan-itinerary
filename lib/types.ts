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

export const CATEGORY_META: Record<
  PlaceCategory,
  { label: string; color: string; soft: string }
> = {
  food: { label: "Food", color: "#c45c26", soft: "rgba(196, 92, 38, 0.12)" },
  temple: { label: "Temple / Shrine", color: "#1f4b7a", soft: "rgba(31, 75, 122, 0.12)" },
  museum: { label: "Museum / Gallery", color: "#0f6b5c", soft: "rgba(15, 107, 92, 0.12)" },
  nature: { label: "Nature", color: "#3d6b3a", soft: "rgba(61, 107, 58, 0.12)" },
  cafe: { label: "Cafe", color: "#8a5a2b", soft: "rgba(138, 90, 43, 0.12)" },
  culture: { label: "Culture", color: "#3d4f66", soft: "rgba(61, 79, 102, 0.12)" },
};
