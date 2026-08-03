"use client";

import { useState } from "react";
import { getSourceLists, type ListFilter } from "@/lib/places";
import { cn } from "@/lib/utils";

interface ListFiltersProps {
  active: ListFilter;
  onChange: (f: ListFilter) => void;
}

export function ListFilters({ active, onChange }: ListFiltersProps) {
  const lists = getSourceLists();
  const [hovered, setHovered] = useState<string | null>(null);

  const chips: { key: ListFilter; label: string; color: string }[] = [
    { key: "all", label: "All", color: "var(--accent)" },
    ...lists.map((l) => ({
      key: l.id,
      label: `${shortListName(l.name)} · ${l.count}`,
      color: l.id === "food" ? "var(--food)" : "var(--accent)",
    })),
  ];

  return (
    <div className="sticky top-[calc(48px+35vh)] z-30 flex gap-1.5 overflow-x-auto border-b border-[var(--line)] bg-[var(--surface)] px-4 py-2 hide-scrollbar sm:top-[calc(48px+364px)]">
      {chips.map(({ key, label, color }) => {
        const isActive = active === key;
        const isHovered = hovered === key && !isActive;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "shrink-0 cursor-pointer border px-2.5 py-1 text-[13px] transition-colors sm:text-[14px]",
              isActive
                ? "border-current bg-[var(--accent-soft)]"
                : "border-[var(--line)] text-[var(--ink-muted)] hover:text-[var(--ink)]",
            )}
            style={{
              ...(isActive
                ? { color, borderColor: color }
                : isHovered
                  ? { borderColor: color }
                  : {}),
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function shortListName(name: string) {
  if (name.toLowerCase().includes("food")) return "食 Food";
  if (name.toLowerCase().includes("temple") || name.toLowerCase().includes("museum")) {
    return "文 Culture";
  }
  return name;
}
