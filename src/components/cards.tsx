"use client";

import Link from "next/link";
import type {
  Experience,
  MenuCategory,
  Outlet,
  SignatureDish,
} from "@/content";
import { FoodImage, Reveal } from "./ui";

import { useSiteImage } from "@/context/ImageContext";

/* ------------------------------------------------------------------ */
/* Tag pill labels                                                     */
/* ------------------------------------------------------------------ */
const TAG_LABELS: Record<string, string> = {
  spicy: "Spicy",
  jain: "Jain",
  signature: "Signature",
  seasonal: "Seasonal",
  "chef-special": "Chef's Special",
};

export function TagPill({ tag }: { tag: string }) {
  return (
    <span className="rounded-full bg-copper/15 px-2.5 py-0.5 text-xs font-medium text-copper-deep">
      {TAG_LABELS[tag] ?? tag}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* MenuCategory — one menu section with its items                       */
/* ------------------------------------------------------------------ */
export function MenuCategoryBlock({ category }: { category: MenuCategory }) {
  return (
    <div id={category.slug} className="scroll-mt-28">
      <Reveal>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
              {category.title}
            </h2>
            <p className="mt-2 text-ink-soft">{category.description}</p>
          </div>
        </div>
      </Reveal>
      <ul className="mt-8 grid gap-x-10 gap-y-7 md:grid-cols-2">
        {category.items.map((item, i) => (
          <Reveal key={item.name} delay={Math.min(i * 0.05, 0.2)}>
            <li className="border-b border-sand/70 pb-6">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-lg font-semibold text-ink">
                  {item.name}
                </h3>
                <span className="shrink-0 font-display text-lg font-semibold text-copper-deep">
                  ₹{item.price}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                {item.description}
              </p>
              {item.tags.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {item.tags.map((t) => (
                    <TagPill key={t} tag={t} />
                  ))}
                </div>
              )}
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SignatureDishCard — homepage hero-dish card                          */
/* ------------------------------------------------------------------ */
export function SignatureDishCard({ dish }: { dish: SignatureDish }) {
  const dishSlug = dish.name.toLowerCase().replace(/\s+/g, "-");
  const dynamicImage = useSiteImage(`signature.${dishSlug}`, dish.image);

  return (
    <Reveal className="h-full">
      <article className="group relative h-full overflow-hidden rounded-xl cursor-pointer">
        {/* Image with hover zoom */}
        <div className="overflow-hidden rounded-xl">
          <FoodImage
            src={dynamicImage}
            alt={dish.name}
            className="aspect-square transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>

        {/* Gradient overlay with text */}
        <div className="absolute inset-x-0 bottom-0 rounded-b-xl bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 pb-4 pt-16">
          <h3 className="font-display text-lg font-semibold text-cream leading-snug">
            {dish.name}
          </h3>
        </div>
      </article>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* OutletCard — reusable for homepage preview + outlets page            */
/* ------------------------------------------------------------------ */
export function OutletCard({ outlet }: { outlet: Outlet }) {
  const comingSoon = outlet.status === "coming-soon";
  const dynamicImage = useSiteImage(`outlet.${outlet.slug}`, outlet.image || "/images/DSC04900.jpg");
  const hasImage = outlet.image || dynamicImage;

  return (
    <Reveal className="h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-parchment shadow-sm transition-shadow hover:shadow-md">
        {hasImage ? (
          <FoodImage
            src={dynamicImage}
            alt={`${outlet.name} restaurant interior`}
            className="aspect-[16/10] rounded-b-none"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex aspect-[16/10] items-center justify-center bg-forest"
          >
            <span className="font-display text-2xl font-semibold tracking-[0.2em] text-cream/80">
              {outlet.city.toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-copper-deep">
              {outlet.city} · {outlet.area}
            </p>
            {comingSoon && (
              <span className="rounded-full bg-copper/15 px-3 py-1 text-xs font-semibold text-copper-deep">
                Coming Soon
              </span>
            )}
          </div>
          <h3 className="mt-2 font-display text-2xl font-semibold text-ink">
            {outlet.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {outlet.address}
          </p>
          {outlet.hours && (
            <p className="mt-1 text-sm text-ink-soft">{outlet.hours}</p>
          )}
          <div className="mt-5 flex flex-wrap gap-3 pt-1">
            {!comingSoon ? (
              <>
                <Link
                  href={`/outlets/${outlet.slug}`}
                  className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-forest-deep"
                >
                  View Outlet
                </Link>
                {outlet.mapsUrl && (
                  <a
                    href={outlet.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border-2 border-forest px-5 py-2 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-cream"
                  >
                    Directions
                  </a>
                )}
              </>
            ) : (
              <span className="text-sm font-medium text-ink-soft">
                Opening soon — follow us for the launch date.
              </span>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* ExperienceCard                                                      */
/* ------------------------------------------------------------------ */
const EXPERIENCE_KICKER: Record<Experience["type"], string> = {
  everyday: "Every day",
  seasonal: "Seasonal",
  special: "Special",
  celebrations: "Celebrations",
};

export function ExperienceCard({ experience }: { experience: Experience }) {
  const dynamicImage = useSiteImage(`experience.${experience.slug}`, experience.image);

  return (
    <Reveal className="h-full">
      <article className="group h-full overflow-hidden rounded-2xl bg-parchment shadow-sm transition-shadow hover:shadow-md">
        <FoodImage
          src={dynamicImage}
          alt={experience.title}
          className="aspect-[16/10] rounded-b-none"
        />
        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-copper-deep">
            {EXPERIENCE_KICKER[experience.type]}
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-ink">
            {experience.title}
          </h3>
          {experience.dates && (
            <p className="mt-1 text-sm font-medium text-copper-deep">
              {experience.dates}
            </p>
          )}
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {experience.description}
          </p>
        </div>
      </article>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* SocialGrid — dynamic tiles connected to CMS                        */
/* ------------------------------------------------------------------ */
export function SocialGrid() {
  const tile1 = useSiteImage("social.tile_1", "/images/hero-dosa.webp");
  const tile2 = useSiteImage("social.tile_2", "/images/sig-thali.webp");
  const tile3 = useSiteImage("social.tile_3", "/images/coffee-pour.webp");
  const tile4 = useSiteImage("social.tile_4", "/images/sig-idli.jpg");
  const tile5 = useSiteImage("social.tile_5", "/images/sig-vada.jpg");
  const tile6 = useSiteImage("social.tile_6", "/images/sig-filter-coffee.webp");

  const tiles = [
    { src: tile1, alt: "Crispy dosa on a banana leaf" },
    { src: tile2, alt: "South Indian thali" },
    { src: tile3, alt: "Filter coffee being poured" },
    { src: tile4, alt: "Soft idlis with sambar" },
    { src: tile5, alt: "Crisp medu vadas" },
    { src: tile6, alt: "Filter coffee in davara and tumbler" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      {tiles.map((tile, i) => (
        <Reveal key={tile.src + i} delay={Math.min(i * 0.06, 0.24)}>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Gokulam on Instagram — ${tile.alt}`}
            className="block"
          >
            <FoodImage
              src={tile.src}
              alt={tile.alt}
              className="aspect-square"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </a>
        </Reveal>
      ))}
    </div>
  );
}
