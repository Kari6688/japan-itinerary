"use client";

import Link from "next/link";
import { useReservations } from "@/lib/use-reservations";

export default function Home() {
  const { count, mounted } = useReservations();

  return (
    <div className="relative flex min-h-dvh flex-col">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(46,41,235,0.12), transparent 60%), radial-gradient(ellipse 50% 40% at 90% 90%, rgba(46,41,235,0.06), transparent 50%)",
        }}
      />

      <div
        className="pointer-events-none fixed left-4 top-4 z-10 hidden text-[var(--accent)] opacity-[0.08] md:block"
        style={{
          writingMode: "vertical-rl",
          textOrientation: "upright",
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "40px",
          lineHeight: 1,
        }}
      >
        日本のフィールドガイド
      </div>

      <div className="flex-1" />

      <div className="relative z-10 mb-[100px] px-4 sm:mb-[120px]">
        <div className="space-y-3 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
            Japan trip field guide
          </p>
          <h1 className="font-display text-4xl tracking-tight text-[var(--ink)] sm:text-5xl">
            Karima
          </h1>
          <p className="text-[13px] uppercase tracking-wider text-[var(--ink-muted)]">
            Tokyo · Kyoto · Osaka
          </p>
        </div>

        <nav className="mt-10 flex w-full flex-row gap-2 md:justify-center md:gap-4">
          {[
            { href: "/map", label: "Map", meta: "→" },
            { href: "/planning", label: "Planning", meta: "→" },
            {
              href: "/reservations",
              label: "Reservations",
              meta: `${mounted ? count : 0} →`,
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-1 items-center justify-between border border-[var(--line)] bg-[var(--surface)] px-3 py-3 shadow-[var(--shadow-soft)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] md:w-[160px] md:flex-none md:px-4"
            >
              <span className="font-display text-[15px] text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
                {item.label}
              </span>
              <span
                className="text-[12px] text-[var(--ink-muted)]"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {item.meta}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      <footer className="relative z-10 mt-auto px-4 py-4 text-center">
        <p className="text-[12px] text-[var(--ink-muted)]">
          Built for Karima · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
