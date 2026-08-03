"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useReservations } from "@/lib/use-reservations";

interface NavBarProps {
  current?: "/" | "/map" | "/planning" | "/reservations";
}

export function NavBar({ current }: NavBarProps) {
  const { count, mounted } = useReservations();

  const link = (href: NonNullable<NavBarProps["current"]>, label: string, badge?: ReactNode) => (
    <Link
      href={href}
      className={`transition-colors hover:text-[var(--accent)] ${
        current === href ? "text-[var(--accent)]" : "text-[var(--ink-muted)]"
      }`}
      style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
    >
      {label}
      {badge}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface)]/95 px-4 py-3 text-[14px] backdrop-blur">
      <Link href="/" className="block" aria-label="Home">
        <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="24" fill="#FFFFFF" stroke="#E2E5EF" />
          <circle cx="18" cy="12" r="7.2" fill="#2E29EB" />
        </svg>
      </Link>
      <div className="flex items-center gap-5 md:gap-10">
        {link("/map", "Map")}
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
