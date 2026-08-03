"use client";

import { useEffect, useState } from "react";
import { listColorForPlace } from "@/lib/list-colors";
import type { Place } from "@/lib/types";
import { formatRating, getMapsUrl } from "@/lib/utils";
import { PixelStar } from "@/components/pixel-icons";

interface PlaceCardProps {
  place: Place;
  starred: boolean;
  onToggleStar: () => void;
  onClose: () => void;
}

export function PlaceCard({ place, starred, onToggleStar, onClose }: PlaceCardProps) {
  const list = listColorForPlace(place);
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
        className="pointer-events-auto absolute bottom-5 left-4 right-4 mx-auto max-w-[760px] border border-[var(--line)] bg-[var(--surface)] sm:left-5 sm:right-5"
        style={{
          boxShadow: "4px 4px 0px rgba(46,41,235,0.15)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 200ms ease-out, transform 200ms ease-out",
        }}
      >
        <div className="px-4 pb-8 pt-5 sm:pb-10">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="h-4 w-0.5 shrink-0" style={{ backgroundColor: list.css }} />
                <h3 className="font-display truncate text-[20px] text-[var(--ink)]">
                  {place.name}
                </h3>
              </div>
              <p className="ml-1.5 mt-0.5 text-[12px] text-[var(--ink-muted)]">
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
                className="flex h-7 w-7 cursor-pointer items-center justify-center text-[16px] leading-none text-[var(--ink-muted)] transition-colors hover:opacity-80"
                style={{ color: undefined }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = list.soft;
                  e.currentTarget.style.color = list.css;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "";
                  e.currentTarget.style.color = "";
                }}
              >
                X
              </button>
            </div>
          </div>

          <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[var(--ink-muted)]">
            <span style={{ color: list.css }}>{list.label}</span>
            {place.price ? <span>{place.price}</span> : null}
            {formatRating(place.rating, place.reviewCount) ? (
              <span>★ {formatRating(place.rating, place.reviewCount)}</span>
            ) : null}
            <span>From: {place.sourceListName}</span>
          </div>

          {place.address ? (
            <p className="mb-3 text-[13px] leading-relaxed text-[var(--ink)]/80">{place.address}</p>
          ) : null}

          <div className="flex items-center justify-between">
            <span
              className="border px-1.5 py-0.5 text-[11px]"
              style={{ borderColor: list.css, color: list.css, backgroundColor: list.soft }}
            >
              {place.sourceListName}
            </span>
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-7 items-center gap-1 px-3 text-[14px] font-medium transition-colors"
              style={{ color: list.css }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = list.soft;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "";
              }}
            >
              Google Maps <span className="leading-none">↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
