"use client";

import { CATEGORY_CONFIG, type Place } from "@/lib/types";
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
  const cat = CATEGORY_CONFIG[place.category];
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
      className={`flex w-full cursor-pointer items-center gap-3 border-b border-[var(--keshizumi)]/50 px-4 text-left transition-all duration-300 ease-in-out ${
        selected ? "bg-[var(--sumi)]" : "hover:bg-[var(--sumi)]/60"
      }`}
      style={{ opacity: checked ? 0.25 : 1, paddingTop: 16, paddingBottom: 16 }}
    >
      <div className="w-0.5 shrink-0 self-stretch" style={{ backgroundColor: cat.css }} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-pixel truncate text-[14px] font-medium text-[var(--shironeri)]">
            {place.name}
          </span>
          <span className="shrink-0 border border-[var(--keshizumi)] px-1 font-mono text-[10px] text-[var(--sunezumi)]">
            {cat.label.split(" / ")[0]}
          </span>
        </div>
        {meta ? (
          <p className="mt-0.5 truncate font-mono text-[12px] text-[var(--sunezumi)]">{meta}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-4 sm:gap-6">
        <PixelStar filled={starred} onClick={onToggleStar} />
        <PixelCheck filled={checked} onClick={onToggleCheck} />
      </div>
    </div>
  );
}
