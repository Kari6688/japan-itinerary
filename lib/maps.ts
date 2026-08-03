export function getMapsUrl(
  lat: number | null,
  lng: number | null,
  name: string,
  fallback?: string,
) {
  if (fallback?.includes("google.com/maps")) return fallback;
  if (lat != null && lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  return (
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " Japan")}`
  );
}
