"use client";

import Link from "next/link";
import { useStarred } from "@/lib/use-starred";

interface NavBarProps {
  current?: "/" | "/map" | "/planning" | "/saved";
}

export function NavBar({ current }: NavBarProps) {
  const { count, mounted } = useStarred();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-[var(--keshizumi)] bg-[var(--ro)] px-4 py-3 font-mono text-[14px]">
      <Link href="/" className="block" aria-label="Home">
        <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="24" fill="#FCFAF2" />
          <circle cx="18" cy="12" r="7.2" fill="#CB1B45" />
        </svg>
      </Link>
      <div className="flex items-center gap-5 md:gap-10">
        <Link
          href="/map"
          className={`font-pixel transition-colors hover:text-white ${
            current === "/map" ? "text-white" : "text-[var(--ginnezumi)]"
          }`}
        >
          Map
        </Link>
        <Link
          href="/planning"
          className={`font-pixel transition-colors hover:text-white ${
            current === "/planning" ? "text-white" : "text-[var(--ginnezumi)]"
          }`}
        >
          Planning
        </Link>
        <Link
          href="/saved"
          className={`font-pixel transition-colors hover:text-white ${
            current === "/saved" ? "text-white" : "text-[var(--ginnezumi)]"
          }`}
        >
          Saved
          {mounted ? (
            <span style={{ fontVariantNumeric: "tabular-nums" }}> ({count})</span>
          ) : null}
        </Link>
      </div>
    </nav>
  );
}
