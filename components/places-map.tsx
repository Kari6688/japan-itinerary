"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import type { Place } from "@/lib/types";
import { CATEGORY_META } from "@/lib/types";
import "leaflet/dist/leaflet.css";

function FitBounds({
  places,
  selectedId,
}: {
  places: Place[];
  selectedId: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    const pts = places.filter(
      (p): p is Place & { lat: number; lng: number } =>
        p.lat != null && p.lng != null,
    );
    if (pts.length === 0) {
      map.setView([35.68, 139.76], 11);
      return;
    }
    if (selectedId) {
      const selected = pts.find((p) => p.id === selectedId);
      if (selected) {
        map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 14), {
          duration: 0.6,
        });
        return;
      }
    }
    if (pts.length === 1) {
      map.setView([pts[0].lat, pts[0].lng], 14);
      return;
    }
    const lats = pts.map((p) => p.lat);
    const lngs = pts.map((p) => p.lng);
    map.fitBounds(
      [
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)],
      ],
      { padding: [40, 40], maxZoom: 13 },
    );
  }, [map, places, selectedId]);

  return null;
}

export default function PlacesMap({
  places,
  selectedId,
  onSelect,
}: {
  places: Place[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const mappable = useMemo(
    () => places.filter((p) => p.lat != null && p.lng != null),
    [places],
  );

  return (
    <MapContainer
      center={[35.68, 139.76]}
      zoom={11}
      className="h-full w-full"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <FitBounds places={mappable} selectedId={selectedId} />
      {mappable.map((place) => {
        const color = CATEGORY_META[place.category]?.color ?? "#3d4f66";
        const selected = place.id === selectedId;
        return (
          <CircleMarker
            key={place.id}
            center={[place.lat!, place.lng!]}
            radius={selected ? 10 : 7}
            pathOptions={{
              color: selected ? "#1a1f2b" : color,
              fillColor: color,
              fillOpacity: selected ? 1 : 0.85,
              weight: selected ? 2 : 1,
            }}
            eventHandlers={{
              click: () => onSelect(place.id),
            }}
          >
            <Popup>
              <strong>{place.name}</strong>
              <br />
              {place.neighbourhood}
              {place.city !== "Japan" ? `, ${place.city}` : ""}
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
