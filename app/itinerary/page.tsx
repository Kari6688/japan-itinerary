import Link from "next/link";
import { NavBar } from "@/components/nav-bar";
import { SiteFooter } from "@/components/site-footer";
import { TravellerAvatar } from "@/components/traveller-avatar";
import { days, stays, travellers } from "@/lib/trip";

export default function ItineraryPage() {
  return (
    <div className="min-h-dvh">
      <NavBar current="/itinerary" />
      <main className="mx-auto max-w-lg px-4 py-6 pb-16">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
          Full itinerary
        </p>
        <h1 className="mt-1 font-display text-3xl text-[var(--ink)]">
          Japan · March trip
        </h1>
        <p className="mt-2 text-[13px] text-[var(--ink-muted)]">
          Flight into Tokyo · Karima through the 17th · Ryan ~9 days
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {travellers.map((t) => (
            <div key={t.id} className="home-card p-3.5">
              <div className="flex items-center gap-2">
                <TravellerAvatar
                  emoji={t.emoji}
                  accent={t.accent}
                  label={t.name}
                  size={36}
                />
                <div>
                  <p className="text-[14px] font-medium text-[var(--ink)]">
                    {t.name}
                  </p>
                  <p className="text-[11px] text-[var(--ink-muted)]">{t.days}</p>
                </div>
              </div>
              <p className="mt-2 text-[11px] leading-snug text-[var(--ink-muted)]">
                {t.window}
              </p>
            </div>
          ))}
        </div>

        <section className="mt-8">
          <h2 className="font-display text-lg text-[var(--accent)]">Stays</h2>
          <ul className="mt-3 space-y-2">
            {stays.map((s) => (
              <li
                key={`${s.dates}-${s.place}`}
                className="flex items-start gap-3 border-b border-[var(--line)] py-2.5 text-[13px] last:border-0"
              >
                <span className="w-12 shrink-0 tabular-nums text-[var(--accent)]">
                  {s.dates}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-[var(--ink)]">{s.place}</p>
                  <p className="text-[12px] text-[var(--ink-muted)]">
                    {s.city}
                    {s.who === "karima" ? " · Karima solo" : " · both"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-lg text-[var(--accent)]">
            Day by day
          </h2>
          <ol className="mt-3 space-y-4">
            {days.map((d) => (
              <li key={d.date} className="home-card px-4 py-3.5">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[12px] font-medium text-[var(--accent)]">
                    {d.date}
                  </p>
                  <WhoBadge who={d.who} />
                </div>
                <h3 className="mt-1 text-[15px] font-medium text-[var(--ink)]">
                  {d.title}
                </h3>
                <ul className="mt-2 space-y-1">
                  {d.bullets.map((b) => (
                    <li
                      key={b}
                      className="text-[13px] leading-snug text-[var(--ink-muted)]"
                    >
                      · {b}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <p className="mt-8 text-center text-[12px]">
          <Link href="/" className="text-[var(--accent)] hover:underline">
            ← Back home
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

function WhoBadge({ who }: { who: "both" | "karima" | "ryan-leaves" }) {
  if (who === "both") {
    return (
      <span className="rounded-full bg-[rgba(46,41,235,0.08)] px-2 py-0.5 text-[10px] font-medium text-[var(--accent)]">
        Both
      </span>
    );
  }
  if (who === "ryan-leaves") {
    return (
      <span className="rounded-full bg-[rgba(224,120,48,0.12)] px-2 py-0.5 text-[10px] font-medium text-[var(--food)]">
        Ryan leaves
      </span>
    );
  }
  return (
    <span className="rounded-full bg-[rgba(196,91,140,0.12)] px-2 py-0.5 text-[10px] font-medium text-[var(--shopping)]">
      Karima solo
    </span>
  );
}
