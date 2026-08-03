"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type Reservation = {
  id: string;
  name: string;
  datetime: string; // ISO local datetime string from input
  mapsUrl: string;
  notes?: string;
  placeId?: string;
  createdAt: string;
};

const KEY = "karima-japan-reservations";
const SYNC = "karima-japan-reservations-sync";

function read(): Reservation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Reservation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: Reservation[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(SYNC));
}

export function useReservations() {
  const [items, setItems] = useState<Reservation[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(read());
    setMounted(true);
    const onSync = () => setItems(read());
    window.addEventListener(SYNC, onSync);
    return () => window.removeEventListener(SYNC, onSync);
  }, []);

  const add = useCallback(
    (input: Omit<Reservation, "id" | "createdAt">) => {
      const next: Reservation = {
        ...input,
        id: `res-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
      };
      setItems((prev) => {
        const list = [...prev, next].sort((a, b) =>
          a.datetime.localeCompare(b.datetime),
        );
        write(list);
        return list;
      });
      return next;
    },
    [],
  );

  const update = useCallback((id: string, patch: Partial<Reservation>) => {
    setItems((prev) => {
      const list = prev
        .map((r) => (r.id === id ? { ...r, ...patch } : r))
        .sort((a, b) => a.datetime.localeCompare(b.datetime));
      write(list);
      return list;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const list = prev.filter((r) => r.id !== id);
      write(list);
      return list;
    });
  }, []);

  const sorted = useMemo(
    () => [...items].sort((a, b) => a.datetime.localeCompare(b.datetime)),
    [items],
  );

  return { items: sorted, add, update, remove, count: items.length, mounted };
}
