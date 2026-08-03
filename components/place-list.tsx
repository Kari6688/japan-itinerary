"use client";

import {
  filterByList,
  groupByNeighbourhood,
  type ListFilter,
} from "@/lib/places";
import { places } from "@/lib/places";
import type { Place } from "@/lib/types";
import { PlaceRow } from "@/components/place-row";

interface PlaceListProps {
  filter: ListFilter;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (place: Place) => void;
  isStarred: (id: string) => boolean;
  onToggleStar: (id: string) => void;
  isChecked: (id: string) => boolean;
  onToggleCheck: (id: string) => void;
  onlyStarred?: boolean;
}

export function PlaceList({
  filter,
  selectedId,
  onHover,
  onSelect,
  isStarred,
  onToggleStar,
  isChecked,
  onToggleCheck,
  onlyStarred,
}: PlaceListProps) {
  let filtered = filterByList(places, filter);
  if (onlyStarred) filtered = filtered.filter((p) => isStarred(p.id));

  const grouped = groupByNeighbourhood(filtered);

  if (grouped.length === 0) {
    return (
      <div className="px-4 py-16 text-center font-mono text-[12px] text-[var(--sunezumi)]">
        {onlyStarred ? "No saved places yet. Star spots from the map." : "No places in this list."}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {grouped.map(([neighbourhood, items]) => {
        const sorted = [...items].sort((a, b) => {
          const ac = isChecked(a.id) ? 1 : 0;
          const bc = isChecked(b.id) ? 1 : 0;
          return ac - bc;
        });
        return (
          <section key={neighbourhood}>
            <div
              className="border-b border-[var(--keshizumi)]/50 bg-[var(--ro)] px-4"
              style={{ paddingTop: 20, paddingBottom: 12 }}
            >
              <span className="font-mono text-[12px] uppercase tracking-wider text-[var(--kuchiba)]">
                {neighbourhood}
              </span>
              <span
                className="ml-2 font-mono text-[12px] text-[var(--keshizumi)]"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {items.length}
              </span>
            </div>
            {sorted.map((place) => (
              <PlaceRow
                key={place.id}
                place={place}
                starred={isStarred(place.id)}
                checked={isChecked(place.id)}
                selected={selectedId === place.id}
                onSelect={() => onSelect(place)}
                onToggleStar={() => onToggleStar(place.id)}
                onToggleCheck={() => onToggleCheck(place.id)}
                onMouseEnter={() => onHover(place.id)}
                onMouseLeave={() => onHover(null)}
              />
            ))}
          </section>
        );
      })}
    </div>
  );
}
