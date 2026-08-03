"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { NavBar } from "@/components/nav-bar";
import { ListFilters } from "@/components/list-filters";
import { PlaceList } from "@/components/place-list";
import { PlaceCard } from "@/components/place-card";
import { SiteFooter } from "@/components/site-footer";
import { useStarred } from "@/lib/use-starred";
import { useChecked } from "@/lib/use-checked";
import type { ListFilter } from "@/lib/places";
import type { Place } from "@/lib/types";

const MapContainer = dynamic(() => import("@/components/map-container"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[35vh] w-full items-center justify-center border-b border-[var(--line)] bg-[var(--paper)] sm:h-[364px]">
      <span className="text-[12px] text-[var(--ink-muted)]">loading map…</span>
    </div>
  ),
});

export default function MapPage() {
  const [filter, setFilter] = useState<ListFilter>("all");
  const [selected, setSelected] = useState<Place | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { toggle, isStarred } = useStarred();
  const { toggle: toggleCheck, isChecked } = useChecked();

  const handleSelect = useCallback((place: Place) => setSelected(place), []);
  const handleDeselect = useCallback(() => setSelected(null), []);
  const handleFilterChange = useCallback((f: ListFilter) => {
    setFilter(f);
    setSelected(null);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--paper)]">
      <NavBar current="/map" />
      <MapContainer
        filter={filter}
        selectedId={selected?.id ?? null}
        hoveredId={hoveredId}
        onSelect={handleSelect}
        onDeselect={handleDeselect}
      />
      <div
        className="mx-auto flex w-full max-w-[800px] flex-1 flex-col"
        onClick={handleDeselect}
      >
        <ListFilters active={filter} onChange={handleFilterChange} />
        <PlaceList
          filter={filter}
          selectedId={selected?.id ?? null}
          onHover={setHoveredId}
          onSelect={handleSelect}
          isStarred={isStarred}
          onToggleStar={toggle}
          isChecked={isChecked}
          onToggleCheck={toggleCheck}
        />
      </div>
      <SiteFooter />
      {selected ? (
        <PlaceCard
          place={selected}
          starred={isStarred(selected.id)}
          onToggleStar={() => toggle(selected.id)}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </div>
  );
}
