import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRating(rating: number | null, reviews: number | null) {
  if (rating == null) return null;
  if (reviews == null) return rating.toFixed(1);
  return `${rating.toFixed(1)} (${reviews.toLocaleString()})`;
}
