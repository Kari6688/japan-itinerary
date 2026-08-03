"use client";

import { listColorForPlace } from "@/lib/list-colors";
import type { Place } from "@/lib/types";
import { formatRating } from "@/lib/utils";
import { PixelCheck, PixelStar } from "@/components/pixel-icons";

interface PlaceRowProps {
  place: Place;
  starred: boolean;
  checked: boolean;
  selected?: boolean;
  onSelect: () => void;
  onToggleStar: () => void;
  onToggleCheck: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function PlaceRow({
  place,
  starred,
  checked,
  selected,
  onSelect,
  onToggleStar,
  onToggleCheck,
  onMouseEnter,
  onMouseLeave,
}: PlaceRowProps) {
  const list = listColorForPlace(place);
  const meta = [
    place.subtype,
    place.price,
    formatRating(place.rating, place.reviewCount)
      ? `★ ${formatRating(place.rating, place.reviewCount)}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="flex w-full cursor-pointer items-center gap-3 border-b border-[var(--line)] px-4 text-left transition-all duration-300 ease-in-out hover:bg-[var(--sumi)]"
      style={{
        opacity: checked ? 0.35 : 1,
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: selected ? list.soft : undefined,
      }}
    >
      <div className="w-0.5 shrink-0 self-stretch" style={{ backgroundColor: list.css }} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[14px] font-medium text-[var(--ink)]">{place.name}</span>
          <span
            className="shrink-0 border px-1 text-[10px]"
            style={{ borderColor: list.css, color: list.css, backgroundColor: list.soft }}
          >
            {list.label}
          </span>
        </div>
        {meta ? (
          <p className="mt-0.5 truncate text-[12px] text-[var(--ink-muted)]">{meta}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-4 sm:gap-6">
        <PixelStar filled={starred} onClick={onToggleStar} />
        <PixelCheck filled={checked} onClick={onToggleCheck} />
      </div>
    </div>
  );
}
