"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { listColorForPlace } from "@/lib/list-colors";
import { filterByList, mappablePlaces, places, type ListFilter } from "@/lib/places";
import type { Place } from "@/lib/types";

interface MapContainerProps {
  filter: ListFilter;
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (place: Place) => void;
  onDeselect: () => void;
  onlyStarred?: boolean;
  starredIds?: Set<string>;
}

const TILE_URL = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';
const CENTER: L.LatLngExpression = [35.68, 139.76];

function markerIcon(place: Place, selected: boolean, pulse: boolean): L.DivIcon {
  const size = selected ? 12 : 8;
  const css = listColorForPlace(place).css;
  const pulseHtml = pulse
    ? `<div class="radar-pulse" style="--pulse-color:${css}"></div><div class="radar-pulse" style="--pulse-color:${css};animation-delay:1s"></div>`
    : "";
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="position:relative;width:${size}px;height:${size}px;">
      <div style="width:${size}px;height:${size}px;background:${css};border:1px solid ${css};position:relative;z-index:2;${selected ? `box-shadow:0 0 6px ${css}` : ""}"></div>
      ${pulseHtml}
    </div>`,
  });
}

function visiblePlaces(
  filter: ListFilter,
  onlyStarred?: boolean,
  starredIds?: Set<string>,
) {
  let list = filterByList(places, filter);
  if (onlyStarred && starredIds) list = list.filter((p) => starredIds.has(p.id));
  return mappablePlaces(list);
}

export default function MapContainer({
  filter,
  selectedId,
  hoveredId,
  onSelect,
  onDeselect,
  onlyStarred,
  starredIds,
}: MapContainerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const prevHoveredRef = useRef<string | null>(null);
  const prevFilterRef = useRef<string | null>(null);
  const onDeselectRef = useRef(onDeselect);
  onDeselectRef.current = onDeselect;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: CENTER,
      zoom: 11,
      zoomControl: true,
      attributionControl: true,
    });
    L.tileLayer(TILE_URL, { attribution: TILE_ATTR, maxZoom: 18 }).addTo(map);
    mapRef.current = map;
    map.on("click", () => onDeselectRef.current());
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const filtered = visiblePlaces(filter, onlyStarred, starredIds);
    const filteredIds = new Set(filtered.map((p) => p.id));

    markersRef.current.forEach((marker, id) => {
      if (!filteredIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    filtered.forEach((place) => {
      const isSelected = place.id === selectedId;
      const existing = markersRef.current.get(place.id);
      const icon = markerIcon(place, isSelected, isSelected);
      if (existing) {
        existing.setIcon(icon);
        existing.setZIndexOffset(isSelected ? 1000 : 0);
      } else {
        const marker = L.marker([place.lat, place.lng], { icon })
          .addTo(map)
          .bindTooltip(place.name, {
            className: "pixel-tooltip",
            direction: "top",
            offset: [0, -6],
          });
        marker.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          onSelect(place);
        });
        if (isSelected) marker.setZIndexOffset(1000);
        markersRef.current.set(place.id, marker);
      }
    });

    const filterKey = `${filter}:${onlyStarred ? "s" : "a"}:${starredIds?.size ?? 0}`;
    const filterChanged = prevFilterRef.current !== filterKey;
    prevFilterRef.current = filterKey;

    if (filterChanged && !selectedId && filtered.length > 0) {
      const bounds = L.latLngBounds(filtered.map((p) => [p.lat, p.lng] as L.LatLngTuple));
      map.fitBounds(bounds, { padding: [40, 40], animate: true, duration: 0.3, maxZoom: 13 });
    }
  }, [filter, selectedId, onSelect, onlyStarred, starredIds]);

  useEffect(() => {
    const prevId = prevHoveredRef.current;
    const currId = hoveredId;
    prevHoveredRef.current = currId;

    if (prevId && prevId !== currId) {
      const prevMarker = markersRef.current.get(prevId);
      const prevPlace = places.find((p) => p.id === prevId);
      if (prevMarker && prevPlace) {
        const isSelected = prevId === selectedId;
        prevMarker.setIcon(markerIcon(prevPlace, isSelected, isSelected));
        if (!isSelected) prevMarker.setZIndexOffset(0);
      }
    }

    if (currId) {
      const currMarker = markersRef.current.get(currId);
      const currPlace = places.find((p) => p.id === currId);
      if (currMarker && currPlace) {
        currMarker.setIcon(markerIcon(currPlace, currId === selectedId, true));
        currMarker.setZIndexOffset(1000);
      }
    }
  }, [hoveredId, selectedId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (selectedId) {
      const place = places.find((p) => p.id === selectedId);
      if (place?.lat != null && place.lng != null) {
        map.setView([place.lat, place.lng], 15, { animate: true, duration: 0.3 });
      }
      return;
    }

    const filtered = visiblePlaces(filter, onlyStarred, starredIds);
    if (filtered.length > 0) {
      const bounds = L.latLngBounds(filtered.map((p) => [p.lat, p.lng] as L.LatLngTuple));
      map.fitBounds(bounds, { padding: [40, 40], animate: true, duration: 0.3, maxZoom: 13 });
    }
  }, [selectedId, filter, onlyStarred, starredIds]);

  return (
    <div
      ref={containerRef}
      className="sticky top-[48px] z-40 h-[35vh] w-full border-b border-[var(--line)] sm:h-[364px]"
    />
  );
}
