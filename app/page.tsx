"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { TravellerAvatar } from "@/components/traveller-avatar";
import { getSourceLists, places } from "@/lib/places";
import {
  shortItinerary,
  tokyoNeighbourhoods,
  travellers,
} from "@/lib/trip";

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

export default function Home() {
  const lists = getSourceLists();
  const cities = ["Tokyo", "Kyoto", "Uji", "Osaka", "Kamakura"].filter((c) =>
    places.some((p) => p.city === c),
  );

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 pb-10 pt-5 sm:pt-8">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 90% 45% at 50% -5%, rgba(46,41,235,0.1), transparent 55%), radial-gradient(ellipse 50% 35% at 100% 80%, rgba(224,120,48,0.08), transparent 50%)",
        }}
      />

      {/* Travellers */}
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            Japan trip
          </p>
          <h1 className="mt-0.5 font-display text-[26px] leading-none text-[var(--ink)]">
            Karima + Ryan
          </h1>
        </div>
        <div className="flex -space-x-2">
          {travellers.map((t) => (
            <TravellerAvatar
              key={t.id}
              emoji={t.emoji}
              accent={t.accent}
              label={t.name}
              size={42}
            />
          ))}
        </div>
      </header>

      {/* Clickable map */}
      <Link
        href="/map"
        className="home-card group relative block overflow-hidden transition-transform hover:-translate-y-0.5"
        aria-label="Open the map"
      >
        <div className="relative h-[168px] sm:h-[180px]">
          <HomeMapPreview />
          <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center px-3">
            <div className="rounded-full bg-white/95 px-3 py-1.5 text-center text-[12px] text-[var(--ink)] shadow-[0_6px_20px_rgba(22,22,42,0.1)] backdrop-blur">
              {places.length} spots · {lists.length} lists · tap to open map
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/90 to-transparent px-4 pb-3 pt-8">
            <p className="text-center text-[13px] text-[var(--ink)]">
              Playground ·{" "}
              <span className="font-display text-[var(--accent)]">
                {cities.join(" · ")}
              </span>
            </p>
          </div>
        </div>
      </Link>

      {/* Short itinerary dropdown */}
      <details className="home-card group mt-3 overflow-hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-[14px] font-medium text-[var(--ink)] marker:content-none [&::-webkit-details-marker]:hidden">
          <span>Short itinerary</span>
          <span className="text-[12px] text-[var(--ink-muted)] transition-transform group-open:rotate-180">
            ▾
          </span>
        </summary>
        <div className="border-t border-[var(--line)] px-4 pb-4 pt-3">
          <ul className="space-y-2.5">
            {shortItinerary.map((row) => (
              <li key={row.label} className="flex gap-3 text-[13px]">
                <span
                  className="mt-0.5 w-[5.5rem] shrink-0 font-medium"
                  style={{ color: "var(--accent)" }}
                >
                  {row.label}
                </span>
                <span className="text-[var(--ink-muted)]">{row.detail}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/itinerary"
            className="mt-4 inline-flex text-[13px] font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            Full itinerary →
          </Link>
        </div>
      </details>

      {/* Top 3 */}
      <section className="mt-3 grid grid-cols-2 gap-3">
        {travellers.map((t) => (
          <div key={t.id} className="home-card p-3.5">
            <div className="flex items-center gap-2">
              <TravellerAvatar
                emoji={t.emoji}
                accent={t.accent}
                label={t.name}
                size={32}
              />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-[var(--ink)]">
                  {t.name}
                </p>
                <p className="truncate text-[10px] text-[var(--ink-muted)]">
                  {t.days}
                </p>
              </div>
            </div>
            <p
              className="mt-3 text-[10px] font-medium uppercase tracking-[0.14em]"
              style={{ color: t.accent }}
            >
              Top 3
            </p>
            <ol className="mt-1.5 space-y-1.5">
              {t.top3.map((item, i) => (
                <li
                  key={item}
                  className="flex gap-1.5 text-[11px] leading-snug text-[var(--ink)]"
                >
                  <span
                    className="shrink-0 tabular-nums"
                    style={{ color: t.accent }}
                  >
                    {i + 1}.
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>

      {/* Neighbourhoods */}
      <section className="home-card mt-3 px-4 py-4">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="font-display text-[16px] text-[var(--ink)]">
            Tokyo neighbourhoods
          </h2>
          <Link
            href="/map"
            className="text-[11px] font-medium text-[var(--accent)]"
          >
            Map →
          </Link>
        </div>
        <ul className="mt-3 divide-y divide-[var(--line)]">
          {tokyoNeighbourhoods.map((n) => (
            <li
              key={n.name}
              className="flex items-start justify-between gap-3 py-2 first:pt-0 last:pb-0"
            >
              <span className="text-[13px] font-medium text-[var(--ink)]">
                {n.name}
              </span>
              <span className="text-right text-[12px] text-[var(--ink-muted)]">
                {n.vibe}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Compact nav links */}
      <nav className="mt-3 flex gap-2 text-[13px]">
        <Link
          href="/planning"
          className="home-card flex-1 px-3 py-2.5 text-center font-medium text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
        >
          Planning
        </Link>
        <Link
          href="/reservations"
          className="home-card flex-1 px-3 py-2.5 text-center font-medium text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
        >
          Reservations
        </Link>
        <Link
          href="/itinerary"
          className="home-card flex-1 px-3 py-2.5 text-center font-medium text-[var(--accent)]"
        >
          Itinerary
        </Link>
      </nav>

      <footer className="mt-auto pt-8 text-center">
        <p className="text-[12px] text-[var(--ink-muted)]">
          Built for Karima · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
