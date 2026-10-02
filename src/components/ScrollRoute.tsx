"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * SCROLL-JOURNEY ROUTE — the signature homepage motif.
 *
 * A full-page, absolutely-positioned SVG sits BEHIND every homepage section
 * (top to bottom). A dashed copper path winds from the hero (Mysore Palace)
 * down to the footer (India Gate) and draws itself as the user scrolls.
 *
 * How it works:
 *  - The path is generated in real pixels from the measured page size
 *    (viewBox = pixel size), so it never stretches on narrow/tall screens.
 *  - Two layers share the same path `d`:
 *      1. (removed) soft underglow;
 *      2. the bold copper dashed layer, clipped by an SVG <mask>.
 *  - The mask contains a solid white copy of the path with
 *    pathLength=1 / stroke-dasharray=1. GSAP ScrollTrigger scrubs its
 *    stroke-dashoffset from 1 → 0, progressively revealing the dashed
 *    copper line underneath — the route "draws itself" down the page.
 *  - `invalidateOnRefresh` keeps the scrub in sync once placeholder images
 *    finish loading and the page grows taller.
 */
/* x positions (fraction of width) the route swings between, top to bottom */
const SWINGS = [0.15, 0.42, 0.52, 0.4, 0.56, 0.45, 0.58];
const WAVE = 560; // px of page height per swing — same on every screen size
const START_Y = 300; // px, just under the palace doodle

/** Build the route in real pixels so it never stretches on narrow/tall pages. */
function buildRoute(w: number, h: number) {
  const n = Math.max(1, Math.round((h - START_Y) / WAVE));
  const step = (h - START_Y) / n;
  let x0 = SWINGS[0] * w;
  let d = `M ${x0} ${START_Y}`;
  for (let i = 1; i <= n; i++) {
    const x1 = (i === n ? 0.58 : SWINGS[i % SWINGS.length]) * w;
    const y0 = START_Y + (i - 1) * step;
    const ym = y0 + step / 2;
    d += ` C ${x0} ${ym}, ${x1} ${ym}, ${x1} ${y0 + step}`;
    x0 = x1;
  }
  return d;
}

export default function ScrollRoute({
  containerRef,
}: {
  /** Ref of the wrapper that contains ALL homepage sections */
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const maskPathRef = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() =>
      setBox({ w: el.clientWidth, h: el.clientHeight })
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const routeD = box.h > START_Y ? buildRoute(box.w, box.h) : "M 0 0";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const maskPath = maskPathRef.current;
    const container = containerRef.current;
    if (!maskPath || !container) return;

    /* Ensure the mask path starts fully hidden (attribute, not CSS) */
    gsap.set(maskPath, {
      attr: { "stroke-dashoffset": 1 },
    });

    const ctx = gsap.context(() => {
      gsap.to(maskPath, {
        attr: { "stroke-dashoffset": 0 },
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "90% bottom",
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });
    });

    /* Refresh once images / layout settle */
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    /* Also refresh after a short delay to catch lazy-loaded content */
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 1500);

    return () => {
      window.removeEventListener("load", onLoad);
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [containerRef]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${box.w || 1} ${box.h || 1}`}
      >
        <defs>
          <mask id="gokulam-route-mask">
            {/* Solid white path: the "pen" that reveals the dashed line.
                pathLength=1 normalises the length so dash math is trivial:
                offset 1 = fully hidden, 0 = fully drawn. */}
            <path
              ref={maskPathRef}
              d={routeD}
              fill="none"
              stroke="#fff"
              strokeWidth="16"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1}
            />
          </mask>
        </defs>

        <g>
        {/* Copper dashed route, revealed by the mask as you scroll */}
        <path
          data-route
          d={routeD}
          fill="none"
          stroke="var(--color-copper)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="12 9"
          opacity="0.9"
          mask="url(#gokulam-route-mask)"
        />

        </g>
      </svg>
    </div>
  );
}
