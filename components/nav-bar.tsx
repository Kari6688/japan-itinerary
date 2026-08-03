"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useReservations } from "@/lib/use-reservations";

interface NavBarProps {
  current?: "/" | "/map" | "/planning" | "/reservations" | "/itinerary";
}

export function NavBar({ current }: NavBarProps) {
  const { count, mounted } = useReservations();

  const link = (
    href: NonNullable<NavBarProps["current"]>,
    label: string,
    badge?: ReactNode,
  ) => (
    <Link
      href={href}
      className={`font-medium transition-colors hover:text-[var(--accent)] ${
        current === href ? "text-[var(--accent)]" : "text-[var(--ink-muted)]"
      }`}
    >
      {label}
      {badge}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface)]/95 px-4 py-3 text-[14px] backdrop-blur">
      <Link
        href="/"
        className="block text-[22px] leading-none transition-opacity hover:opacity-80"
        aria-label="Home"
      >
        🌸
      </Link>
      <div className="flex items-center gap-4 md:gap-8">
        {link("/map", "Map")}
        {link("/itinerary", "Itinerary")}
        {link("/planning", "Planning")}
        {link(
          "/reservations",
          "Reservations",
          mounted ? (
            <span style={{ fontVariantNumeric: "tabular-nums" }}> ({count})</span>
          ) : null,
        )}
      </div>
    </nav>
  );
}
