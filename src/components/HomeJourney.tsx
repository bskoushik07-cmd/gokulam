"use client";

import { useRef } from "react";
import Link from "next/link";
import ScrollRoute from "@/components/ScrollRoute";
import PhilosophyTimeline from "@/components/PhilosophyTimeline";
import StorySlideshow from "@/components/StorySlideshow";
import { MysorePalace, IndiaGate } from "@/components/Landmarks";
import { Leaf, Users, Sprout, MapPin, ArrowRight } from "lucide-react";
import {
  Section,
  Eyebrow,
  Reveal,
  CTAButton,
  FoodImage,
} from "@/components/ui";
import {
  SignatureDishCard,
  OutletCard,
  ExperienceCard,
} from "@/components/cards";
import InstagramReelsMarquee from "@/components/InstagramReelsMarquee";
import {
  menuCategories,
  signatureDishes,
  outlets,
  experiences,
} from "@/content";

import { useSiteImage } from "@/context/ImageContext";

/**
 * Homepage — all brief sections in order, wrapped in the scroll journey.
 * The ScrollRoute SVG sits behind EVERYTHING (z-0); sections sit above (z-10).
 */
export default function HomeJourney() {
  const journeyRef = useRef<HTMLDivElement>(null);

  const heroBgImage = useSiteImage("home.hero_bg", useSiteImage("home.hero", "/images/hero-heritage-palace.jpg"));
  const coffeePourImage = useSiteImage("home.coffee_pour", "/images/coffee-pour.webp");

  const traditionBadge = useSiteImage("badge.tradition", "/images/tradition-badge.png");
  const freshnessBadge = useSiteImage("badge.freshness", "/images/freshness-badge.png");
  const craftBadge = useSiteImage("badge.craft", "/images/craft-badge.png");
  const hospitalityBadge = useSiteImage("badge.hospitality", "/images/hospitality-badge.png");

  const pillars = [
    {
      title: "Tradition",
      badge: traditionBadge,
      copy: "Recipes inspired by the rich culinary heritage of South India.",
    },
    {
      title: "Freshness",
      badge: freshnessBadge,
      copy: "Fresh ingredients and freshly prepared food, every day.",
    },
    {
      title: "Craft",
      badge: craftBadge,
      copy: "Care in every tempering, every batter and every plate.",
    },
    {
      title: "Hospitality",
      badge: hospitalityBadge,
      copy: "The warmth of South Indian hospitality, served with every meal.",
    },
  ];

  return (
    <div ref={journeyRef} className="relative">
      <ScrollRoute containerRef={journeyRef} />

      <div className="relative z-10">
        {/* ============ 01 — HERO (HERITAGE EDITORIAL DESIGN) ============ */}
        <section className="relative overflow-hidden bg-cream min-h-[82vh] lg:min-h-[88vh] flex items-center border-b border-copper/15">
          {/* Background Heritage Architectural Panorama & Botanical Artwork */}
          <div className="absolute inset-0 z-0 pointer-events-none select-none">
            <img
              src={heroBgImage}
              alt="South Indian Heritage Palace Architecture & Botanical Art"
              className="w-full h-full object-cover object-right lg:object-[82%_center] opacity-90 mix-blend-multiply"
            />
            {/* Subtle soft gradient fade on the left to make typography pop crystal-clear */}
            <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/80 to-transparent w-full md:w-[72%] lg:w-[58%]" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cream via-cream/40 to-transparent" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 py-16 sm:py-20 lg:py-24 w-full">
            <div className="max-w-2xl lg:max-w-2xl">
              <Reveal>
                {/* H1 Heading */}
                <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.3rem] font-bold text-ink leading-[1.06] tracking-tight">
                  The soul of<br />
                  South India, <span className="italic font-normal text-copper-deep">on</span><br />
                  <span className="italic font-normal text-copper-deep">your plate.</span>
                </h1>

                {/* Sub-paragraph */}
                <p className="mt-6 text-base sm:text-lg leading-relaxed text-ink-soft font-body max-w-xl">
                  Authentic flavours from our roots, crafted with warmth and tradition. From crisp dosas to timeless South Indian meals, every bite at Gokulam brings people closer around the table.
                </p>

                {/* Action Buttons */}
                <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
                  <Link
                    href="/menu"
                    className="inline-flex items-center gap-2 rounded-full bg-forest px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-cream shadow-md transition-all hover:bg-forest-deep hover:shadow-xl active:scale-95"
                  >
                    <span>Explore Our Menu</span>
                    <span className="text-base leading-none">→</span>
                  </Link>

                  <Link
                    href="/outlets"
                    className="inline-flex items-center gap-2 rounded-full border border-forest bg-cream/60 backdrop-blur-xs px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-forest transition-all hover:bg-forest/10 active:scale-95"
                  >
                    <span>Find an Outlet</span>
                    <MapPin className="h-4 w-4 text-forest" />
                  </Link>
                </div>

                {/* Trust / Feature Badges Bar */}
                <div className="mt-12 sm:mt-14 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-ink-soft font-body font-medium">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-emerald-800 shrink-0" />
                    <span>Authentic Flavours</span>
                  </div>
                  
                  <span className="hidden sm:inline text-sand/90 select-none">|</span>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-copper-deep shrink-0" />
                    <span>Family Friendly</span>
                  </div>
                  
                  <span className="hidden sm:inline text-sand/90 select-none">|</span>
                  
                  <div className="flex items-center gap-2">
                    <Sprout className="h-4 w-4 text-emerald-800 shrink-0" />
                    <span>Always Fresh</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============ 02 — BRAND INTRODUCTION ============ */}
        <Section>
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <Eyebrow>The Gokulam Story</Eyebrow>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
                A taste of the South. A feeling of home.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ink-soft sm:text-lg">
                At Gokulam, South Indian cuisine is more than food. It is a
                celebration of tradition, family and flavour. Inspired by the
                diverse culinary traditions of South India, we bring together
                time-honoured recipes, fresh ingredients and thoughtful
                preparation to create food that feels familiar yet memorable.
              </p>
              <p className="mt-6 font-display text-xl italic text-copper-deep">
                Authentic. Comforting. Unmistakably Gokulam.
              </p>
            </Reveal>
          </div>
        </Section>

        {/* ============ 03 — PHILOSOPHY ============ */}
        <Section>
          <Reveal>
            <Eyebrow>The Gokulam Philosophy</Eyebrow>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Rooted in tradition. Made for today.
            </h2>
          </Reveal>
          <PhilosophyTimeline pillars={pillars} />
        </Section>

        {/* ============ 04 — MENU PREVIEW ============ */}
        <Section>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <Eyebrow>Our Menu</Eyebrow>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
                South India, served your way.
              </h2>
              <p className="mt-4 max-w-xl text-ink-soft">
                A selection of classics, comfort food and flavours made for
                every kind of day.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <CTAButton href="/menu">View Full Menu</CTAButton>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {menuCategories.map((cat, i) => (
              <CategoryPreviewCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        </Section>

        {/* ============ 05 — SIGNATURE DISHES ============ */}
        <Section>
          <Reveal>
            <Eyebrow>Gokulam Classics</Eyebrow>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Made to be remembered.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {signatureDishes.map((dish) => (
              <SignatureDishCard key={dish.name} dish={dish} />
            ))}
          </div>
        </Section>

        {/* ============ 06 — OUR STORY (split) ============ */}
        <Section>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <StorySlideshow className="aspect-[4/3]" />
            </Reveal>
            <Reveal delay={0.1}>
              <Eyebrow>Our Story</Eyebrow>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
                From the South, with love.
              </h2>
              <p className="mt-6 leading-relaxed text-ink-soft">
                Gokulam was born from a simple idea — to bring the warmth,
                authenticity and richness of South Indian food to more tables.
              </p>
              <p className="mt-4 leading-relaxed text-ink-soft">
                Our cuisine celebrates the everyday rituals that make South
                Indian dining special — the aroma of freshly brewed coffee, the
                sound of a dosa on a hot tawa, the first spoonful of sambar and
                the joy of sharing a meal.
              </p>
              <p className="mt-6 font-display text-xl italic text-copper-deep">
                This is Gokulam. A little taste of South India, wherever you
                are.
              </p>
              <div className="mt-8">
                <CTAButton href="/our-story" variant="secondary">
                  Read Our Story
                </CTAButton>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ============ 07 — EXPERIENCES ============ */}
        <Section>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <Eyebrow>Gokulam Experiences</Eyebrow>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
                More than a meal.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <CTAButton href="/experiences" variant="secondary">
                All Experiences
              </CTAButton>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        </Section>

        {/* ============ 08 — FILTER COFFEE ============ */}
        <Section>
          <Reveal>
            <div className="overflow-hidden rounded-[2rem] bg-forest text-cream">
              <div className="grid items-center lg:grid-cols-2">
                <FoodImage
                  src={coffeePourImage}
                  alt="Frothy South Indian filter coffee in a brass tumbler and davara"
                  className="aspect-[16/10] rounded-none lg:aspect-auto lg:h-full lg:min-h-[26rem]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="p-8 sm:p-12 lg:p-16">
                  <Eyebrow>
                    <span className="text-copper">Gokulam Rituals</span>
                  </Eyebrow>
                  <h2 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
                    And then, there&apos;s coffee.
                  </h2>
                  <p className="mt-6 leading-relaxed text-cream/80">
                    Slow brewed. Freshly poured. Best enjoyed the South Indian
                    way. Aromatic coffee decoction, balanced with hot milk and
                    served in the traditional tumbler and davara.
                  </p>
                  <div className="mt-8">
                    <CTAButton href="/menu#beverages" variant="light">
                      Explore Our Beverages
                    </CTAButton>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </Section>

        {/* ============ 09 — OUTLETS PREVIEW ============ */}
        <Section>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <Eyebrow>Outlets</Eyebrow>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
                Gokulam, nearer to you.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <CTAButton href="/outlets" variant="secondary">
                All Outlets
              </CTAButton>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {outlets.map((outlet) => (
              <OutletCard key={outlet.id} outlet={outlet} />
            ))}
          </div>
        </Section>

        {/* ============ 10 — COMMUNITY / INSTAGRAM REELS ============ */}
        <section className="relative px-0 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Reveal>
                <Eyebrow>Beyond the Table</Eyebrow>
                <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
                  Gokulam, beyond the table.
                </h2>
                <p className="mt-4 text-ink-soft">
                  Follow along for new dishes, stories from our kitchens, special
                  menus and everything happening across Gokulam.
                </p>
                <div className="mt-6">
                  <CTAButton
                    href="https://instagram.com"
                    variant="secondary"
                  >
                    Follow Us on Instagram
                  </CTAButton>
                </div>
              </Reveal>
            </div>
          </div>

          <div className="mt-10">
            <InstagramReelsMarquee />
          </div>
        </section>

        {/* ============ 11 — FINAL CTA WITH INDIA GATE ============ */}
        <section className="relative px-4 pt-10 pb-0 sm:px-6 sm:pt-16 lg:pt-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-end gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal className="pb-10 sm:pb-16 lg:pb-24">
                <h2 className="font-display text-4xl font-semibold leading-[1.08] text-ink sm:text-5xl lg:text-6xl">
                  Come hungry.{" "}
                  <span className="italic text-copper-deep">Leave happy.</span>
                </h2>
                <p className="mt-5 text-base sm:text-lg text-ink-soft max-w-lg leading-relaxed font-body">
                  From morning idlis to festive banana leaf feasts and dawn-to-dusk filter coffee. Step into Gokulam and make yourself at home.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <CTAButton href="/outlets">Find Your Outlet</CTAButton>
                  <CTAButton href="/menu" variant="secondary">
                    View Menu
                  </CTAButton>
                </div>
              </Reveal>

              <div className="flex justify-center lg:justify-end">
                <Reveal className="w-80 sm:w-[32rem] lg:w-[42rem] -mb-10 sm:-mb-16 lg:-mb-24 relative z-10">
                  <IndiaGate className="block w-full opacity-90 drop-shadow-md" />
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function CategoryPreviewCard({
  category,
  index,
}: {
  category: (typeof menuCategories)[0];
  index: number;
}) {
  const dynamicImage = useSiteImage(`menu.${category.slug}`, category.image);

  return (
    <Reveal delay={Math.min(index * 0.06, 0.24)}>
      <Link
        href={`/menu#${category.slug}`}
        className="group relative block overflow-hidden rounded-xl"
      >
        <div className="overflow-hidden rounded-xl">
          <FoodImage
            src={dynamicImage}
            alt={category.title}
            className="aspect-square transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 rounded-b-xl bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 pb-4 pt-16">
          <h3 className="font-display text-lg font-semibold text-cream leading-snug">
            {category.title}
          </h3>
        </div>
      </Link>
    </Reveal>
  );
}
