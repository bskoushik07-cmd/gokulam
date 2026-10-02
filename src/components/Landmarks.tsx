"use client";

import { useSiteImage } from "@/context/ImageContext";

/**
 * Client-supplied landmark illustrations for the scroll journey.
 * Transparent PNGs (white backgrounds removed) so the ink sits directly
 * on the paper texture. Decorative only (aria-hidden).
 */

export function MysorePalace({ className = "" }: { className?: string }) {
  const src = useSiteImage("home.mysore_palace", "/images/mysore-palace.png");
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={className}
    />
  );
}

export function IndiaGate({ className = "" }: { className?: string }) {
  const src = useSiteImage("home.india_gate", "/images/india-gate.png");
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={className}
    />
  );
}
