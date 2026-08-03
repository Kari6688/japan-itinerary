"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { getSourceLists, mappablePlaces, places } from "@/lib/places";
import { CATEGORY_CONFIG } from "@/lib/types";
import { useReservations } from "@/lib/use-reservations";
import syncMeta from "@/data/sync-meta.json";

const HomeMapPreview = dynamic(
  () =>
    import("@/components/home-map-preview").then((m) => m.HomeMapPreview),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse bg-[#e8ebf3]" />
    ),
  },
);

const PLANNING_TOTAL = 15;
const PLANNING_KEY = "karima-japan-planning";

export default function Home() {
  const { count, mounted } = useReservations();
  const [planningCount, setPlanningCount] = useState(0);
  const lists = getSourceLists();
  const mapped = mappablePlaces(places).length;
  const cities = [
    ...new Set(
      places
        .map((p) => p.city)
        .filter((c) => c && c !== "Japan" && c !== "Unknown"),
    ),
  ];
  const featured = places
    .filter((p) => p.lat != null && p.rating != null)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 3);
  const featuredFallback = places.filter((p) => p.lat != null).slice(0, 3);
  const stack = (featured.length >= 3 ? featured : featuredFallback).slice(0, 3);
  const shoppingCount = places.filter((p) => p.category === "shopping").length;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PLANNING_KEY);
      if (raw) setPlanningCount((JSON.parse(raw) as string[]).length);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 pb-10 pt-6 sm:pt-10">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 90% 45% at 50% -5%, rgba(46,41,235,0.1), transparent 55%), radial-gradient(ellipse 50% 35% at 100% 80%, rgba(196,91,140,0.08), transparent 50%)",
        }}
      />

      <section className="home-card overflow-hidden">
        <div className="relative h-[200px] sm:h-[220px]">
          <HomeMapPreview />
          <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center px-3">
            <div className="rounded-full bg-white/95 px-3 py-1.5 text-center text-[12px] text-[var(--ink)] shadow-[0_6px_20px_rgba(22,22,42,0.1)] backdrop-blur">
              There are{" "}
              <span className="font-semibold tabular-nums">{places.length}</span>{" "}
              spots across{" "}
              <span className="font-semibold tabular-nums">{lists.length}</span>{" "}
              lists
            </div>
          </div>
        </div>
        <p className="px-4 py-3 text-center text-[14px] text-[var(--ink)]">
          Your playground is{" "}
          <span className="font-display text-[15px] text-[var(--accent)]">
            {cities.slice(0, 3).join(", ") || "Japan"}
          </span>
          .
        </p>
      </section>

      <section className="home-card mt-4 px-5 pb-6 pt-7 text-center">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-white"
          style={{
            background:
              "linear-gradient(145deg, #2E29EB 0%, #5B57F0 55%, #C45B8C 100%)",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 22,
          }}
        >
          K
        </div>
        <p className="mt-3 text-[12px] tracking-wide text-[var(--ink-muted)]">
          @karima
        </p>
        <h1 className="mt-1 font-display text-[28px] leading-none text-[var(--ink)] sm:text-[32px]">
          Karima
        </h1>
        <p className="mt-2 text-[13px] text-[var(--ink-muted)]">
          Japan trip · {lists.length} Maps lists synced
        </p>
        <Link
          href="/map"
          className="mx-auto mt-4 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ink)] text-white transition-transform hover:scale-105"
          aria-label="Open map"
        >
          <span className="text-lg leading-none">+</span>
        </Link>

        <div className="relative mx-auto mt-6 h-[132px] w-full max-w-[280px]">
          {stack.map((p, i) => {
            const rot = i === 0 ? -8 : i === 1 ? 0 : 8;
            const x = i === 0 ? -42 : i === 1 ? 0 : 42;
            const z = i === 1 ? 3 : 1;
            const css = CATEGORY_CONFIG[p.category]?.css ?? "#2E29EB";
            return (
              <div
                key={p.id}
                className="absolute left-1/2 top-0 h-[120px] w-[100px] overflow-hidden rounded-2xl border border-white shadow-[0_10px_28px_rgba(22,22,42,0.14)]"
                style={{
                  transform: `translateX(calc(-50% + ${x}px)) rotate(${rot}deg)`,
                  zIndex: z,
                  background: `linear-gradient(160deg, ${css}cc, ${css}55 40%, #16162aee)`,
                }}
              >
                <div className="absolute inset-x-0 bottom-0 p-2.5 text-left">
                  <p className="line-clamp-2 text-[11px] font-medium leading-tight text-white">
                    {p.name}
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/75">
                    {p.neighbourhood !== "Unknown" ? p.neighbourhood : p.city}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-3">
        <AreaCard
          href="/map"
          iconColor="var(--accent)"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7.5 10 5l4 2.5L20 5v11.5L14 19l-4-2.5L4 19V7.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="11" r="1.6" fill="currentColor" />
            </svg>
          }
          value={places.length}
          label="spots on the map"
          pill={`${mapped} pinned · ${lists.length} lists`}
          pillTone="blue"
        />
        <AreaCard
          href="/planning"
          iconColor="var(--nature)"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 4h9l3 3v13H6V4Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path d="M9 11h6M9 15h4" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          }
          value={mounted ? planningCount : "—"}
          label="planning checks done"
          pill={`${PLANNING_TOTAL} checklist items`}
          pillTone="green"
        />
        <AreaCard
          href="/reservations"
          iconColor="var(--food)"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 7h14v12H5V7Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path d="M8 7V5h8v2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 12h8" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          }
          value={mounted ? count : "—"}
          label="restaurant reservations"
          pill="bookings & notes"
          pillTone="orange"
        />
        <AreaCard
          href="/map"
          iconColor="var(--shopping)"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 8h10l1 11H6L7 8Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M9 8V7a3 3 0 0 1 6 0v1"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
          }
          value={shoppingCount || lists.length}
          label={shoppingCount ? "shopping & craft stops" : "saved Maps lists"}
          pill={
            shoppingCount
              ? "shops · books · ceramics"
              : `${lists.length} lists linked`
          }
          pillTone="pink"
        />
      </section>

      <p className="mt-5 text-center text-[11px] leading-relaxed text-[var(--ink-muted)]">
        Lists refresh from Google Maps via{" "}
        <code className="rounded bg-white/80 px-1 py-0.5 text-[10px]">
          pnpm sync:maps
        </code>
        {syncMeta?.lastSyncedAt
          ? ` · last sync ${new Date(syncMeta.lastSyncedAt).toLocaleDateString()}`
          : " · daily GitHub Action"}
        . Adding a spot in Maps updates this app after the next sync.
      </p>

      <footer className="mt-auto pt-8 text-center">
        <p className="text-[12px] text-[var(--ink-muted)]">
          Built for Karima · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

function AreaCard({
  href,
  icon,
  iconColor,
  value,
  label,
  pill,
  pillTone,
}: {
  href: string;
  icon: ReactNode;
  iconColor: string;
  value: number | string;
  label: string;
  pill: string;
  pillTone: "blue" | "green" | "orange" | "pink";
}) {
  const tones = {
    blue: "bg-[rgba(46,41,235,0.1)] text-[var(--accent)]",
    green: "bg-[rgba(47,158,111,0.12)] text-[var(--nature)]",
    orange: "bg-[rgba(224,120,48,0.12)] text-[var(--food)]",
    pink: "bg-[rgba(196,91,140,0.12)] text-[var(--shopping)]",
  };

  return (
    <Link
      href={href}
      className="home-card flex aspect-square flex-col items-start justify-between p-4 transition-transform hover:-translate-y-0.5"
    >
      <span style={{ color: iconColor }}>{icon}</span>
      <div>
        <p
          className="font-display text-[36px] leading-none text-[var(--ink)]"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {value}
        </p>
        <p className="mt-1.5 text-[12px] leading-snug text-[var(--ink-muted)]">
          {label}
        </p>
      </div>
      <span
        className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${tones[pillTone]}`}
      >
        {pill}
      </span>
    </Link>
  );
}
