"use client";

import React from "react";
import {
  LayoutGrid,
  Home,
  BookOpen,
  UtensilsCrossed,
  Sparkles,
  MapPin,
  Palette,
  Layers,
} from "lucide-react";
import { PAGE_CATEGORIES } from "@/lib/image-registry";

interface AdminSidebarProps {
  selectedPage: string;
  onSelectPage: (page: string) => void;
  counts: Record<string, number>;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutGrid: <LayoutGrid className="h-4 w-4" />,
  Home: <Home className="h-4 w-4" />,
  BookOpen: <BookOpen className="h-4 w-4" />,
  UtensilsCrossed: <UtensilsCrossed className="h-4 w-4" />,
  Sparkles: <Sparkles className="h-4 w-4" />,
  MapPin: <MapPin className="h-4 w-4" />,
  Palette: <Palette className="h-4 w-4" />,
};

export default function AdminSidebar({
  selectedPage,
  onSelectPage,
  counts,
}: AdminSidebarProps) {
  return (
    <aside className="w-full shrink-0 md:w-64">
      <div className="sticky top-20 rounded-3xl border border-sand/70 bg-parchment/80 p-4 shadow-sm backdrop-blur-sm">
        <div className="mb-3 px-3 pt-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-copper-deep">
            Page Filter
          </p>
        </div>

        <nav className="flex flex-row flex-wrap gap-1 md:flex-col">
          {PAGE_CATEGORIES.map((cat) => {
            const isActive = selectedPage === cat.id;
            const count = counts[cat.id] ?? 0;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectPage(cat.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-forest text-cream shadow-sm"
                    : "text-ink hover:bg-cream hover:text-copper-deep"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? "text-sand" : "text-copper-deep"}>
                    {ICON_MAP[cat.icon] || <Layers className="h-4 w-4" />}
                  </span>
                  <span>{cat.label}</span>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                    isActive
                      ? "bg-white/20 text-cream"
                      : "bg-sand/40 text-ink-soft"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
