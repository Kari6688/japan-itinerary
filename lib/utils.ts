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

export function getMapsUrl(lat: number | null, lng: number | null, name: string, fallback?: string) {
  if (lat != null && lng != null) {
    const isApple =
      typeof navigator !== "undefined" &&
      /iPhone|iPad|Macintosh/.test(navigator.userAgent);
    if (isApple) {
      return `https://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(name)}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  return fallback || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " Japan")}`;
}
