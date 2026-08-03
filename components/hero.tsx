"use client";

import { useEffect, useRef } from "react";

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.style.setProperty("--hero-progress", "1");
      return;
    }
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = Math.max(rect.height - window.innerHeight * 0.35, 1);
      const progress = Math.min(Math.max((-rect.top) / total, 0), 1);
      el.style.setProperty("--hero-progress", String(progress));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={ref}
      className="relative isolate min-h-[88vh] overflow-hidden text-[var(--paper)]"
    >
      <div
        className="absolute inset-0 scale-[calc(1+var(--hero-progress)*0.08)] bg-cover bg-center transition-transform duration-100 will-change-transform"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2400&q=80)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(18,28,42,0.35) 0%, rgba(18,28,42,0.55) 45%, rgba(18,28,42,0.88) 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <a href="#explore" className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
          Karima
        </a>
        <div className="flex items-center gap-4 text-sm text-white/80">
          <a href="#explore" className="hover:text-white">
            Places
          </a>
          <a href="#lists" className="hover:text-white">
            Lists
          </a>
        </div>
      </nav>

      <div className="relative z-10 mx-auto flex min-h-[calc(88vh-72px)] max-w-7xl flex-col justify-end px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <p
          className="mb-4 text-xs font-medium uppercase tracking-[0.28em] text-white/70 opacity-0 animate-[fade-up_0.9s_ease_forwards]"
          style={{ animationDelay: "0.1s" }}
        >
          Japan trip field guide
        </p>
        <h1
          className="max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight opacity-0 animate-[fade-up_1s_ease_forwards] sm:text-7xl lg:text-8xl"
          style={{ animationDelay: "0.2s" }}
        >
          Karima
        </h1>
        <p
          className="mt-5 max-w-lg text-base text-white/85 opacity-0 animate-[fade-up_1s_ease_forwards] sm:text-lg"
          style={{ animationDelay: "0.35s" }}
        >
          Every temple, gallery, and bowl of ramen from your Google Maps lists —
          sorted by neighbourhood so the day plans itself.
        </p>
        <div
          className="mt-8 flex flex-wrap gap-3 opacity-0 animate-[fade-up_1s_ease_forwards]"
          style={{ animationDelay: "0.5s" }}
        >
          <a
            href="#explore"
            className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:brightness-110"
          >
            Browse places
          </a>
          <a
            href="#lists"
            className="rounded-full border border-white/35 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
          >
            View imported lists
          </a>
        </div>
      </div>
    </header>
  );
}
