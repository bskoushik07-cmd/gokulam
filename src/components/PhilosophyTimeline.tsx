"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Pillar = { title: string; copy: string; badge: string };

/** Point + fraction-along of the (y-monotonic) scroll route at a given y, by binary search on length. */
function routeAt(path: SVGPathElement, y: number) {
  let lo = 0;
  let hi = path.getTotalLength();
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (path.getPointAtLength(mid).y < y) lo = mid;
    else hi = mid;
  }
  return { x: path.getPointAtLength(hi).x, f: hi / path.getTotalLength() };
}

/**
 * Timeline that rides the homepage ScrollRoute: each step's dot sits ON the
 * route at that step's height and the card goes to whichever side has room.
 * The route draws itself on scroll; each dot/card animates in as you reach it.
 */
export default function PhilosophyTimeline({ pillars }: { pillars: Pillar[] }) {
  const rootRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

    /* Snap dots onto the route and pick card sides (md+ only) */
    const place = () => {
      const path = document.querySelector<SVGPathElement>("path[data-route]");
      const svg = path?.ownerSVGElement;
      if (!path || !svg || window.innerWidth < 768) return;
      const svgTop = svg.getBoundingClientRect().top;
      root.querySelectorAll<HTMLElement>("[data-step]").forEach((li) => {
        const r = li.getBoundingClientRect();
        const dot = li.querySelector<HTMLElement>("[data-dot]")!;
        const { x, f } = routeAt(path, r.top + dot.offsetTop + 10 - svgTop);
        dot.dataset.f = String(f);
        const inLi = x - r.left;
        dot.style.left = `${inLi}px`;
        const card = li.querySelector<HTMLElement>("[data-card]")!;
        const badge = li.querySelector<HTMLElement>("[data-badge]")!;
        const bw = badge.offsetWidth;
        const cw = card.offsetWidth;
        const gap = 48;
        /* alternate: even steps text left / badge right, odd the reverse. Layout anchors on the
           route x clamped to the middle band so the alternation stays readable when the route swings wide. */
        const i = Number(li.dataset.i);
        const right = i % 2 === 1;
        const ax = Math.min(r.width * 0.7, Math.max(r.width * 0.3, inLi));
        li.dataset.side = right ? "right" : "left";
        if (right) {
          card.style.left = `${Math.min(ax + gap, r.width - cw)}px`;
          badge.style.left = `${Math.max(0, ax - gap / 2 - bw)}px`;
        } else {
          card.style.left = `${Math.max(0, ax - gap - cw)}px`;
          badge.style.left = `${Math.min(r.width - bw, ax + gap / 2)}px`;
        }
      });
    };
    root.querySelectorAll("img").forEach((img) => img.addEventListener("load", place));
    ScrollTrigger.addEventListener("refresh", place);
    place();
    /* route is rebuilt (new `d`) once the page is measured / resized -> re-snap */
    const routeEl = document.querySelector("path[data-route]");
    const mo = new MutationObserver(place);
    if (routeEl) mo.observe(routeEl, { attributes: true, attributeFilter: ["d"] });

    /* Fill each circle with a dot the moment the drawn route reaches it */
    const mask = document.querySelector("mask path");
    const dots = [...root.querySelectorAll<HTMLElement>("[data-dot]")];
    const light = (dot: HTMLElement, on: boolean) => {
      dot.dataset.on = on ? "1" : "";
      gsap.to(dot.firstElementChild, { scale: on ? 1 : 0, duration: 0.35, ease: "back.out(3)", overwrite: true });
      if (on) gsap.fromTo(dot, { boxShadow: "0 0 0 0 rgba(184,115,51,0.5)" }, { boxShadow: "0 0 0 14px rgba(184,115,51,0)", duration: 0.8, ease: "power2.out" });
    };
    const tick = () => {
      if (!mask) return;
      const drawn = 1 - Number(mask.getAttribute("stroke-dashoffset") ?? 1);
      dots.forEach((d) => {
        const on = drawn >= Number(d.dataset.f ?? 2);
        if (on !== !!d.dataset.on) light(d, on);
      });
    };
    gsap.ticker.add(tick);

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      root.querySelectorAll<HTMLElement>("[data-step]").forEach((li) => {
        gsap
          .timeline({ scrollTrigger: { trigger: li, start: "top 75%", once: true } })
          .from(li.querySelector("[data-dot]"), { scale: 0, duration: 0.4, ease: "back.out(2)" })
          .from(
            li.querySelector("[data-card]"),
            { opacity: 0, y: 40, duration: 0.7, ease: "power3.out" },
            "<0.1",
          );
      });
    });

    return () => {
      ScrollTrigger.removeEventListener("refresh", place);
      gsap.ticker.remove(tick);
      mo.disconnect();
      mm.revert();
    };
  }, []);

  return (
    <ol ref={rootRef} className="relative mt-14 list-none space-y-20 md:space-y-16">
      {pillars.map((p, i) => (
        <li
          key={p.title}
          data-step
          data-i={i}
          data-side="right"
          className="group relative flex flex-col items-start gap-6 md:block md:h-72"
        >
          <span
            data-dot
            className="absolute top-1/2 hidden h-5 w-5 -translate-x-1/2 rounded-full border-2 border-copper bg-cream md:block"
          >
            <span className="absolute inset-0.5 rounded-full bg-copper" style={{ transform: "scale(0)" }} />
          </span>
          <img
            src={p.badge}
            alt=""
            aria-hidden="true"
            draggable={false}
            data-badge
            className="h-56 w-auto object-contain md:absolute md:top-1/2 md:h-72 md:-translate-y-1/2"
          />
          <div
            data-card
            className="md:absolute md:top-1/2 md:w-[40%] md:-translate-y-1/2 md:group-data-[side=left]:text-right"
          >
            <p className="font-display text-xl font-semibold tracking-[0.2em] text-copper-deep">
              0{i + 1}
            </p>
            <h3 className="mt-2 font-display text-4xl font-semibold sm:text-5xl text-ink">{p.title}</h3>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">{p.copy}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
