"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/* Eyebrow — small copper caps label above headings                     */
/* ------------------------------------------------------------------ */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-copper-deep">
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Section — consistent vertical rhythm + max width                     */
/* ------------------------------------------------------------------ */
export function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`relative px-4 py-16 sm:px-6 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CTAButton — primary (forest) / secondary (outline) / light           */
/* ------------------------------------------------------------------ */
export function CTAButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "light";
  className?: string;
}) {
  const styles = {
    primary:
      "bg-forest text-cream hover:bg-forest-deep",
    secondary:
      "border-2 border-forest text-forest hover:bg-forest hover:text-cream",
    light:
      "bg-cream text-forest hover:bg-parchment",
  } as const;

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold tracking-wide transition-colors ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Reveal — subtle fade/rise on scroll (the only motion language)       */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* PageHero — interior-page header (eyebrow + display title + copy)     */
/* ------------------------------------------------------------------ */
export function PageHero({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="relative overflow-hidden px-4 pb-14 pt-16 sm:px-6 sm:pb-20 sm:pt-24">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-6xl">
            {title}
          </h1>
          {copy && (
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
              {copy}
            </p>
          )}
        </Reveal>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FoodImage — next/image wrapper with consistent rounded treatment     */
/* ------------------------------------------------------------------ */
export function FoodImage({
  src,
  alt,
  className = "",
  priority = false,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
        className="object-cover transition-transform duration-700 hover:scale-[1.03]"
      />
    </div>
  );
}
