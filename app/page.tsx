"use client";

import Link from "next/link";
import { useStarred } from "@/lib/use-starred";

export default function Home() {
  const { count, mounted } = useStarred();

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#0C0C0C]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(203,27,69,0.18), transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(226,148,59,0.1), transparent 50%)",
        }}
      />

      <div
        className="pointer-events-none fixed left-4 top-4 z-10 hidden md:block"
        style={{
          writingMode: "vertical-rl",
          textOrientation: "upright",
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "40px",
          color: "var(--shironeri)",
          opacity: 0.05,
          lineHeight: 1,
        }}
      >
        日本のフィールドガイド
      </div>

      <div className="flex-1" />

      <div className="relative z-10 mb-[100px] px-4 sm:mb-[120px]">
        <div className="space-y-2 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--sunezumi)]">
            Japan trip field guide
          </p>
          <h1 className="font-pixel text-2xl tracking-tight text-[var(--shironeri)] sm:text-3xl">
            Karima
          </h1>
          <p className="font-mono text-[12px] uppercase tracking-wider text-[var(--sunezumi)]">
            Tokyo · Kyoto · Osaka
          </p>
        </div>

        <nav className="mt-8 flex w-full flex-row gap-2 md:justify-center md:gap-6">
          <Link
            href="/map"
            className="group flex flex-1 items-center justify-between border border-white/80 px-3 py-3 transition-colors hover:border-white hover:bg-white/[0.05] md:w-[136px] md:flex-none md:px-4"
          >
            <span className="font-pixel text-[14px] text-white/80 transition-colors group-hover:text-white">
              Map
            </span>
            <span className="font-mono text-[12px] text-white/50">→</span>
          </Link>
          <Link
            href="/planning"
            className="group flex flex-1 items-center justify-between border border-white/80 px-3 py-3 transition-colors hover:border-white hover:bg-white/[0.05] md:w-[136px] md:flex-none md:px-4"
          >
            <span className="font-pixel text-[14px] text-white/80 transition-colors group-hover:text-white">
              Planning
            </span>
            <span className="font-mono text-[12px] text-white/50">→</span>
          </Link>
          <Link
            href="/saved"
            className="group flex flex-1 items-center justify-between border border-white/80 px-3 py-3 transition-colors hover:border-white hover:bg-white/[0.05] md:w-[136px] md:flex-none md:px-4"
          >
            <span className="font-pixel text-[14px] text-white/80 transition-colors group-hover:text-white">
              Saved
            </span>
            <span
              className="font-mono text-[12px] text-white/50"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {mounted ? count : 0} →
            </span>
          </Link>
        </nav>
      </div>

      <footer className="relative z-10 mt-auto px-4 py-4 text-center">
        <p className="font-mono text-[12px] text-[var(--keshizumi)]">
          Built for Karima · {new Date().getFullYear()} · Layout inspired by{" "}
          <a
            href="https://japan-field-guide.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--sunezumi)] no-underline transition-colors hover:text-[var(--shironeri)]"
          >
            Japan Field Guide
          </a>
        </p>
      </footer>
    </div>
  );
}
