"use client";

import { useEffect, useState } from "react";
import { CATEGORY_CONFIG, type Place } from "@/lib/types";
import { formatRating, getMapsUrl } from "@/lib/utils";
import { PixelStar } from "@/components/pixel-icons";

interface PlaceCardProps {
  place: Place;
  starred: boolean;
  onToggleStar: () => void;
  onClose: () => void;
}

export function PlaceCard({ place, starred, onToggleStar, onClose }: PlaceCardProps) {
  const cat = CATEGORY_CONFIG[place.category];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const dismiss = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const mapsHref = getMapsUrl(place.lat, place.lng, place.name, place.mapsUrl);

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div
        className="pointer-events-auto absolute bottom-5 left-4 right-4 mx-auto max-w-[760px] border border-[var(--keshizumi)] bg-[var(--sumi)] sm:left-5 sm:right-5"
        style={{
          boxShadow: "4px 4px 0px rgba(0,0,0,0.5)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 200ms ease-out, transform 200ms ease-out",
        }}
      >
        <div className="px-4 pb-8 pt-5 sm:pb-10">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="h-4 w-0.5 shrink-0" style={{ backgroundColor: cat.css }} />
                <h3 className="font-pixel truncate text-[16px] font-medium text-[var(--shironeri)]">
                  {place.name}
                </h3>
              </div>
              <p className="ml-1.5 mt-0.5 font-mono text-[12px] text-[var(--sunezumi)]">
                {place.neighbourhood}
                {place.city !== "Japan" ? `, ${place.city}` : ""}
                {place.subtype ? ` · ${place.subtype}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <PixelStar filled={starred} onClick={onToggleStar} size={16} />
              <button
                type="button"
                onClick={dismiss}
                className="flex h-7 w-7 cursor-pointer items-center justify-center font-pixel text-[18px] leading-none text-[var(--sunezumi)] transition-colors hover:bg-white/[0.08] hover:text-[var(--shironeri)]"
              >
                X
              </button>
            </div>
          </div>

          <div
            className="mb-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[12px] text-[var(--sunezumi)]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            <span style={{ color: cat.css }}>{cat.label}</span>
            {place.price ? <span>{place.price}</span> : null}
            {formatRating(place.rating, place.reviewCount) ? (
              <span>★ {formatRating(place.rating, place.reviewCount)}</span>
            ) : null}
            <span>From: {place.sourceListName}</span>
          </div>

          {place.address ? (
            <p className="mb-3 text-[13px] leading-relaxed text-white/80">{place.address}</p>
          ) : null}

          <div className="flex items-center justify-between">
            <span className="border border-[var(--keshizumi)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--sunezumi)]">
              {place.sourceListName}
            </span>
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-7 items-center gap-1 px-3 font-pixel text-[14px] text-[var(--ginnezumi)] transition-colors hover:bg-white/[0.08] hover:text-[var(--shironeri)]"
            >
              Map <span className="text-[14px] leading-none">↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
