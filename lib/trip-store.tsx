"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "karima-japan-trip-v1";

type TripState = {
  saved: string[];
  visited: string[];
};

type TripStore = {
  saved: Set<string>;
  visited: Set<string>;
  toggleSaved: (id: string) => void;
  toggleVisited: (id: string) => void;
  isSaved: (id: string) => boolean;
  isVisited: (id: string) => boolean;
};

const TripContext = createContext<TripStore | null>(null);

function loadState(): TripState {
  if (typeof window === "undefined") return { saved: [], visited: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { saved: [], visited: [] };
    const parsed = JSON.parse(raw) as TripState;
    return {
      saved: Array.isArray(parsed.saved) ? parsed.saved : [],
      visited: Array.isArray(parsed.visited) ? parsed.visited : [],
    };
  } catch {
    return { saved: [], visited: [] };
  }
}

export function TripProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TripState>({ saved: [], visited: [] });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const toggleSaved = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      saved: prev.saved.includes(id)
        ? prev.saved.filter((x) => x !== id)
        : [...prev.saved, id],
    }));
  }, []);

  const toggleVisited = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      visited: prev.visited.includes(id)
        ? prev.visited.filter((x) => x !== id)
        : [...prev.visited, id],
    }));
  }, []);

  const value = useMemo<TripStore>(() => {
    const saved = new Set(state.saved);
    const visited = new Set(state.visited);
    return {
      saved,
      visited,
      toggleSaved,
      toggleVisited,
      isSaved: (id) => saved.has(id),
      isVisited: (id) => visited.has(id),
    };
  }, [state, toggleSaved, toggleVisited]);

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTripStore() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTripStore must be used within TripProvider");
  return ctx;
}
