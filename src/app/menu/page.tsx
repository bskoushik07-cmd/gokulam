import type { Metadata } from "next";
import Link from "next/link";
import { Section, PageHero, Reveal } from "@/components/ui";
import { MenuCategoryBlock } from "@/components/cards";
import { menuCategories } from "@/content";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "The Gokulam master menu — breakfast, dosas, idlis & vadas, thalis, beverages and desserts. Classics, comfort food and flavours for every kind of day.",
};

export default function MenuPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Menu"
        title="South India, served your way."
        copy="A selection of classics, comfort food and flavours made for every kind of day."
      />

      {/* Category quick-nav */}
      <div className="sticky top-[65px] z-30 border-y border-sand/70 bg-cream/90 backdrop-blur-md">
        <nav
          aria-label="Menu categories"
          className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6"
        >
          {menuCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`#${cat.slug}`}
              className="shrink-0 rounded-full border border-sand bg-parchment px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-copper hover:text-copper-deep"
            >
              {cat.title}
            </Link>
          ))}
        </nav>
      </div>

      <Section>
        <div className="space-y-20">
          {menuCategories.map((cat) => (
            <MenuCategoryBlock key={cat.id} category={cat} />
          ))}
        </div>

        <Reveal className="mt-20 rounded-2xl bg-forest p-8 text-center text-cream sm:p-12">
          <h2 className="font-display text-3xl font-semibold">
            Hungry already?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-cream/75">
            Menus may vary slightly by outlet. Call ahead for the day&apos;s
            specials and seasonal dishes.
          </p>
          <div className="mt-6">
            <Link
              href="/outlets"
              className="inline-flex rounded-full bg-cream px-8 py-3.5 text-sm font-semibold text-forest transition-colors hover:bg-parchment"
            >
              Find an Outlet
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
