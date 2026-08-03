"use client";

import { FormEvent, useMemo, useState } from "react";
import { NavBar } from "@/components/nav-bar";
import { SiteFooter } from "@/components/site-footer";
import { places } from "@/lib/places";
import { getMapsUrl } from "@/lib/maps";
import { useReservations, type Reservation } from "@/lib/use-reservations";

function formatWhen(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ReservationsPage() {
  const { items, add, update, remove, count, mounted } = useReservations();
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const foodPlaces = useMemo(
    () =>
      places
        .filter((p) => p.category === "food" || p.sourceList === "food")
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  const resetForm = () => {
    setName("");
    setDatetime("");
    setMapsUrl("");
    setNotes("");
    setPlaceId("");
    setEditingId(null);
  };

  const onPickPlace = (id: string) => {
    setPlaceId(id);
    const place = places.find((p) => p.id === id);
    if (!place) return;
    setName(place.name);
    setMapsUrl(getMapsUrl(place.lat, place.lng, place.name, place.mapsUrl));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !datetime) return;
    const payload = {
      name: name.trim(),
      datetime,
      mapsUrl:
        mapsUrl.trim() ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name.trim() + " Japan")}`,
      notes: notes.trim() || undefined,
      placeId: placeId || undefined,
    };
    if (editingId) {
      update(editingId, payload);
    } else {
      add(payload);
    }
    resetForm();
  };

  const startEdit = (r: Reservation) => {
    setEditingId(r.id);
    setName(r.name);
    setDatetime(r.datetime);
    setMapsUrl(r.mapsUrl);
    setNotes(r.notes || "");
    setPlaceId(r.placeId || "");
  };

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--paper)]">
      <NavBar current="/reservations" />
      <main className="mx-auto w-full max-w-[720px] flex-1 px-4 py-8">
        <h1 className="font-display text-3xl text-[var(--ink)]">Reservations</h1>
        <p className="mt-2 text-[14px] text-[var(--ink-muted)]">
          Save restaurants you&apos;ve booked — time, notes, and a Google Maps link.
          {mounted ? ` ${count} saved.` : ""}
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-4 border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)] sm:p-5"
        >
          <h2 className="font-display text-lg text-[var(--accent)]">
            {editingId ? "Edit reservation" : "Add reservation"}
          </h2>

          <label className="block space-y-1.5">
            <span className="text-[12px] uppercase tracking-wider text-[var(--ink-muted)]">
              From your food list (optional)
            </span>
            <select
              value={placeId}
              onChange={(e) => onPickPlace(e.target.value)}
              className="w-full border border-[var(--line)] bg-white px-3 py-2.5 text-[14px] outline-none focus:border-[var(--accent)]"
            >
              <option value="">Choose a place…</option>
              {foodPlaces.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                  {p.neighbourhood ? ` — ${p.neighbourhood}` : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1.5">
            <span className="text-[12px] uppercase tracking-wider text-[var(--ink-muted)]">
              Restaurant name
            </span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tempura Kondo"
              className="w-full border border-[var(--line)] bg-white px-3 py-2.5 text-[14px] outline-none focus:border-[var(--accent)]"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[12px] uppercase tracking-wider text-[var(--ink-muted)]">
              Date & time
            </span>
            <input
              required
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="w-full border border-[var(--line)] bg-white px-3 py-2.5 text-[14px] outline-none focus:border-[var(--accent)]"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[12px] uppercase tracking-wider text-[var(--ink-muted)]">
              Google Maps link
            </span>
            <input
              type="url"
              value={mapsUrl}
              onChange={(e) => setMapsUrl(e.target.value)}
              placeholder="https://maps.google.com/…"
              className="w-full border border-[var(--line)] bg-white px-3 py-2.5 text-[14px] outline-none focus:border-[var(--accent)]"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[12px] uppercase tracking-wider text-[var(--ink-muted)]">
              Notes
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Confirmation #, party size, dress code…"
              className="w-full resize-y border border-[var(--line)] bg-white px-3 py-2.5 text-[14px] outline-none focus:border-[var(--accent)]"
            />
          </label>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="submit"
              className="bg-[var(--accent)] px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[var(--accent-strong)]"
            >
              {editingId ? "Save changes" : "Add reservation"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="border border-[var(--line)] px-4 py-2.5 text-[14px] text-[var(--ink-muted)] hover:border-[var(--ink-muted)]"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <div className="mt-10 space-y-3">
          {!mounted ? (
            <p className="text-[13px] text-[var(--ink-muted)]">Loading…</p>
          ) : items.length === 0 ? (
            <div className="border border-dashed border-[var(--line)] bg-[var(--surface)] px-4 py-12 text-center text-[14px] text-[var(--ink-muted)]">
              No reservations yet. Add your first booking above.
            </div>
          ) : (
            items.map((r) => (
              <article
                key={r.id}
                className="border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-xl text-[var(--ink)]">{r.name}</h3>
                    <p className="mt-1 text-[14px] text-[var(--accent)]">{formatWhen(r.datetime)}</p>
                    {r.notes ? (
                      <p className="mt-2 text-[13px] text-[var(--ink-muted)]">{r.notes}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(r)}
                      className="text-[12px] text-[var(--ink-muted)] underline-offset-2 hover:text-[var(--accent)] hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(r.id)}
                      className="text-[12px] text-[var(--ink-muted)] underline-offset-2 hover:text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <a
                  href={r.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-[var(--accent)] hover:underline"
                >
                  Open in Google Maps ↗
                </a>
              </article>
            ))
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
