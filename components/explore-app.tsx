"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Heart, Check, ExternalLink, MapPin, Search, X } from "lucide-react";
import {
  filterPlaces,
  getCategories,
  getCities,
  getNeighbourhoods,
  getSourceLists,
  places,
  tripStats,
} from "@/lib/places";
import { CATEGORY_META, type Place } from "@/lib/types";
import { useTripStore } from "@/lib/trip-store";
import { cn, formatRating } from "@/lib/utils";

const PlacesMap = dynamic(() => import("@/components/places-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[320px] items-center justify-center bg-[var(--mist)] text-sm text-[var(--ink-muted)]">
      Loading map…
    </div>
  ),
});

type ViewMode = "split" | "list" | "map";

export function ExploreApp() {
  const { saved, isSaved, isVisited, toggleSaved, toggleVisited } = useTripStore();
  const [city, setCity] = useState<string>("");
  const [neighbourhood, setNeighbourhood] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [sourceList, setSourceList] = useState<string>("");
  const [query, setQuery] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("split");
  const [groupBy, setGroupBy] = useState<"neighbourhood" | "category">("neighbourhood");

  const cities = useMemo(() => getCities(places), []);
  const sourceLists = useMemo(() => getSourceLists(places), []);

  const filtered = useMemo(
    () =>
      filterPlaces(places, {
        city: city || undefined,
        neighbourhood: neighbourhood || undefined,
        category: category || undefined,
        sourceList: sourceList || undefined,
        query,
        savedOnly,
        savedIds: saved,
      }),
    [city, neighbourhood, category, sourceList, query, savedOnly, saved],
  );

  const neighbourhoods = useMemo(
    () => getNeighbourhoods(places, city || undefined),
    [city],
  );
  const categories = useMemo(() => getCategories(places), []);

  const selected = filtered.find((p) => p.id === selectedId) ?? filtered[0] ?? null;

  useEffect(() => {
    if (selectedId && !filtered.some((p) => p.id === selectedId)) {
      setSelectedId(filtered[0]?.id ?? null);
    }
  }, [filtered, selectedId]);

  const grouped = useMemo(() => {
    const map = new Map<string, Place[]>();
    for (const p of filtered) {
      const key =
        groupBy === "neighbourhood"
          ? `${p.city === "Japan" ? "" : p.city + " · "}${p.neighbourhood}`
          : CATEGORY_META[p.category]?.label ?? p.category;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered, groupBy]);

  const clearFilters = () => {
    setCity("");
    setNeighbourhood("");
    setCategory("");
    setSourceList("");
    setQuery("");
    setSavedOnly(false);
  };

  const hasFilters = Boolean(city || neighbourhood || category || sourceList || query || savedOnly);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--ink-muted)]">
            Explore
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
            {filtered.length} places
            {hasFilters ? " match" : " saved from Maps"}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[var(--ink-muted)] sm:text-base">
            Your Google Maps lists, gathered in one place — filter by neighbourhood
            or category, pin favourites, mark what you&apos;ve visited.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[var(--paper)] p-1 shadow-[var(--shadow-soft)]">
          {(["split", "list", "map"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setView(mode)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium capitalize transition",
                view === mode
                  ? "bg-[var(--ink)] text-[var(--paper)]"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]",
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search places, neighbourhoods, cuisine…"
            className="w-full rounded-2xl border border-[var(--line)] bg-[var(--paper)] py-3 pl-10 pr-10 text-sm outline-none ring-[var(--accent)] transition focus:ring-2"
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]"
              onClick={() => setQuery("")}
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={!city}
            onClick={() => {
              setCity("");
              setNeighbourhood("");
            }}
          >
            All cities
          </FilterChip>
          {cities.map((c) => (
            <FilterChip
              key={c.name}
              active={city === c.name}
              onClick={() => {
                setCity(c.name === city ? "" : c.name);
                setNeighbourhood("");
              }}
            >
              {c.name} · {c.count}
            </FilterChip>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterChip active={!category} onClick={() => setCategory("")}>
            All categories
          </FilterChip>
          {categories.map((c) => (
            <FilterChip
              key={c.name}
              active={category === c.name}
              onClick={() => setCategory(category === c.name ? "" : c.name)}
              color={CATEGORY_META[c.name]?.color}
            >
              {CATEGORY_META[c.name]?.label ?? c.name} · {c.count}
            </FilterChip>
          ))}
        </div>

        {neighbourhoods.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <FilterChip active={!neighbourhood} onClick={() => setNeighbourhood("")}>
              All neighbourhoods
            </FilterChip>
            {neighbourhoods.slice(0, 16).map((n) => (
              <FilterChip
                key={n.name}
                active={neighbourhood === n.name}
                onClick={() =>
                  setNeighbourhood(neighbourhood === n.name ? "" : n.name)
                }
              >
                {n.name} · {n.count}
              </FilterChip>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          {sourceLists.map((s) => (
            <FilterChip
              key={s.id}
              active={sourceList === s.id}
              onClick={() => setSourceList(sourceList === s.id ? "" : s.id)}
            >
              {s.name} · {s.count}
            </FilterChip>
          ))}
          <FilterChip active={savedOnly} onClick={() => setSavedOnly((v) => !v)}>
            Favourites · {saved.size}
          </FilterChip>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-[var(--ink-muted)]">Group by</span>
            <FilterChip
              active={groupBy === "neighbourhood"}
              onClick={() => setGroupBy("neighbourhood")}
            >
              Neighbourhood
            </FilterChip>
            <FilterChip
              active={groupBy === "category"}
              onClick={() => setGroupBy("category")}
            >
              Category
            </FilterChip>
            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-medium text-[var(--accent)] underline-offset-2 hover:underline"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "grid gap-4",
          view === "split" && "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
        )}
      >
        {view !== "map" ? (
          <div className="max-h-[70vh] space-y-6 overflow-y-auto rounded-3xl border border-[var(--line)] bg-[var(--paper)]/80 p-3 sm:p-4">
            {grouped.length === 0 ? (
              <div className="px-4 py-16 text-center text-sm text-[var(--ink-muted)]">
                No places match these filters.
              </div>
            ) : (
              grouped.map(([group, items]) => (
                <section key={group}>
                  <div className="mb-2 flex items-baseline justify-between px-1">
                    <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                      {group}
                    </h3>
                    <span className="text-xs text-[var(--ink-muted)]">
                      {items.length}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {items.map((place) => (
                      <PlaceRow
                        key={place.id}
                        place={place}
                        active={selected?.id === place.id}
                        saved={isSaved(place.id)}
                        visited={isVisited(place.id)}
                        onSelect={() => setSelectedId(place.id)}
                        onToggleSaved={() => toggleSaved(place.id)}
                        onToggleVisited={() => toggleVisited(place.id)}
                      />
                    ))}
                  </ul>
                </section>
              ))
            )}
          </div>
        ) : null}

        {view !== "list" ? (
          <div className="flex min-h-[420px] flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--paper)] shadow-[var(--shadow-soft)] lg:min-h-[70vh]">
            <div className="min-h-0 flex-1">
              <PlacesMap
                places={filtered}
                selectedId={selected?.id ?? null}
                onSelect={setSelectedId}
              />
            </div>
            {selected ? (
              <SelectedPanel
                place={selected}
                saved={isSaved(selected.id)}
                visited={isVisited(selected.id)}
                onToggleSaved={() => toggleSaved(selected.id)}
                onToggleVisited={() => toggleVisited(selected.id)}
              />
            ) : null}
          </div>
        ) : null}
      </div>

      <p className="mt-8 text-center text-xs text-[var(--ink-muted)]">
        {tripStats.total} places · {tripStats.withCoords} on map ·{" "}
        {tripStats.cities} cities · {tripStats.neighbourhoods} neighbourhoods
      </p>
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
  color,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition",
        active
          ? "border-transparent text-white"
          : "border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--ink-muted)]",
      )}
      style={
        active
          ? { backgroundColor: color || "var(--ink)", borderColor: "transparent" }
          : undefined
      }
    >
      {children}
    </button>
  );
}

function PlaceRow({
  place,
  active,
  saved,
  visited,
  onSelect,
  onToggleSaved,
  onToggleVisited,
}: {
  place: Place;
  active: boolean;
  saved: boolean;
  visited: boolean;
  onSelect: () => void;
  onToggleSaved: () => void;
  onToggleVisited: () => void;
}) {
  const meta = CATEGORY_META[place.category];
  return (
    <li>
      <div
        className={cn(
          "flex items-start gap-3 rounded-2xl border px-3 py-3 transition",
          active
            ? "border-[var(--ink)]/20 bg-[var(--mist)]"
            : "border-transparent hover:bg-[var(--mist)]/70",
          visited && "opacity-70",
        )}
      >
        <button type="button" onClick={onSelect} className="min-w-0 flex-1 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: meta?.color }}
            />
            <span className="font-medium text-[var(--ink)]">{place.name}</span>
            {visited ? (
              <span className="text-[10px] uppercase tracking-wide text-[var(--ink-muted)]">
                Visited
              </span>
            ) : null}
          </div>
          <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-[var(--ink-muted)]">
            <span>{place.neighbourhood}</span>
            {place.city !== "Japan" ? <span>· {place.city}</span> : null}
            {place.subtype ? <span>· {place.subtype}</span> : null}
            {place.price ? <span>· {place.price}</span> : null}
            {formatRating(place.rating, place.reviewCount) ? (
              <span>· ★ {formatRating(place.rating, place.reviewCount)}</span>
            ) : null}
          </div>
        </button>
        <div className="flex shrink-0 gap-1">
          <IconBtn
            label={visited ? "Mark unvisited" : "Mark visited"}
            active={visited}
            onClick={onToggleVisited}
          >
            <Check className="h-4 w-4" />
          </IconBtn>
          <IconBtn
            label={saved ? "Remove favourite" : "Save favourite"}
            active={saved}
            onClick={onToggleSaved}
          >
            <Heart className={cn("h-4 w-4", saved && "fill-current")} />
          </IconBtn>
        </div>
      </div>
    </li>
  );
}

function SelectedPanel({
  place,
  saved,
  visited,
  onToggleSaved,
  onToggleVisited,
}: {
  place: Place;
  saved: boolean;
  visited: boolean;
  onToggleSaved: () => void;
  onToggleVisited: () => void;
}) {
  const meta = CATEGORY_META[place.category];
  return (
    <div className="border-t border-[var(--line)] bg-[var(--paper)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className="text-xs font-medium uppercase tracking-[0.16em]"
            style={{ color: meta?.color }}
          >
            {meta?.label}
            {place.subtype ? ` · ${place.subtype}` : ""}
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            {place.name}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--ink-muted)]">
            <MapPin className="h-3.5 w-3.5" />
            {place.neighbourhood}
            {place.city !== "Japan" ? `, ${place.city}` : ""}
            {place.address ? ` — ${place.address}` : ""}
          </p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--ink-muted)]">
            {formatRating(place.rating, place.reviewCount) ? (
              <span>★ {formatRating(place.rating, place.reviewCount)}</span>
            ) : null}
            {place.price ? <span>{place.price}</span> : null}
            <span>From: {place.sourceListName}</span>
          </div>
        </div>
        <div className="flex gap-1">
          <IconBtn
            label={visited ? "Mark unvisited" : "Mark visited"}
            active={visited}
            onClick={onToggleVisited}
          >
            <Check className="h-4 w-4" />
          </IconBtn>
          <IconBtn
            label={saved ? "Remove favourite" : "Save favourite"}
            active={saved}
            onClick={onToggleSaved}
          >
            <Heart className={cn("h-4 w-4", saved && "fill-current")} />
          </IconBtn>
        </div>
      </div>
      <a
        href={place.mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:underline"
      >
        Open in Google Maps <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  active,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "rounded-full border p-2 transition",
        active
          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
          : "border-[var(--line)] text-[var(--ink-muted)] hover:text-[var(--ink)]",
      )}
    >
      {children}
    </button>
  );
}
