"use client";

import { useEffect, useState } from "react";
import { NavBar } from "@/components/nav-bar";
import { SiteFooter } from "@/components/site-footer";
import { PixelCheck } from "@/components/pixel-icons";

const SECTIONS = [
  {
    title: "Before you go",
    items: [
      "Check passport expiration",
      "Book flights",
      "Reserve hotels / Airbnb",
      "Travel insurance",
      "Notify bank / cards",
    ],
  },
  {
    title: "Packing",
    items: [
      "Comfortable walking shoes",
      "Power adapter (Type A/B)",
      "Portable Wi‑Fi / eSIM",
      "Medications",
      "Light layers",
    ],
  },
  {
    title: "On the ground",
    items: [
      "Suica / Pasmo / ICOCA",
      "Cash for small shops",
      "Translation app offline packs",
      "Google Maps offline areas",
      "JR Pass / regional passes if needed",
    ],
  },
];

const KEY = "karima-japan-planning";

export default function PlanningPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setChecked(new Set(JSON.parse(raw)));
    } catch {}
    setMounted(true);
  }, []);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const total = SECTIONS.reduce((n, s) => n + s.items.length, 0);
  const done = mounted ? [...checked].filter((id) => id.startsWith("plan:")).length : 0;

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--ro)]">
      <NavBar current="/planning" />
      <main className="mx-auto w-full max-w-[640px] flex-1 px-4 py-8">
        <h1 className="font-pixel text-[18px] text-[var(--shironeri)]">Planning</h1>
        <p className="mt-1 font-mono text-[12px] text-[var(--sunezumi)]">
          {mounted ? `${done} / ${total} done` : "…"}
        </p>

        <div className="mt-8 space-y-8">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 font-mono text-[12px] uppercase tracking-wider text-[var(--kuchiba)]">
                {section.title}
              </h2>
              <ul className="border border-[var(--keshizumi)]/60">
                {section.items.map((item) => {
                  const id = `plan:${section.title}:${item}`;
                  const isOn = checked.has(id);
                  return (
                    <li
                      key={id}
                      className="flex items-center gap-3 border-b border-[var(--keshizumi)]/50 px-3 last:border-b-0"
                      style={{ opacity: isOn ? 0.35 : 1 }}
                    >
                      <PixelCheck filled={isOn} onClick={() => toggle(id)} />
                      <span className="py-3 text-[14px] text-[var(--shironeri)]">{item}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
