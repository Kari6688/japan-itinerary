import { getSourceLists, tripStats } from "@/lib/places";

export function ListsSection() {
  const lists = getSourceLists();

  return (
    <section
      id="lists"
      className="border-y border-[var(--line)] bg-[var(--paper)]/70 py-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--ink-muted)]">
          Imported from Google Maps
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
          Your lists, in one place
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-[var(--ink-muted)] sm:text-base">
          Seeded from the shared Maps lists you sent. Add more later and we can
          merge them into the same neighbourhood view.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {lists.map((list, i) => (
            <a
              key={list.id}
              href={list.url}
              target="_blank"
              rel="noreferrer"
              className="group block rounded-3xl border border-[var(--line)] bg-[var(--mist)]/50 p-6 transition hover:-translate-y-0.5 hover:border-[var(--ink)]/20 hover:shadow-[var(--shadow-soft)]"
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                Google Maps list
              </p>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)] group-hover:text-[var(--accent)]">
                {list.name}
              </h3>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">
                {list.count} places imported
              </p>
            </a>
          ))}
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["Places", tripStats.total],
            ["On the map", tripStats.withCoords],
            ["Cities", tripStats.cities],
            ["Neighbourhoods", tripStats.neighbourhoods],
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-2xl bg-[var(--mist)] px-4 py-5">
              <dt className="text-xs uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                {label}
              </dt>
              <dd className="mt-1 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
