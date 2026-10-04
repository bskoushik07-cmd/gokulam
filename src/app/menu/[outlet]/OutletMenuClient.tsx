"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Section, Reveal, Eyebrow } from "@/components/ui";
import { MenuCategoryBlock } from "@/components/cards";
import { useMenu } from "@/context/MenuContext";
import { OutletMenuInfo } from "@/content/menu";
import {
  MapPin,
  Clock,
  Phone,
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Filter,
  X,
  RefreshCw,
} from "lucide-react";

interface OutletMenuClientProps {
  menuInfo: OutletMenuInfo;
  outletParam: string;
}

const DIET_FILTERS = [
  { id: "all", label: "All Items" },
  { id: "signature", label: "★ Signature" },
  { id: "jain", label: "🌱 Jain Option" },
  { id: "spicy", label: "🌶 Spicy" },
  { id: "chef-special", label: "👨‍🍳 Chef's Special" },
  { id: "combo", label: "🍱 Value Combos" },
];

export default function OutletMenuClient({
  menuInfo,
  outletParam,
}: OutletMenuClientProps) {
  const { getCategoriesForOutlet, isLoading } = useMenu();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const isJanpath =
    outletParam.toLowerCase().includes("janpath") ||
    outletParam.toLowerCase().includes("janpadh") ||
    menuInfo.slug === "janpath";

  const otherOutletSlug = isJanpath ? "sector-62" : "janpath";
  const otherOutletName = isJanpath ? "Gokulam Sector 62" : "Gokulam Janpath";

  // Get live categories from MenuContext (Supabase / Local cache / Static fallback)
  const categories = useMemo(() => {
    return getCategoriesForOutlet(outletParam);
  }, [getCategoriesForOutlet, outletParam]);

  // Filtered categories based on search and dietary filter
  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => {
        const matchingItems = cat.items.filter((item) => {
          // Dietary tag filter
          if (activeFilter !== "all") {
            const hasTag = item.tags && item.tags.includes(activeFilter as any);
            if (!hasTag) return false;
          }

          // Search query filter
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            const nameMatch = item.name.toLowerCase().includes(q);
            const descMatch = item.description.toLowerCase().includes(q);
            const servingMatch = item.servingDetails?.toLowerCase().includes(q);
            const catMatch = cat.title.toLowerCase().includes(q);
            if (!nameMatch && !descMatch && !servingMatch && !catMatch) {
              return false;
            }
          }

          return true;
        });

        return {
          ...cat,
          items: matchingItems,
        };
      })
      .filter((cat) => cat.items.length > 0);
  }, [categories, searchQuery, activeFilter]);

  const totalDishes = useMemo(() => {
    return filteredCategories.reduce((sum, cat) => sum + cat.items.length, 0);
  }, [filteredCategories]);

  return (
    <main className="min-h-screen bg-parchment/30">
      {/* Outlet Menu Header / Hero */}
      <section className="relative overflow-hidden border-b border-copper/20 bg-cream pt-10 pb-12 sm:pt-14 sm:pb-16">
        <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none bg-[radial-gradient(#d4a373_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb & Branch Pill Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-copper-deep">
              <Link href="/menu" className="hover:underline">
                Menus
              </Link>
              <span>/</span>
              <span className="text-ink">{menuInfo.name}</span>
            </div>

            {/* Outlet Switcher Pills */}
            <div className="inline-flex rounded-full border border-copper/30 bg-parchment p-1 shadow-sm">
              <Link
                href="/menu/janpath"
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  isJanpath
                    ? "bg-forest text-cream shadow"
                    : "text-ink hover:text-copper-deep"
                }`}
              >
                Gokulam Janpath
              </Link>
              <Link
                href="/menu/sector-62"
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  !isJanpath
                    ? "bg-forest text-cream shadow"
                    : "text-ink hover:text-copper-deep"
                }`}
              >
                Gokulam Sector 62
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <div className="flex items-center gap-3">
                <Eyebrow>{menuInfo.tagline}</Eyebrow>
                <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200">
                  100% Pure Vegetarian
                </span>
              </div>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
                {menuInfo.name} Menu
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
                Authentic Karnataka & South Indian breakfast rituals, Benne dosas, plate thatte idlis, royal thalis, and slow-dripped Chikmagalur filter coffee.
              </p>

              {/* Live Count & Search Quick Jump */}
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-ink-soft">
                <span className="font-semibold text-copper-deep bg-copper/10 px-3 py-1.5 rounded-full border border-copper/20">
                  {categories.reduce((acc, c) => acc + c.items.length, 0)} Handcrafted Dishes
                </span>
                <span className="font-semibold text-forest bg-forest/10 px-3 py-1.5 rounded-full border border-forest/20">
                  {categories.length} Heritage Categories
                </span>
              </div>
            </div>

            {/* Quick Outlet Details Box */}
            <div className="rounded-3xl border border-copper/30 bg-white/90 p-6 shadow-sm backdrop-blur-sm sm:p-7">
              <div className="flex items-center justify-between border-b border-sand/60 pb-3.5">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-copper-deep">
                  <Sparkles className="h-4 w-4" /> Outlet Information
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Open Today
                </span>
              </div>

              <div className="mt-4 space-y-3 text-xs sm:text-sm text-ink-soft">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-copper-deep" />
                  <span className="text-ink font-medium">{menuInfo.address}</span>
                </div>
                {menuInfo.hours && (
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 shrink-0 text-copper-deep" />
                    <span>{menuInfo.hours}</span>
                  </div>
                )}
                {menuInfo.phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 shrink-0 text-copper-deep" />
                    <a
                      href={`tel:${menuInfo.phone.replace(/\s/g, "")}`}
                      className="font-medium text-copper-deep hover:underline"
                    >
                      {menuInfo.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3.5 border-t border-sand/60 flex items-center justify-between">
                <Link
                  href={`/outlets/${menuInfo.id}`}
                  className="text-xs font-bold text-copper-deep hover:underline flex items-center gap-1"
                >
                  <span>Outlet Page & Map</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={`/menu/${otherOutletSlug}`}
                  className="text-xs font-semibold text-ink-soft hover:text-ink hover:underline flex items-center gap-1"
                >
                  <span>Switch Outlet</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sticky Search & Category Quick Nav Bar */}
      <div className="sticky top-[65px] z-30 border-y border-copper/20 bg-cream/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          {/* Top row: Search input & dietary tag filter buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-sand/60">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes (e.g., Thatte Idli, Benne Masala, Filter Coffee)..."
                className="w-full rounded-full border border-copper/30 bg-white px-4 py-2 pl-9 text-xs text-ink placeholder-ink-soft/50 shadow-inner outline-none focus:border-copper focus:ring-2 focus:ring-copper/20"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-copper-deep" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2 text-xs text-ink-soft hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Dietary Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {DIET_FILTERS.map((df) => (
                <button
                  key={df.id}
                  type="button"
                  onClick={() => setActiveFilter(df.id)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all ${
                    activeFilter === df.id
                      ? "bg-copper-deep text-cream shadow-sm"
                      : "bg-parchment text-ink hover:bg-sand/60"
                  }`}
                >
                  {df.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Navigation Pills */}
          <nav
            aria-label="Menu categories"
            className="flex items-center gap-2 overflow-x-auto pt-2.5 scrollbar-none"
          >
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-copper-deep mr-1 hidden md:inline">
              Jump To:
            </span>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`#${cat.slug}`}
                className="shrink-0 rounded-full border border-sand bg-parchment px-3.5 py-1.5 text-xs font-medium text-ink transition-colors hover:border-copper hover:bg-white hover:text-copper-deep active:scale-95"
              >
                {cat.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Menu Categories & Items List */}
      <Section className="py-10 sm:py-16">
        {filteredCategories.length > 0 ? (
          <div className="space-y-16 sm:space-y-20">
            {filteredCategories.map((cat) => (
              <MenuCategoryBlock key={cat.id} category={cat} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-sand/80 bg-parchment/50 p-12 text-center">
            <Search className="h-10 w-10 text-copper-deep/40" />
            <h3 className="mt-3 font-display text-xl font-bold text-ink">
              No dishes found
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-ink-soft">
              No items matched &ldquo;{searchQuery}&rdquo; with filter &ldquo;{activeFilter}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
              className="mt-5 rounded-full bg-forest px-5 py-2.5 text-xs font-semibold text-cream hover:bg-forest-deep"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom Dining CTA Banner */}
        <Reveal className="mt-20 overflow-hidden rounded-3xl bg-gradient-to-br from-forest via-forest to-forest-deep p-8 text-center text-cream shadow-xl sm:p-12">
          <div className="mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-cream/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-copper">
              <CheckCircle2 className="h-3.5 w-3.5" /> 100% Pure Vegetarian South Indian Dining
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
              Experience {menuInfo.name}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-cream/80 sm:text-base">
              Freshly prepared with pure ghee, authentic spices, and age-old recipes. Walk in anytime or call ahead for table bookings.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href={`/outlets/${menuInfo.id}`}
                className="rounded-full bg-cream px-8 py-3.5 text-sm font-semibold text-forest shadow transition-all hover:bg-parchment hover:scale-102"
              >
                View Directions & Timings
              </Link>
              <Link
                href={`/menu/${otherOutletSlug}`}
                className="rounded-full border border-cream/40 bg-cream/5 px-6 py-3.5 text-sm font-semibold text-cream transition-all hover:bg-cream/15"
              >
                View {otherOutletName} Menu
              </Link>
            </div>
          </div>
        </Reveal>
      </Section>
    </main>
  );
}
