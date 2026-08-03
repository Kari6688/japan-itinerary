"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mappablePlaces, places } from "@/lib/places";
import { CATEGORY_CONFIG } from "@/lib/types";

const TILE_URL = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';

export function HomeMapPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const pts = mappablePlaces(places);
    const map = L.map(containerRef.current, {
      center: [35.2, 136.9],
      zoom: 6,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
    });
    L.tileLayer(TILE_URL, { attribution: TILE_ATTR, maxZoom: 18 }).addTo(map);

    const bounds: L.LatLngExpression[] = [];
    for (const p of pts.slice(0, 120)) {
      const css = CATEGORY_CONFIG[p.category]?.css ?? "#91989F";
      L.circleMarker([p.lat, p.lng], {
        radius: 3.5,
        color: css,
        fillColor: css,
        fillOpacity: 0.85,
        weight: 1,
      }).addTo(map);
      bounds.push([p.lat, p.lng]);
    }
    if (bounds.length > 2) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [28, 28], maxZoom: 7 });
    }
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      aria-hidden
      style={{ background: "#e8ebf3" }}
    />
  );
}
