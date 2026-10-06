"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * SCROLL-JOURNEY ROUTE
 *
 * A signature homepage journey path that begins near Mysore Palace in the
 * hero section (South India origin) and gracefully weaves down the page,
 * culminating directly at India Gate (Delhi / North India destination).
 */

interface RouteGeometry {
  path: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

/** Build the route in real pixels so it never stretches on narrow/tall pages. */
function buildRoute(w: number, h: number): RouteGeometry {
  const isDesktop = w > 1024;
  const isTablet = w > 640;

  // Start near the Mysore Palace promenade in the Hero section
  const startY = isDesktop ? 680 : (isTablet ? 560 : 480);
  // End directly at India Gate archway / base at the bottom section
  const endY = h - (isDesktop ? 160 : (isTablet ? 140 : 120));

  const startX = isDesktop ? 0.66 * w : (isTablet ? 0.58 * w : 0.50 * w);
  const endX = isDesktop ? 0.76 * w : (isTablet ? 0.68 * w : 0.50 * w);

  if (endY <= startY) {
    return {
      path: `M ${startX} ${startY} L ${endX} ${endY}`,
      startX,
      startY,
      endX,
      endY,
    };
  }

  const totalDist = endY - startY;
  // Natural wave spacing per curve swing
  const segments = Math.max(3, Math.round(totalDist / 540));
  const stepY = totalDist / segments;

  // Waypoints swing naturally across the content flow without blocking text
  const waypoints = isDesktop
    ? [0.66, 0.48, 0.36, 0.58, 0.42, 0.64, 0.48, 0.76]
    : [0.52, 0.40, 0.60, 0.44, 0.58, 0.48, 0.50];

  let d = `M ${startX} ${startY}`;
  let prevX = startX;
  let prevY = startY;

  for (let i = 1; i <= segments; i++) {
    const curY = startY + i * stepY;
    const curX = i === segments ? endX : waypoints[i % waypoints.length] * w;
    const midY = prevY + (curY - prevY) / 2;

    d += ` C ${prevX} ${midY}, ${curX} ${midY}, ${curX} ${curY}`;
    prevX = curX;
    prevY = curY;
  }

  return { path: d, startX, startY, endX, endY };
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

  const routeGeo = useMemo(() => {
    return box.h > 600
      ? buildRoute(box.w, box.h)
      : { path: "M 0 0", startX: 0, startY: 0, endX: 0, endY: 0 };
  }, [box.w, box.h]);

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
          end: "92% bottom",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });
    });

    /* Refresh once images / layout settle */
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    /* Also refresh after a short delay to catch dynamic content */
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 1200);

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
            {/* Solid white path: the "pen" that reveals the dashed line. */}
            <path
              ref={maskPathRef}
              d={routeGeo.path}
              fill="none"
              stroke="#fff"
              strokeWidth="20"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1}
            />
          </mask>

          {/* Arrowhead marker pointing at destination */}
          <marker
            id="route-arrowhead"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#b26f3b" />
          </marker>
        </defs>

        <g>
          {/* Start Point Marker near Mysore Palace */}
          {routeGeo.startY > 0 && (
            <g className="opacity-90">
              <circle
                cx={routeGeo.startX}
                cy={routeGeo.startY}
                r="7"
                fill="#b26f3b"
                opacity="0.25"
              />
              <circle
                cx={routeGeo.startX}
                cy={routeGeo.startY}
                r="4"
                fill="#b26f3b"
              />
              <circle
                cx={routeGeo.startX}
                cy={routeGeo.startY}
                r="1.5"
                fill="#f7f2e6"
              />
            </g>
          )}

          {/* Copper dashed route, revealed by the mask as you scroll */}
          <path
            data-route
            d={routeGeo.path}
            fill="none"
            stroke="var(--color-copper)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="10 8"
            opacity="0.85"
            mask="url(#gokulam-route-mask)"
            markerEnd="url(#route-arrowhead)"
          />

          {/* End Destination Marker directly pointing into India Gate */}
          {routeGeo.endY > 0 && (
            <g className="opacity-90">
              <circle
                cx={routeGeo.endX}
                cy={routeGeo.endY}
                r="10"
                fill="#b26f3b"
                opacity="0.2"
                className="animate-ping"
              />
              <circle
                cx={routeGeo.endX}
                cy={routeGeo.endY}
                r="5.5"
                fill="#b26f3b"
              />
              <circle
                cx={routeGeo.endX}
                cy={routeGeo.endY}
                r="2"
                fill="#f7f2e6"
              />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
