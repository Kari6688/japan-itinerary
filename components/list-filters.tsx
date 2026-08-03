"use client";

import { useState } from "react";
import { getListConfig } from "@/lib/list-colors";
import { getSourceLists, type ListFilter } from "@/lib/places";
import { cn } from "@/lib/utils";

interface ListFiltersProps {
  active: ListFilter;
  onChange: (f: ListFilter) => void;
}

export function ListFilters({ active, onChange }: ListFiltersProps) {
  const lists = getSourceLists();
  const [hovered, setHovered] = useState<string | null>(null);

  const chips: {
    key: ListFilter;
    label: string;
    color: string;
    soft: string;
  }[] = [
    {
      key: "all",
      label: "All",
      color: "var(--accent)",
      soft: "var(--accent-soft)",
    },
    ...lists.map((l) => {
      const cfg = getListConfig(l.id);
      return {
        key: l.id,
        label: `${cfg.short} · ${l.count}`,
        color: cfg.color,
        soft: cfg.soft,
      };
    }),
  ];

  return (
    <div className="sticky top-[calc(48px+35vh)] z-30 flex gap-1.5 overflow-x-auto border-b border-[var(--line)] bg-[var(--surface)] px-4 py-2 hide-scrollbar sm:top-[calc(48px+364px)]">
      {chips.map(({ key, label, color, soft }) => {
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
                ? "border-current"
                : "border-[var(--line)] text-[var(--ink-muted)] hover:text-[var(--ink)]",
            )}
            style={{
              ...(isActive
                ? { color, borderColor: color, backgroundColor: soft }
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
