"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "karima-japan-checked";
const SYNC = "karima-japan-checked-sync";

function read(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem(KEY);
    return stored ? new Set<string>(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

export function useChecked() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setChecked(read());
    setMounted(true);
    const onSync = () => setChecked(read());
    window.addEventListener(SYNC, onSync);
    return () => window.removeEventListener(SYNC, onSync);
  }, []);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(KEY, JSON.stringify([...next]));
      window.dispatchEvent(new Event(SYNC));
      return next;
    });
  }, []);

  const isChecked = useCallback((id: string) => checked.has(id), [checked]);

  return { checked, toggle, isChecked, mounted };
}
