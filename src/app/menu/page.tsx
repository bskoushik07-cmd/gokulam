import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Reveal, Eyebrow } from "@/components/ui";
import { janpathMenu, sector62Menu, janpathMenuCategories, noidaMenuCategories } from "@/content/menu";
import { MapPin, ArrowRight, Clock, UtensilsCrossed, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Menus — Gokulam Janpath & Sector 62",
  description:
    "Select your preferred Gokulam outlet to explore our authentic South Indian menus in Janpath (Delhi) and Sector 62 (Noida).",
};

export default function MenuPage() {
  return (
    <div className="min-h-[85vh] flex flex-col justify-between bg-parchment/20 pb-20">
      <div>
        <PageHero
          eyebrow="Our Menus"
          title="South India, served your way."
          copy="Select your preferred Gokulam outlet to explore the complete authentic South Indian menu, portion details, and regional specialties."
        />

        {/* Outlet Selection Cards */}
        <section className="mx-auto -mt-4 max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Card 1: Gokulam Janpath */}
            <Reveal delay={0.05}>
              <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-copper/30 bg-gradient-to-br from-cream via-white to-parchment p-8 shadow-sm transition-all duration-300 hover:border-copper hover:shadow-xl sm:p-10">
                <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 rounded-full bg-copper/10 p-12 blur-2xl pointer-events-none transition-all duration-500 group-hover:bg-copper/20" />
                
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-forest">
                      <MapPin className="h-3.5 w-3.5 text-forest" /> Janpath, Delhi
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      100% PURE VEG
                    </span>
                  </div>

                  <h2 className="mt-5 font-display text-2xl font-bold text-ink sm:text-3xl group-hover:text-forest transition-colors">
                    Gokulam Janpath
                  </h2>
                  <p className="mt-2.5 text-sm text-ink-soft leading-relaxed">
                    {janpathMenu.address}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-copper-deep font-semibold">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Open {janpathMenu.hours}</span>
                  </p>
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-sand/70">
                  <span className="text-xs font-medium text-ink-soft">
                    {janpathMenuCategories.length} Categories · 75+ Dishes
                  </span>
                  <Link
                    href="/menu/janpath"
                    className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-xs font-bold uppercase tracking-wider text-cream shadow-md transition-all hover:bg-forest-deep hover:shadow-lg active:scale-95"
                  >
                    <span>View Janpath Menu</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Card 2: Gokulam Sector 62 */}
            <Reveal delay={0.1}>
              <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-copper/30 bg-gradient-to-br from-cream via-white to-parchment p-8 shadow-sm transition-all duration-300 hover:border-copper hover:shadow-xl sm:p-10">
                <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 rounded-full bg-copper/10 p-12 blur-2xl pointer-events-none transition-all duration-500 group-hover:bg-copper/20" />
                
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-forest">
                      <MapPin className="h-3.5 w-3.5 text-forest" /> Sector 62, Noida
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      100% PURE VEG
                    </span>
                  </div>

                  <h2 className="mt-5 font-display text-2xl font-bold text-ink sm:text-3xl group-hover:text-forest transition-colors">
                    Gokulam Sector 62
                  </h2>
                  <p className="mt-2.5 text-sm text-ink-soft leading-relaxed">
                    {sector62Menu.address}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-copper-deep font-semibold">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Open {sector62Menu.hours}</span>
                  </p>
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-sand/70">
                  <span className="text-xs font-medium text-ink-soft">
                    {noidaMenuCategories.length} Categories · 58 Dishes
                  </span>
                  <Link
                    href="/menu/sector-62"
                    className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-xs font-bold uppercase tracking-wider text-cream shadow-md transition-all hover:bg-forest-deep hover:shadow-lg active:scale-95"
                  >
                    <span>View Sector 62 Menu</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  );
}
