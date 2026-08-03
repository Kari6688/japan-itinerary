"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { NavBar } from "@/components/nav-bar";
import { PlaceList } from "@/components/place-list";
import { PlaceCard } from "@/components/place-card";
import { SiteFooter } from "@/components/site-footer";
import { useStarred } from "@/lib/use-starred";
import { useChecked } from "@/lib/use-checked";
import type { Place } from "@/lib/types";

const MapContainer = dynamic(() => import("@/components/map-container"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[35vh] w-full items-center justify-center border-b border-[var(--keshizumi)] bg-[var(--ro)] sm:h-[364px]">
      <span className="font-mono text-[12px] text-[var(--keshizumi)]">loading map…</span>
    </div>
  ),
});

export default function SavedPage() {
  const [selected, setSelected] = useState<Place | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { starred, toggle, isStarred, count, mounted } = useStarred();
  const { toggle: toggleCheck, isChecked } = useChecked();

  const handleSelect = useCallback((place: Place) => setSelected(place), []);
  const handleDeselect = useCallback(() => setSelected(null), []);

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--ro)]">
      <NavBar current="/saved" />
      {mounted && count > 0 ? (
        <MapContainer
          filter="all"
          selectedId={selected?.id ?? null}
          hoveredId={hoveredId}
          onSelect={handleSelect}
          onDeselect={handleDeselect}
          onlyStarred
          starredIds={starred}
        />
      ) : null}
      <div
        className="mx-auto flex w-full max-w-[800px] flex-1 flex-col"
        onClick={handleDeselect}
      >
        <div className="border-b border-[var(--keshizumi)]/50 px-4 py-4">
          <h1 className="font-pixel text-[16px] text-[var(--shironeri)]">Saved</h1>
          <p className="mt-1 font-mono text-[12px] text-[var(--sunezumi)]">
            {mounted ? `${count} starred places` : "…"} · grouped by neighbourhood
          </p>
        </div>
        <PlaceList
          filter="all"
          selectedId={selected?.id ?? null}
          onHover={setHoveredId}
          onSelect={handleSelect}
          isStarred={isStarred}
          onToggleStar={toggle}
          isChecked={isChecked}
          onToggleCheck={toggleCheck}
          onlyStarred
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
