import type { Place } from "@/lib/types";

export type ListColor = {
  label: string;
  short: string;
  color: string;
  css: string;
  soft: string;
};

/** Unique colour per Google Maps list */
export const LIST_CONFIG: Record<string, ListColor> = {
  culture: {
    label: "Culture",
    short: "文 Culture",
    color: "var(--list-culture)",
    css: "#2E29EB",
    soft: "rgba(46, 41, 235, 0.1)",
  },
  food: {
    label: "Food",
    short: "食 Food",
    color: "var(--list-food)",
    css: "#E07830",
    soft: "rgba(224, 120, 48, 0.12)",
  },
  "desserts-jp": {
    label: "Desserts",
    short: "甜 Desserts",
    color: "var(--list-desserts)",
    css: "#E0457B",
    soft: "rgba(224, 69, 123, 0.12)",
  },
  "bar-jp": {
    label: "Bars",
    short: "酒 Bars",
    color: "var(--list-bars)",
    css: "#7B3FA0",
    soft: "rgba(123, 63, 160, 0.12)",
  },
  "shopping-jp": {
    label: "Shopping",
    short: "買 Shopping",
    color: "var(--list-shopping)",
    css: "#C45B8C",
    soft: "rgba(196, 91, 140, 0.12)",
  },
  "matcha-jp": {
    label: "Matcha",
    short: "茶 Matcha",
    color: "var(--list-matcha)",
    css: "#2F9E6F",
    soft: "rgba(47, 158, 111, 0.12)",
  },
  "bookstore-jp": {
    label: "Books",
    short: "本 Books",
    color: "var(--list-books)",
    css: "#8B5E3C",
    soft: "rgba(139, 94, 60, 0.12)",
  },
  "ceramics-jp": {
    label: "Ceramics",
    short: "焼 Ceramics",
    color: "var(--list-ceramics)",
    css: "#C46A3A",
    soft: "rgba(196, 106, 58, 0.12)",
  },
  "cafe-jp": {
    label: "Cafe",
    short: "咖 Cafe",
    color: "var(--list-cafe)",
    css: "#C9A227",
    soft: "rgba(201, 162, 39, 0.14)",
  },
};

const FALLBACK: ListColor = {
  label: "List",
  short: "List",
  color: "var(--accent)",
  css: "#2E29EB",
  soft: "rgba(46, 41, 235, 0.1)",
};

export function getListConfig(listId: string): ListColor {
  return LIST_CONFIG[listId] ?? FALLBACK;
}

export function listColorForPlace(place: Place): ListColor {
  return getListConfig(place.sourceList);
}
