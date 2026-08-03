"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "karima-japan-starred";
const SYNC = "karima-japan-starred-sync";

function read(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem(KEY);
    return stored ? new Set<string>(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

export function useStarred() {
  const [starred, setStarred] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setStarred(read());
    setMounted(true);
    const onSync = () => setStarred(read());
    window.addEventListener(SYNC, onSync);
    return () => window.removeEventListener(SYNC, onSync);
  }, []);

  const toggle = useCallback((id: string) => {
    setStarred((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(KEY, JSON.stringify([...next]));
      window.dispatchEvent(new Event(SYNC));
      return next;
    });
  }, []);

  const isStarred = useCallback((id: string) => starred.has(id), [starred]);

  return { starred, toggle, isStarred, count: starred.size, mounted };
}
