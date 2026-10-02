"use client";

import { useMemo, useState } from "react";
import { OutletCard } from "./cards";
import { outlets, outletCities } from "@/content";

/**
 * Client-side outlet finder: text search + city filter.
 * Reads entirely from the content layer — new outlets appear automatically.
 */
export default function OutletFinder() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState<string>("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return outlets.filter((o) => {
      const matchesCity = city === "all" || o.city === city;
      const matchesQuery =
        q.length === 0 ||
        [o.name, o.city, o.area, o.address]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return matchesCity && matchesQuery;
    });
  }, [query, city]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search outlets</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city, area or outlet name…"
            className="w-full rounded-full border border-sand bg-parchment px-5 py-3 text-sm text-ink placeholder:text-ink-soft/70 focus:border-copper focus:outline-none"
          />
        </label>
        <div className="flex gap-2" role="group" aria-label="Filter by city">
          <FilterChip
            active={city === "all"}
            onClick={() => setCity("all")}
            label="All cities"
          />
          {outletCities.map((c) => (
            <FilterChip
              key={c}
              active={city === c}
              onClick={() => setCity(city === c ? "all" : c)}
              label={c}
            />
          ))}
        </div>
      </div>

      {results.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {results.map((outlet) => (
            <OutletCard key={outlet.id} outlet={outlet} />
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-2xl bg-parchment p-10 text-center text-ink-soft">
          No outlets match your search yet — we&apos;re growing! Try another
          city.
        </p>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-forest text-cream"
          : "border border-sand bg-parchment text-ink hover:border-copper"
      }`}
    >
      {label}
    </button>
  );
}
